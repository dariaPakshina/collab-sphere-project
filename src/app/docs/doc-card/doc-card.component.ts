import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Doc } from '../../doc.model';
import { NgIf, SlicePipe } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ApiService } from '../../api.service';
import {
  DeleteWindowComponent,
  DialogAnimationsExampleDialog,
} from './delete-window/delete-window.component';
import { DocsService } from '../docs.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-doc-card',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    SlicePipe,
    MatGridListModule,
    NgIf,
    RouterLink,
    RouterLinkActive,
    DialogAnimationsExampleDialog,
    MatCheckboxModule,
    DeleteWindowComponent,
  ],
  templateUrl: './doc-card.component.html',
  styleUrl: './doc-card.component.scss',
})
/**
 * displaying document cards on dashboards, with ids
 */
export class DocCardComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input() doc!: Doc;
  @Input() index!: number;

  private subscription!: Subscription;

  constructor(
    private apiService: ApiService,
    public docsService: DocsService
  ) {}

  @ViewChild('iconClose') iconClose!: HTMLElement;
  @ViewChild(DeleteWindowComponent)
  deleteWindowComponent!: DeleteWindowComponent;

  ngOnInit() {
    this.subscription = this.docsService.deleteAction$.subscribe(() => {
      this.sendSelectedIDs();
    });
  }

  ngAfterViewInit() {
    console.log(this.deleteWindowComponent);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onSendIDCard(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const docCardEl = target.closest('mat-card');

    if (docCardEl) {
      const docCardId = docCardEl.id;
      this.apiService.getID(+docCardId);
    } else {
      console.log('No mat-card element found');
    }
  }

  onSendIDIcon(event: MouseEvent) {
    event.stopPropagation();

    this.deleteWindowComponent.openDialog('0ms', '0ms');

    const target = event.target as HTMLElement;
    const docCardEl = target.closest('mat-card');
    if (docCardEl) {
      const docCardId = docCardEl.id;
      this.apiService.getID(+docCardId);
    } else {
      console.log('No mat-card element found');
    }
  }

  selectedID!: number;

  onSendIDCheckbox(event: MouseEvent) {
    event.stopPropagation();

    const checkbox = event.target as HTMLInputElement;
    const docCardEl = checkbox.closest('mat-card');

    if (docCardEl) {
      const docCardId = +docCardEl.id;
      if (checkbox.checked) {
        this.selectedID = docCardId;
      }
    } else {
      console.log('No mat-card element found');
    }
  }

  sendSelectedIDs() {
    if (this.docsService.selectMode && this.selectedID != undefined) {
      console.log('Sending selected IDs:', this.selectedID);
      this.apiService.getIDs(this.selectedID);
    }
  }
}
