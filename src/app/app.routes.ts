import { Routes } from '@angular/router';
import { DocEditComponent } from './doc-edit/doc-edit.component';
import { DocsComponent } from './docs/docs.component';

export const routes: Routes = [
  {
    path: 'doc-edit',
    title: 'Edit | CollabSphere',
    component: DocEditComponent,
  },
  { path: 'docs', title: 'Documents | CollabSphere', component: DocsComponent },
  { path: '', redirectTo: '/docs', pathMatch: 'full' },
];
