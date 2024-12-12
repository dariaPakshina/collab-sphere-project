import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
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
    MatDialogActions,
  ],
  styleUrl: './share-dialog.component.scss',
})
export class DialogOverviewExampleDialog {
  readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog>);
  realtimeService = inject(RealtimeService);

  onNoClick(): void {
    this.dialogRef.close();
  }

  userId = '';

  // @Output() dialogShareClick = new EventEmitter<void>();
  onShareChild() {
    console.log('share btn clicked', this.userId);
    this.realtimeService.onDialogShare(this.userId);
    // this.dialogShareClick.emit();
    this.dialogRef.close();
  }
}
