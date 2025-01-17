import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Doc } from '../doc.model';
import { Subscription } from 'rxjs';
import { DocsService } from './docs.service';
import { DocCardComponent } from './doc-card/doc-card.component';
import { ApiService } from '../api.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { NavDocsComponent } from './nav-docs/nav-docs.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SortPipe } from './sort.pipe';
import { SortService } from './sort.service';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-docs',
  standalone: true,
  imports: [
    NgFor,
    DocCardComponent,
    MatGridListModule,
    NavDocsComponent,
    MatProgressSpinnerModule,
    NgIf,
    RouterModule,
    RouterOutlet,
    SortPipe,
  ],
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss', './media-queries.scss'],
})
export class DocsComponent implements OnInit, OnDestroy {
  docs?: Doc[];
  subscription!: Subscription;
  loading = false;

  constructor(
    private docsService: DocsService,
    private apiService: ApiService,
    public sortService: SortService
  ) {}

  ngOnInit() {
    this.loading = true;
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
      await this.apiService.fetchDocs();
      this.loading = false;
    } catch (error) {
      console.error('Error loading docs:', error);
    }
  }
}
