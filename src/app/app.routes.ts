import { Routes } from '@angular/router';
import { DocEditComponent } from './doc-edit/doc-edit.component';
import { DocsComponent } from './docs/docs.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: 'doc-edit',
    title: 'Edit | CollabSphere',
    component: DocEditComponent,
  },
  {
    path: 'doc-edit/:id',
    title: 'Edit | CollabSphere',
    component: DocEditComponent,
  },
  { path: 'docs', title: 'Documents | CollabSphere', component: DocsComponent },
  { path: '', redirectTo: '/docs', pathMatch: 'full' },
  { path: '**', title: 'Page Not Found', component: PageNotFoundComponent },
];
