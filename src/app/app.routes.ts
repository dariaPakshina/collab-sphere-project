import { Routes } from '@angular/router';
import { DocEditComponent } from './doc-edit/doc-edit.component';
import { DocsComponent } from './docs/docs.component';

export const routes: Routes = [
  { path: 'doc-edit', component: DocEditComponent },
  { path: 'docs', component: DocsComponent },
];
