import { Component, Output, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ApiService } from '../../api.service';
import { Doc } from '../../doc.model';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-nav-doc-edit',
  templateUrl: './nav-doc-edit.component.html',
  styleUrls: ['./nav-doc-edit.component.scss', './media-queries.scss'],
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
})
export class NavDocEditComponent {
  @Output() btnClick = new EventEmitter<void>();
  onSaveBtn() {
    console.log('save btn clicked');
    this.btnClick.emit();
  }
}
