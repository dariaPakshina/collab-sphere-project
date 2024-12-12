import { Component, EventEmitter, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RealtimeService } from '../../realtime.service';
import { NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-share-dialog',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
  template: '',
})
export class ShareDialogComponent {
  readonly dialog = inject(MatDialog);

  public openDialog() {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {});

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  standalone: true,
  templateUrl: './share-dialog.component.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    FormsModule,
    MatDialogContent,
    MatIcon,
    MatDialogActions,
    NgIf,
  ],
  styleUrl: './share-dialog.component.scss',
})
export class DialogOverviewExampleDialog {
  readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog>);
  realtimeService = inject(RealtimeService);

  constructor(private clipboard: Clipboard) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  userId = '';
  exactLengthPattern = '^.{36}$';
  currentURL = window.location.href;

  onShareChild() {
    console.log('share btn clicked', this.userId);
    this.realtimeService.onDialogShare(this.userId);
    this.dialogRef.close();
  }

  copiedID = false;

  copy(url: string) {
    this.clipboard.copy(url);

    this.copiedID = true;
    setTimeout(() => {
      this.copiedID = false;
    }, 3000);
  }
}
