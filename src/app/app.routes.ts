import { Routes } from '@angular/router';
import { deactivateGuard } from './doc-edit/can-deactivate.guard';
import { StarterPageComponent } from './starter-page/starter-page.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'doc-edit',
    title: 'Edit | CollabSphere',
    loadComponent: () =>
      import('./doc-edit/doc-edit.component').then(
        (mod) => mod.DocEditComponent
      ),
    canDeactivate: [deactivateGuard],
    canActivate: [authGuard],
  },
  {
    path: 'doc-edit/:id',
    title: 'Edit | CollabSphere',
    loadComponent: () =>
      import('./doc-edit/doc-edit.component').then(
        (mod) => mod.DocEditComponent
      ),
    canDeactivate: [deactivateGuard],
    canActivate: [authGuard],
  },
  {
    path: 'auth',
    title: 'Sign up | CollabSphere',
    loadComponent: () =>
      import('./auth/auth.component').then((mod) => mod.AuthComponent),
  },
  {
    path: 'confirm-email',
    title: 'CollabSphere',
    loadComponent: () =>
      import('./auth/confirm-email/confirm-email.component').then(
        (mod) => mod.ConfirmEmailComponent
      ),
  },
  {
    path: 'confirmed',
    title: 'CollabSphere',
    loadComponent: () =>
      import('./auth/confirmed/confirmed.component').then(
        (mod) => mod.ConfirmedComponent
      ),
  },
  {
    path: 'docs',
    title: 'Documents | CollabSphere',
    loadComponent: () =>
      import('./docs/docs.component').then((mod) => mod.DocsComponent),
    canActivate: [authGuard],
  },
  { path: '', component: StarterPageComponent },
  {
    path: '**',
    title: 'Page Not Found',
    loadComponent: () =>
      import('./page-not-found/page-not-found.component').then(
        (mod) => mod.PageNotFoundComponent
      ),
  },
];
