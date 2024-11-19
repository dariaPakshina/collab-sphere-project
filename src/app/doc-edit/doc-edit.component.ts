import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NavDocEditComponent } from './nav-doc-edit/nav-doc-edit.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormGroup,
  NgForm,
  ReactiveFormsModule,
} from '@angular/forms';
import { ApiService } from '../api.service';
import { Doc } from '../doc.model';
import { ActivatedRoute, Params, Router, RouterOutlet } from '@angular/router';
import { DocsService } from '../docs/docs.service';
import { Subscription } from 'rxjs';
import { JsonPipe, NgIf } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

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

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
    });

    this.loadDocs().then(() => {
      this.docs = this.docsService.getDocs();
      this.initForm();
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

    if (this.editMode) {
      const doc = this.docsService.getDoc(this.id);
      this.docsService.editMode = true;

      if (doc) {
        docTitle = doc.title;
        docContent = doc.content;
      } else {
        console.error(`Document with ID ${this.id} not found.`);
      }
    }

    this.addForm = new FormGroup({
      title: new FormControl(docTitle),
      content: new FormControl(docContent),
    });
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  //--------------------------------

  @ViewChild('textarea', { static: false })
  textarea?: ElementRef<HTMLTextAreaElement>;

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
    this.onSave(this.addForm.value);
  }

  onSave(docData: Doc) {
    const editTime = new Date().toString();
    this.apiService.postDoc(docData.title, editTime, docData.content);
    this.addForm.reset();
  }

  //------------------------------------
}
