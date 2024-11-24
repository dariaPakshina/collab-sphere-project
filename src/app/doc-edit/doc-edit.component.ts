import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { NavDocEditComponent } from './nav-doc-edit/nav-doc-edit.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormGroup,
  NgModel,
  ReactiveFormsModule,
} from '@angular/forms';
import { ApiService } from '../api.service';
import { Doc } from '../doc.model';
import { ActivatedRoute, Params, Router, RouterOutlet } from '@angular/router';
import { DocsService } from '../docs/docs.service';
import { Subscription } from 'rxjs';
import { JsonPipe, NgIf } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { DocCardComponent } from '../docs/doc-card/doc-card.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-doc-edit',
  standalone: true,
  imports: [
    NavDocEditComponent,
    MatFormFieldModule,
    JsonPipe,
    MatInputModule,
    NgIf,
    ReactiveFormsModule,
    MatButtonModule,
    RouterOutlet,
    MatProgressSpinnerModule,
  ],
  templateUrl: './doc-edit.component.html',
  styleUrls: ['./doc-edit.component.scss', './media-queries.scss'],
})
export class DocEditComponent implements OnInit, OnDestroy {
  addForm: FormGroup = new FormGroup({});
  id!: number;
  editMode = false;
  docs?: Doc[];
  subscription!: Subscription;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private docsService: DocsService,
    private cdr: ChangeDetectorRef
  ) {}

  loading = true;

  @ViewChild('textarea', { static: false })
  textarea?: ElementRef<HTMLTextAreaElement>;
  @ViewChild('ctrlZBtn', { static: false })
  ctrlZBtn?: ElementRef<HTMLButtonElement>;
  @ViewChild('ctrlYBtn', { static: false })
  ctrlYBtn?: ElementRef<HTMLButtonElement>;

  ngOnInit() {
    this.addForm = new FormGroup({
      title: new FormControl(null),
      content: new FormControl(null),
    });

    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
    });

    this.loadDocs().then(() => {
      this.docs = this.docsService.getDocs();
      this.initForm();
      this.loading = false;
    });

    this.subscription = this.docsService.docsChanged.subscribe(
      (docs: Doc[]) => {
        this.docs = docs;
      }
    );
  }

  private async loadDocs() {
    try {
      await this.apiService.fetchDocs();
    } catch (error) {
      console.error('Error loading docs:', error);
    }
  }

  initForm() {
    let docTitle = '';
    let docContent = '';
    if (this.editMode && this.id) {
      const doc = this.docsService.getDoc(this.id);
      this.docsService.editMode = true;

      if (doc) {
        console.log(`Editing document with ID ${this.id}:`, doc);
        docTitle = doc.title;
        docContent = doc.content;
      } else {
        console.error(`Document with ID ${this.id} not found.`);
      }
    }

    this.addForm.patchValue({
      title: docTitle,
      content: docContent,
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  //--------------------------------

  onBold() {
    if (this.textarea) {
      const start = this.textarea.nativeElement.selectionStart;
      const end = this.textarea.nativeElement.selectionEnd;

      if (start != end) {
        const text = this.textarea.nativeElement.value;
        const selectedText = text.substring(start, end);

        const boldText = `**${selectedText}**`;
        this.textarea.nativeElement.value =
          text.substring(0, start) + boldText + text.substring(end);
      }
    }
  }

  onCtrlZ() {
    document.execCommand('undo');
  }

  onCtrlY() {
    document.execCommand('redo');
  }

  // ---------------------------------

  @ViewChild('form') form!: HTMLFormElement;

  onBtnSave() {
    this.addForm.valueChanges.subscribe((value) => {
      console.log('Form value changed:', value);
    });

    const docData = this.addForm.value;

    if (this.editMode && this.id) {
      console.log('Editing document:', docData);
      this.onSave(this.id, docData); // Pass the document ID for updates
    } else {
      console.log('Creating new document:', docData);
      this.onSave(null, docData); // No ID means it's a new document
    }
  }

  @ViewChild(DocCardComponent) docCardComponent!: DocCardComponent;

  onSave(id: number | null, docData: Doc) {
    const editTime = new Date().toString();
    this.loading = true;

    if (id) {
      this.apiService
        .updateDoc(docData.title, editTime, docData.content)
        .then(() => {
          this.apiService.fetchDocs().then(() => {
            this.router.navigate(['../../docs'], { relativeTo: this.route });
            this.loading = false;
          });
        });
    } else {
      this.apiService
        .postDoc(docData.title, editTime, docData.content)
        .then(() => {
          this.apiService.fetchDocs().then(() => {
            this.router.navigate(['../'], { relativeTo: this.route });
            this.loading = false;
          });
        });
    }
  }
}
