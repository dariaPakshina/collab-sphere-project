import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-nav-doc-edit',
  templateUrl: './nav-doc-edit.component.html',
  styleUrl: './nav-doc-edit.component.scss',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
})
export class NavDocEditComponent {}
