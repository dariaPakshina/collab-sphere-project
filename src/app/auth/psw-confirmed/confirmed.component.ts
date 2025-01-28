import { NgIf } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
} from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { merge } from 'lodash';
import { ApiService } from '../../api.service';
import { AuthService } from '../auth.service';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

// setting new password

@Component({
  selector: 'app-confirmed',
  standalone: true,
  imports: [
    MatToolbar,
    RouterOutlet,
    NgIf,
    MatFormField,
    MatLabel,
    MatError,
    MatIcon,
    MatHint,
    MatInput,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    RouterLink,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './confirmed.component.html',
  styleUrl: './confirmed.component.scss',
})
export class ConfirmedComponent implements OnInit {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  authService = inject(AuthService);
  apiService = inject(ApiService);
  addForm!: FormGroup;
  errorMessagePassword = signal('');
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
  ]);

  constructor() {
    merge(this.password.statusChanges, this.password.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessagePassword());
  }

  ngOnInit() {
    this.addForm = new FormGroup({
      password: this.password,
    });
  }

  async onChangePassword() {
    this.addForm.valueChanges.subscribe();
    let passwordStr = this.password;
    console.log(passwordStr.value);

    const { data, error } = await this.apiService.supabase.auth.updateUser({
      password: passwordStr.value,
    });

    if (error) {
      console.error('Error when updating password: ', error);
      this.authService.handleErrors(error);
      return;
    } else {
      console.log('Password updated successfully: ', data);
      this.authService.handleAuth(data.data, data.session);
      this.router.navigate(['../docs'], {
        relativeTo: this.activatedRoute,
      });
    }
  }

  updateErrorMessagePassword() {
    if (this.password.hasError('required')) {
      this.errorMessagePassword.set('You must enter a value');
    } else if (this.password.hasError('minlength')) {
      this.errorMessagePassword.set(
        'Password should be at least 8 characters long'
      );
    } else {
      this.errorMessagePassword.set('');
    }
  }

  hide = signal(true);
  hidePassword(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
