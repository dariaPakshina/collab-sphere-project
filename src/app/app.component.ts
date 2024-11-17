import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DocEditComponent } from './doc-edit/doc-edit.component';
import { NavDocEditComponent } from './doc-edit/nav-doc-edit/nav-doc-edit.component';
import { DocsComponent } from './docs/docs.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSlideToggleModule,
    DocEditComponent,
    NavDocEditComponent,
    DocsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'CollabSphere';
}
