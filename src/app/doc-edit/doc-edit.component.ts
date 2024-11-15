import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavDocEditComponent } from './nav-doc-edit/nav-doc-edit.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { text } from 'stream/consumers';
@Component({
  selector: 'app-doc-edit',
  standalone: true,
  imports: [
    NavDocEditComponent,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './doc-edit.component.html',
  styleUrls: ['./doc-edit.component.scss', './media-queries.scss'],
})
export class DocEditComponent implements OnInit {
  addForm!: FormGroup;
  ngOnInit() {
    this.addForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      content: new FormControl(null),
    });
  }

  onSubmit() {
    console.log(this.addForm.value);
  }

  //--------------------

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
}
