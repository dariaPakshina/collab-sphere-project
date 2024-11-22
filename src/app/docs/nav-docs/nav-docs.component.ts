import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { SortService } from '../sort.service';
import { NgIf } from '@angular/common';

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
  constructor(public sortService: SortService) {}

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

  onSelect() {}
}
