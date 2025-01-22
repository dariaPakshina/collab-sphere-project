import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-confirmed',
  standalone: true,
  imports: [MatToolbar, RouterOutlet],
  templateUrl: './confirmed.component.html',
  styleUrl: './confirmed.component.scss',
})
export class ConfirmedComponent {}
