import { Routes } from '@angular/router';
import { DocEditComponent } from './doc-edit/doc-edit.component';
import { DocsComponent } from './docs/docs.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { deactivateGuard } from './doc-edit/can-deactivate.guard';
import { StarterPageComponent } from './starter-page/starter-page.component';
import { AuthComponent } from './auth/auth.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'doc-edit',
    title: 'Edit | CollabSphere',
    component: DocEditComponent,
    canDeactivate: [deactivateGuard],
    canActivate: [authGuard],
  },
  {
    path: 'doc-edit/:id',
    title: 'Edit | CollabSphere',
    component: DocEditComponent,
    canDeactivate: [deactivateGuard],
    canActivate: [authGuard],
  },
  { path: 'auth', title: 'Sign up | CollabSphere', component: AuthComponent },
  {
    path: 'docs',
    title: 'Documents | CollabSphere',
    component: DocsComponent,
    canActivate: [authGuard],
  },
  { path: '', component: StarterPageComponent },
  { path: '**', title: 'Page Not Found', component: PageNotFoundComponent },
];
