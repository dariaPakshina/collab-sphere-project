import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
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
import { ShareDialogComponent } from './share-dialog/share-dialog.component';
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
  editMode = false;
  docs?: Doc[];
  subscription!: Subscription;
  saved = false;
  loading = true;
  remoteText = '';

  @Input() id!: number;
  remoteCursors: { [key: string]: any } = {};

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

  // ---------------------------------

  async ngOnInit() {
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

    this.realtimeService.textarea = this.textarea;
    this.realtimeService.docID = this.id;
    const userId = await this.apiService.getUserId();

    if (!this.realtimeService.sharingMode) {
      const isShared = await this.checkIfShared(this.id, userId);
      if (isShared) {
        this.realtimeService.sharingMode = true;
        await this.realtimeService.initSharedAccount(this.id, userId);
      } else {
        console.log('Edit mode: host or non-shared document.');
      }
    } else {
      await this.realtimeService.initSharedAccount(this.id, userId);
    }

    this.realtimeService.cursorPos$.subscribe((payload) => {
      if (payload) {
        const { userId, position } = payload;
        console.log('Received cursor update:', payload);
        this.updateRemoteCursor(
          payload.payload.userId,
          payload.payload.position
        );
      }
    });

    this.realtimeService.content$.subscribe((content) => {
      this.remoteText = content;
      console.log('Updated textarea content:', content);
    });
  }

  // ---------------------------------

  onTextChange(event: Event) {
    const newContent = this.textarea!.nativeElement.value;
    this.realtimeService.sendTextUpdate(newContent);
  }

  async checkIfShared(docId: number, userId: string): Promise<boolean> {
    try {
      const { data, error } = await this.realtimeService.supabase
        .from('docs')
        .select('shared_users')
        .eq('id', docId)
        .single();

      if (error) {
        console.error('Error checking shared users:', error);
        return false;
      }

      if (data && Array.isArray(data.shared_users)) {
        console.log('shared user found, allow subscription');
        return data.shared_users.includes(userId);
      }

      console.warn('shared_users field is not an array or is missing.');
      return false;
    } catch (err) {
      console.error('Unexpected error in checkIfShared:', err);
      return false;
    }
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
        this.remoteText = doc.content;
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
    this.realtimeService.unshare();
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
      this.onSave(this.id, docData);
    } else {
      console.log('Creating new document:', docData);
      this.onSave(null, docData);
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

  // ---------------------------------

  getCursorPosition(textarea: HTMLTextAreaElement) {
    return { start: textarea.selectionStart, end: textarea.selectionEnd };
  }

  onKeyUp(event: KeyboardEvent, textarea: HTMLTextAreaElement) {
    const cursorPosition = this.getCursorPosition(textarea);
    this.realtimeService.sendCursorPos(cursorPosition);

    const target = event.target as HTMLTextAreaElement;
    const value = target.value;
    this.realtimeService.sendTextUpdate(value);
  }

  updateRemoteCursor(userId: string, pos: { start: number; end: number }) {
    this.remoteCursors[userId] = pos;
    console.log('Updated remote cursor:', userId, pos);
  }
}
