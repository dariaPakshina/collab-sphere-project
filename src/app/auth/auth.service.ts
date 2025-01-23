import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';

export class AuthResponseData {
  data: object;
  session: any;

  constructor(data: object, session: any) {
    this.data = data;
    this.session = session;
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiService = inject(ApiService);
  supabase = this.apiService.supabase;
  user = new BehaviorSubject<AuthResponseData | null>(null);
  singingIn = false;
  private loginExpirTimer: any;
  errorMode = false;
  errorMessage = '';
  isAuth = false;
  passwordMode = false;

  inputEmail: string = '';
  inputPassword: string = '';
  inputName!: string | null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  handleAuth(data: object, session: object | null) {
    const user = new AuthResponseData(data, session);
    this.user.next(user);
    this.autoLogOut();
    localStorage.setItem('userData', JSON.stringify(user));
    this.isAuth = true;
  }

  handleErrors(errorRes: any) {
    this.errorMode = true;
    console.log({ ...errorRes }.status);
    this.errorMessage = 'An unknown error occurred!';
    if ({ ...errorRes }.status === 422) {
      this.errorMessage = 'User with this email already exists';
    }
    if ({ ...errorRes }.status === 400) {
      this.errorMessage = 'Wrong email or password';
    }
    if ({ ...errorRes }.status === 500) {
      this.errorMessage = 'Something went wrong. Try again later.';
    }
    if ({ ...errorRes }.status === 429) {
      this.errorMessage = 'Too many requests. Try again later.';
    }

    return throwError(() => {
      new Error(this.errorMessage);
      // this.errorMode = false;
    });
  }

  async signUp() {
    const { data, error } = await this.supabase.auth.signUp({
      email: this.inputEmail,
      password: this.inputPassword,
      options: {
        data: {
          name: this.inputName,
        },
        emailRedirectTo: 'http://localhost:4200/email-confirmed',
      },
    });
    if (error) {
      this.handleErrors(error);
      return;
    }
    console.log('User signed up successfully:', data);
    this.handleAuth(data.data, null);
    // this.router.navigate(['../docs'], { relativeTo: this.route });
    this.router.navigate(['/confirm-email'], { relativeTo: this.route });
  }

  async signIn() {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: this.inputEmail,
      password: this.inputPassword,
    });
    if (error) {
      this.handleErrors(error);
      return;
    } else {
      console.log('User signed in successfully:', data);
      this.handleAuth(data.data, data.session);
      this.router.navigate(['../docs'], { relativeTo: this.route });
    }
  }

  async passwordReset() {
    this.passwordMode = true;
    const { data, error } = await this.supabase.auth.resetPasswordForEmail(
      this.inputEmail,
      {
        redirectTo: 'http://localhost:4200/psw-confirmed',
      }
    );

    // this.handleAuth(data.data, data.session);
    this.router.navigate(['/confirm-email'], { relativeTo: this.route });

    if (error) {
      console.error(error);
      this.handleErrors(error);
      return;
    } else {
      console.log('Password reset', data);
    }
  }

  async logOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
      return;
    }
    localStorage.removeItem('userData');
    this.router.navigate([''], { relativeTo: this.route });
    this.isAuth = false;
    if (this.loginExpirTimer) {
      clearTimeout(this.loginExpirTimer);
    }
  }

  autoLogIn() {
    const userData: {
      data: object;
      session: object;
    } = JSON.parse(localStorage.getItem('userData')!);
    if (!userData) {
      return;
    }
    const loadedUser = new AuthResponseData(userData.data, userData.session);

    if (loadedUser) {
      this.user.next(loadedUser);
      this.autoLogOut();
      this.isAuth = true;
    }
  }

  autoLogOut() {
    this.loginExpirTimer = setTimeout(() => {
      this.logOut();
    }, 172800000);
  }

  async fetchUserName(): Promise<string> {
    const { data, error } = await this.supabase.auth.getUserIdentities();
    if (error) {
      console.error('Unable to fetch Username', error);
      return '';
    }
    return data.identities[0].identity_data.name || 'Uknown user';
  }

  authStateChanges() {
    const { data } = this.supabase.auth.onAuthStateChange(
      (event: any, session: any) => {
        console.log(event, session, '(authStateChanges)');
        if (event === 'INITIAL_SESSION') {
          console.log('Initial session (authStateChanges)');
        } else if (event === 'SIGNED_IN') {
          console.log('Signed in (authStateChanges)');
        } else if (event === 'SIGNED_OUT') {
          // handle sign out event
          // } else if (event === 'PASSWORD_RECOVERY') {
          //   // handle password recovery event
          // } else if (event === 'TOKEN_REFRESHED') {
          //   // handle token refreshed event
          // } else if (event === 'USER_UPDATED') {
          //   // handle user updated event
        }
      }
    );

    // call unsubscribe to remove the callback
    data.subscription.unsubscribe();
  }
}
