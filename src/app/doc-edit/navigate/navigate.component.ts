import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-navigate',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
  ],
  template: '',
  styleUrl: './navigate.component.scss',
})
export class NavigateComponent {
  readonly dialog = inject(MatDialog);

  public openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ) {
    this.dialog.open(DialogAnimationsExampleDialog, {
      width: '400px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
}

@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: 'navigate.component.html',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ],
})
export class DialogAnimationsExampleDialog {
  readonly dialogRef = inject(MatDialogRef<DialogAnimationsExampleDialog>);

  @Output() btnClick = new EventEmitter();
  @Output() btnClickSave = new EventEmitter();
  onSaveBtn() {
    this.btnClick.emit();
    this.btnClickSave.emit();
  }

  onClick() {
    this.btnClick.emit();
  }
}
