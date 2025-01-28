import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { SortService } from '../sort.service';
import { NgIf } from '@angular/common';
import { DocsService } from '../docs.service';
import { ApiService } from '../../api.service';
import { AuthService } from '../../auth/auth.service';
import { Clipboard } from '@angular/cdk/clipboard';

// dashboard navbar functionality

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
    public apiService: ApiService,
    public authService: AuthService,
    private clipboard: Clipboard
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

  onCancel() {
    this.docsService.selectMode = false;
  }

  onDeleteClick() {
    this.docsService.triggerDelete();
  }

  onLogOut() {
    this.authService.logOut();
  }

  //--------------------------

  copiedID = false;

  async onCopy() {
    const userId = await this.apiService.getUserId();
    if (!userId) {
      console.error('No user ID available. Cannot fetch ID.');
      return;
    }

    this.clipboard.copy(userId);

    this.copiedID = true;
    setTimeout(() => {
      this.copiedID = false;
    }, 3000);
  }
}
