import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavDocEditComponent } from './nav-doc-edit/nav-doc-edit.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { Doc } from '../doc.model';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-doc-edit',
  standalone: true,
  imports: [
    NavDocEditComponent,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    RouterOutlet,
  ],
  templateUrl: './doc-edit.component.html',
  styleUrls: ['./doc-edit.component.scss', './media-queries.scss'],
})
export class DocEditComponent implements OnInit {
  addForm!: FormGroup;

  ngOnInit() {
    this.addForm = new FormGroup({
      title: new FormControl(null),
      content: new FormControl(null),
    });
  }

  // onSubmit() {
  //   console.log(this.addForm.value);
  // }

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

  constructor(private apiService: ApiService) {}

  @ViewChild('form') form!: HTMLFormElement;

  onBtnSave() {
    this.onSave(this.addForm.value);
  }

  onSave(docData: Doc) {
    const editTime = new Date().toString();
    this.apiService.postDoc(docData.title, editTime, docData.content);
    this.addForm.reset();
  }
}
