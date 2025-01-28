import { Component, inject } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { AuthService } from '../auth.service';

// check email for password change/email confirmation

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [MatToolbar],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss',
})
export class ConfirmEmailComponent {
  authService = inject(AuthService);
}
