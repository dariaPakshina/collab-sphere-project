import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgFor } from '@angular/common';
import { Doc } from '../doc.model';
import { Subscription } from 'rxjs';
import { DocsService } from './docs.service';
import { DocCardComponent } from './doc-card/doc-card.component';
import { MatButton } from '@angular/material/button';
import { ApiService } from '../api.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-docs',
  standalone: true,
  imports: [
    MatToolbarModule,
    NgFor,
    DocCardComponent,
    MatButton,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatGridListModule,
  ],
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss', './media-queries.scss'],
})
export class DocsComponent implements OnInit, OnDestroy {
  docs?: Doc[];
  subscription!: Subscription;

  constructor(
    private docsService: DocsService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.loadDocs();

    this.docs = this.docsService.getDocs();

    this.subscription = this.docsService.docsChanged.subscribe(
      (docs: Doc[]) => {
        this.docs = docs;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private async loadDocs() {
    try {
      await this.apiService.fetchDocs(); // Fetch docs and populate service
    } catch (error) {
      console.error('Error loading docs:', error);
    }
  }
}
