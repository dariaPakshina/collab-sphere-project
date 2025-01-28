import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-email-confirmed',
  standalone: true,
  imports: [MatToolbar, NgIf, RouterOutlet, RouterLink],
  templateUrl: './email-confirmed.component.html',
  styleUrl: './email-confirmed.component.scss',
})

/**
 * email confirmed message
 */
export class EmailConfirmedComponent {}
