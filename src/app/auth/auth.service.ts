import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

export class AuthResponseData {
  constructor(data: object, session: object) {}
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiService = inject(ApiService);
  supabase = this.apiService.supabase;
  user = new BehaviorSubject<AuthResponseData | null>(null);

  inputEmail: string = '';
  inputPassword: string = '';
  inputName: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  handleAuth(data: object, session: object) {
    const user = new AuthResponseData(data, session);
    this.user.next(user);
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
      console.error('Error signing up:', error.message);
      return;
    }
    console.log('User signed up successfully:', data);
    this.handleAuth(data.data, data.session);
    this.router.navigate(['../docs'], { relativeTo: this.route });
  }

  authStateChanges() {
    const { data } = this.supabase.auth.onAuthStateChange(
      (event: any, session: any) => {
        console.log(event, session);

        if (event === 'INITIAL_SESSION') {
          console.log('Initial session');
        } else if (event === 'SIGNED_IN') {
          // handle sign in event
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
