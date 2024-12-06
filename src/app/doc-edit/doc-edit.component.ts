import {
  AfterViewInit,
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
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { Doc } from '../doc.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DocsService } from '../docs/docs.service';
import { Subscription } from 'rxjs';
import { NgIf } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { DocCardComponent } from '../docs/doc-card/doc-card.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RealtimeService } from '../realtime.service';
import {
  DialogOverviewExampleDialog,
  ShareDialogComponent,
} from './share-dialog/share-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-doc-edit',
  standalone: true,
  imports: [
    NavDocEditComponent,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ShareDialogComponent,
    DialogOverviewExampleDialog,
  ],
  templateUrl: './doc-edit.component.html',
  styleUrls: ['./doc-edit.component.scss', './media-queries.scss'],
  providers: [
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} },
  ],
})
export class DocEditComponent implements OnInit, OnDestroy, AfterViewInit {
  addForm: FormGroup = new FormGroup({});
  id!: number;
  editMode = false;
  docs?: Doc[];
  subscription!: Subscription;
  saved = false;
  loading = true;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private docsService: DocsService,
    private cdr: ChangeDetectorRef,
    private realtimeService: RealtimeService
  ) {}

  @ViewChild('textarea', { static: false })
  textarea?: ElementRef<HTMLTextAreaElement>;
  @ViewChild('ctrlZBtn', { static: false })
  ctrlZBtn?: HTMLButtonElement;
  @ViewChild('ctrlYBtn', { static: false })
  ctrlYBtn?: HTMLButtonElement;

  userIdHost: string = '';

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

    this.realtimeService.docID = this.id;
    this.realtimeService
      .getUserIdHost()
      .then((userIdHost) => (this.userIdHost = userIdHost));

    // this.realtimeService.clearSharedUsers(this.id, this.userIdHost);

    this.realtimeService.cursorPos$.subscribe((payload) => {
      if (payload) {
        const { userId, position } = payload;
        this.updateRemoteCursor(userId, position);
      }
    });
  }

  private async loadDocs() {
    try {
      await this.apiService.fetchDoc(this.id);
    } catch (error) {
      console.error('Error loading docs:', error);
    }
  }

  initForm() {
    let docTitle = '';
    let docContent = '';
    if (this.editMode && this.id) {
      this.apiService.fetchDoc(this.id);
      const doc = this.docsService.getDoc(this.id);
      this.docsService.editMode = true;

      if (doc) {
        docTitle = doc.title;
        docContent = doc.content;
      } else {
        this.saved = true;
        this.router.navigate(['./page-not-found'], { relativeTo: this.route });
        console.error(`Document with ID ${this.id} not found.`);
      }
    }

    this.addForm.patchValue({
      title: docTitle,
      content: docContent,
    });
  }

  updateButtonStates() {
    if (!this.textarea?.nativeElement.classList.contains('ng-dirty')) {
      if (this.ctrlZBtn) {
        console.log(this.textarea?.nativeElement.classList);
        this.ctrlZBtn.disabled = true;
      }
      if (this.ctrlYBtn) {
        this.ctrlYBtn.disabled = true;
      }
    }
    if (this.textarea?.nativeElement.classList.contains('ng-dirty')) {
      if (this.ctrlZBtn) {
        this.ctrlZBtn.disabled = false;
      }
      if (this.ctrlYBtn) {
        this.ctrlYBtn.disabled = false;
      }
    }
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {}

  canDeactivate(): boolean {
    if (this.saved === false) {
      return confirm('You have unsaved changes. Do you really want to leave?');
    }
    return true;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  //--------------------------------

  onBold(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

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

  onCtrlZ(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (this.textarea) {
      this.textarea.nativeElement.focus();
      document.execCommand('undo');
    }
  }

  onCtrlY(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (this.textarea) {
      this.textarea.nativeElement.focus();
      document.execCommand('redo');
    }
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
    this.saved = true;

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
            this.router.navigate(['../docs'], { relativeTo: this.route });
            this.loading = false;
          });
        });
    }
  }

  //=======================================================

  @ViewChild('dialog', { static: false })
  dialog!: ShareDialogComponent;

  onShareNav() {
    this.dialog.openDialog();
  }

  getCursorPosition(textarea: HTMLTextAreaElement) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    return { start, end };
  }
  onKeyUp(event: KeyboardEvent, textarea: HTMLTextAreaElement) {
    const cursorPosition = this.getCursorPosition(textarea);
    this.realtimeService.sendCursorPos(cursorPosition);
  }

  remoteCursors: { [key: string]: any } = {};

  updateRemoteCursor(userId: number, pos: { start: number; end: number }) {
    this.remoteCursors[userId] = pos;
    console.log('Updated remote cursor:', userId, pos);
  }
}
