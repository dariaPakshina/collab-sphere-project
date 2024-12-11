import { Component, inject, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { DocsService } from '../../docs/docs.service';
import { RealtimeService } from '../../realtime.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-nav-doc-edit',
  templateUrl: './nav-doc-edit.component.html',
  styleUrls: ['./nav-doc-edit.component.scss', './media-queries.scss'],
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, NgIf],
})
export class NavDocEditComponent {
  private _snackBar = inject(MatSnackBar);

  @Output() btnClick = new EventEmitter<void>();
  onSaveBtn() {
    this.btnClick.emit();
  }

  @Output() shareClick = new EventEmitter<void>();
  onShare() {
    this.shareClick.emit();
    this.openSnackBar('Sharing is on', 'Ok');
  }

  onUnshare() {
    this.realtimeService.unshare();
    this.openSnackBar('Sharing is off', 'Ok');
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private docsService: DocsService,
    public realtimeService: RealtimeService,
    private apiService: ApiService
  ) {}

  goToDocs() {
    if (this.docsService.editMode === false) {
      this.router.navigate(['../docs'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../../docs'], { relativeTo: this.route });
    }
  }

  async shareBtnOff() {
    const currentUserId = await this.apiService.getUserId();
    if (currentUserId === this.realtimeService.userIDShared) {
      return true;
    }
    return false;
  }
}
