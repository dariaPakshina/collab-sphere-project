import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Doc } from '../../doc.model';
import { NgIf, SlicePipe } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';

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
  ],
  templateUrl: './doc-card.component.html',
  styleUrl: './doc-card.component.scss',
})
export class DocCardComponent {
  @Input() doc?: Doc;
  @Input() index!: number;

  @ViewChild('iconClose') iconClose!: ElementRef;
}
