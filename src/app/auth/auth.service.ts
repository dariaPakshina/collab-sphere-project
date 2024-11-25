import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiService = inject(ApiService);
  supabase = this.apiService.supabase;

  async signUp() {
    const { data, error } = await this.supabase.auth.signUp({
      email: 'example@email.com',
      password: 'example-password',
    });
  }
}
