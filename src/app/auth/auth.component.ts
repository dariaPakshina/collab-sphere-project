import { Component, inject, OnInit, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from './user.model';
import { AuthResponseData, AuthService } from './auth.service';
import { merge, Observable } from 'rxjs';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    RouterLink,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnInit {
  authService = inject(AuthService);

  addForm!: FormGroup;

  name = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
  ]);

  errorMessageName = signal('');
  errorMessageEmail = signal('');
  errorMessagePassword = signal('');

  constructor() {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessageEmail());
    merge(this.name.statusChanges, this.name.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessageName());
    merge(this.password.statusChanges, this.password.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessagePassword());
  }

  ngOnInit() {
    this.addForm = new FormGroup({
      name: this.name,
      email: this.email,
      password: this.password,
    });
  }

  toggleSignIn() {
    this.authService.singingIn = true;
    this.addForm.removeControl('name');
  }

  toggleSignUp() {
    this.authService.singingIn = false;
    this.addForm.addControl('name', this.name);
  }

  onSignUpIn(formData: User) {
    if (!this.addForm.valid) {
      return;
    }

    this.addForm.valueChanges.subscribe();
    this.authService.inputName = !this.authService.singingIn
      ? formData.name
      : null;
    this.authService.inputEmail = formData.email;
    this.authService.inputPassword = formData.password;

    if (this.authService.singingIn === false) {
      this.authService.signUp();
    } else {
      this.authService.signIn();
    }
  }

  updateErrorMessageEmail() {
    if (this.email.hasError('required')) {
      this.errorMessageEmail.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessageEmail.set('Invalid email');
    } else {
      this.errorMessageEmail.set('');
    }
  }

  updateErrorMessageName() {
    if (this.name.hasError('required')) {
      this.errorMessageName.set('You must enter a value');
    } else {
      this.errorMessageName.set('');
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

  //--------------------------------------

  hide = signal(true);
  hidePassword(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
