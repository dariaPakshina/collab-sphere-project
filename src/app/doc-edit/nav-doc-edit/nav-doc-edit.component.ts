import { Component, inject, Output, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { DocEditComponent } from '../doc-edit.component';
import { DocsService } from '../../docs/docs.service';
import { RealtimeService } from '../../realtime.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-nav-doc-edit',
  templateUrl: './nav-doc-edit.component.html',
  styleUrls: ['./nav-doc-edit.component.scss', './media-queries.scss'],
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, NgIf],
})
export class NavDocEditComponent {
  @Output() btnClick = new EventEmitter<void>();
  onSaveBtn() {
    console.log('save btn clicked');
    this.btnClick.emit();
  }

  @Output() shareClick = new EventEmitter<void>();
  onShare() {
    console.log('share btn clicked');
    this.shareClick.emit();
    this.openSnackBar('Sharing is on', 'Ok');
  }

  private _snackBar = inject(MatSnackBar);

  onUnshare() {
    this.realtimeService.unshareBtn();
    this.openSnackBar('Sharing is off', 'Ok');
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private docsService: DocsService,
    public realtimeService: RealtimeService
  ) {}

  goToDocs() {
    if (this.docsService.editMode === false) {
      this.router.navigate(['../docs'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../../docs'], { relativeTo: this.route });
    }
  }
}
