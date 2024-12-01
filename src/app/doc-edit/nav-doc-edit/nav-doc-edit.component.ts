import { Component, Output, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { DocEditComponent } from '../doc-edit.component';
import { DocsService } from '../../docs/docs.service';

@Component({
  selector: 'app-nav-doc-edit',
  templateUrl: './nav-doc-edit.component.html',
  styleUrls: ['./nav-doc-edit.component.scss', './media-queries.scss'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    NgIf,
    DocEditComponent,
  ],
})
export class NavDocEditComponent {
  @Output() btnClick = new EventEmitter<void>();
  onSaveBtn() {
    console.log('save btn clicked');
    this.btnClick.emit();
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private docsService: DocsService
  ) {}

  goToDocs() {
    if (this.docsService.editMode === false) {
      this.router.navigate(['../docs'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../../docs'], { relativeTo: this.route });
    }
  }
}
