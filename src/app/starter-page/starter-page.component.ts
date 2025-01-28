import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';

// navigation from non-auth starter page

@Component({
  selector: 'app-starter-page',
  standalone: true,
  imports: [MatButtonModule, MatToolbarModule, RouterLink],
  templateUrl: './starter-page.component.html',
  styleUrls: ['./starter-page.component.scss', './media-queries.scss'],
})
export class StarterPageComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  onClick() {
    if (this.authService.isAuth === true) {
      this.router.navigate(['/docs'], { relativeTo: this.route });
    } else {
      this.router.navigate(['/auth'], { relativeTo: this.route });
    }
  }
}
