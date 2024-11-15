import { Component, OnInit } from '@angular/core';
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

  onBold() {}

  onItalic() {}

  onColor() {}
}
