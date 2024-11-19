import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Doc } from '../../doc.model';
import { NgIf, SlicePipe } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ApiService } from '../../api.service';

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
  ],
  templateUrl: './doc-card.component.html',
  styleUrl: './doc-card.component.scss',
})
export class DocCardComponent {
  @Input() doc?: Doc;
  @Input() index!: number;

  constructor(private apiService: ApiService) {}

  @ViewChild('iconClose') iconClose!: ElementRef;
}
