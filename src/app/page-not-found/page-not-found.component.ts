import { Component } from '@angular/core';
import { NavDocsComponent } from '../docs/nav-docs/nav-docs.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [NavDocsComponent, MatIconModule, RouterLink],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss',
})
export class PageNotFoundComponent {}
