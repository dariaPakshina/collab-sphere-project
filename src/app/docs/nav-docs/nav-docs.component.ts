import { Component, ViewChild } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { SortService } from '../sort.service';
import { NgIf } from '@angular/common';
import { DocsService } from '../docs.service';
import { ApiService } from '../../api.service';
import { DocCardComponent } from '../doc-card/doc-card.component';

@Component({
  selector: 'app-nav-docs',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButton,
    RouterLink,
    MatMenuModule,
    MatIcon,
    NgIf,
  ],
  templateUrl: './nav-docs.component.html',
  styleUrl: './nav-docs.component.scss',
})
export class NavDocsComponent {
  constructor(
    public sortService: SortService,
    public docsService: DocsService,
    public apiService: ApiService
  ) {}

  onLatest() {
    this.sortService.onLatest();
  }
  onOldest() {
    this.sortService.onOldest();
  }
  onTitle() {
    this.sortService.onTitle();
  }

  //---------------

  onSelect() {
    this.docsService.selectMode = true;
  }

  onDeleteClick() {
    this.docsService.triggerDelete();
  }
}
