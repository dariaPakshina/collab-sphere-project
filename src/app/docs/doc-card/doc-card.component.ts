import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Doc } from '../../doc.model';
import { NgIf, SlicePipe } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { ApiService } from '../../api.service';
import {
  DeleteWindowComponent,
  DialogAnimationsExampleDialog,
} from './delete-window/delete-window.component';

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
    DeleteWindowComponent,
  ],
  templateUrl: './doc-card.component.html',
  styleUrl: './doc-card.component.scss',
})
export class DocCardComponent implements AfterViewInit {
  @Input() doc?: Doc;
  @Input() index!: number;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  @ViewChild('iconClose') iconClose!: HTMLElement;
  @ViewChild(DeleteWindowComponent)
  deleteWindowComponent!: DeleteWindowComponent;

  ngAfterViewInit() {
    console.log(this.deleteWindowComponent);
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
    event.stopPropagation(); // Stop event from propagating to parent handlers

    this.deleteWindowComponent.openDialog('0ms', '0ms');

    const target = event.target as HTMLElement;
    const docCardEl = target.closest('mat-card');
    if (docCardEl) {
      const docCardId = docCardEl.id;
      this.apiService.getID(+docCardId); // Handle delete action
    } else {
      console.log('No mat-card element found');
    }
  }
}
