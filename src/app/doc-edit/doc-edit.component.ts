import { Component } from '@angular/core';
import { NavDocEditComponent } from './nav-doc-edit/nav-doc-edit.component';
@Component({
  selector: 'app-doc-edit',
  standalone: true,
  imports: [NavDocEditComponent],
  templateUrl: './doc-edit.component.html',
  styleUrl: './doc-edit.component.scss',
})
export class DocEditComponent {}
