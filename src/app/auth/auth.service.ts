import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export class AuthResponseData {
  data: object;
  session: object; // Adjust the type if you know the exact structure

  constructor(data: object, session: object) {
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

  inputEmail: string = '';
  inputPassword: string = '';
  inputName!: string | null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  handleAuth(data: object, session: object) {
    const user = new AuthResponseData(data, session);
    this.user.next(user);
    this.autoLogOut();
    localStorage.setItem('userData', JSON.stringify(user));
    this.isAuth = true;
  }

  handleErrors(errorRes: any) {
    this.errorMode = true;
    console.log({ ...errorRes });
    this.errorMessage = 'An unknown error occurred!';
    if ((errorRes.status = 422)) {
      this.errorMessage = 'User with this email already exists';
    }
    if ((errorRes.status = 400)) {
      this.errorMessage = 'Wrong email or password';
    }

    return throwError(() => new Error(this.errorMessage));
  }

  async signUp() {
    const { data, error } = await this.supabase.auth.signUp({
      email: this.inputEmail,
      password: this.inputPassword,
      options: {
        data: {
          name: this.inputName,
        },
      },
    });
    if (error) {
      this.handleErrors(error);
      return;
    }
    console.log('User signed up successfully:', data);
    this.handleAuth(data.data, data.session);
    this.router.navigate(['../docs'], { relativeTo: this.route });
  }

  async signIn() {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: this.inputEmail,
      password: this.inputPassword,
    });
    if (error) {
      this.handleErrors(error);
      return;
    }
    console.log('User signed in successfully:', data);
    this.handleAuth(data.data, data.session);
    this.router.navigate(['../docs'], { relativeTo: this.route });
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
