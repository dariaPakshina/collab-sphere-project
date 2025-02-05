import { Component, inject } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [MatToolbar],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss',
})

/**
 * check email for password/email
 */
export class ConfirmEmailComponent {
  authService = inject(AuthService);
}
