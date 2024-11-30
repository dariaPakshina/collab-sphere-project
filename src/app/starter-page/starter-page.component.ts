import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-starter-page',
  standalone: true,
  imports: [MatButtonModule, MatToolbarModule, RouterLink],
  templateUrl: './starter-page.component.html',
  styleUrls: ['./starter-page.component.scss', './media-queries.scss'],
})
export class StarterPageComponent {}
