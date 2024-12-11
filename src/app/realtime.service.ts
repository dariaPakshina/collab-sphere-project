import { inject, Injectable, ViewChild } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject } from 'rxjs';
import { RealtimeChannel } from '@supabase/supabase-js';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth/auth.service';
import { NavDocEditComponent } from './doc-edit/nav-doc-edit/nav-doc-edit.component';

@Injectable({
  providedIn: 'root',
})
export class RealtimeService {
  authService = inject(AuthService);
  apiService = inject(ApiService);
  supabase = this.apiService.supabase;

  cursorPosSubject = new BehaviorSubject<any>(null);
  cursorPos$ = this.cursorPosSubject.asObservable();

  userIDShared!: string;
  userIDHost!: string;
  userRole: 'host' | 'shared' | null = null;
  sharedUser = false;

  sharedUsername = new BehaviorSubject<string>('');
  sharedUsername$ = this.sharedUsername.asObservable();

  docID!: number;
  sharingMode = false;

  private channel: RealtimeChannel | null = null;

  textarea!: any;
  contentSubject = new BehaviorSubject<string>('');
  content$ = this.contentSubject.asObservable();

  private _snackBar = inject(MatSnackBar);

  async determineRole() {
    const currentUserId = await this.apiService.getUserId();
    if (currentUserId === this.userIDHost) {
      this.userRole = 'host';
    } else if (currentUserId === this.userIDShared) {
      this.userRole = 'shared';
    } else {
      console.error('Unable to determine user role.');
    }
  }

  async onDialogShare(userId: string) {
    this.userIDHost = await this.fetchHostIdForDoc(this.docID);
    this.userIDShared = userId;

    this.userRole = 'host';

    this.shareDocument(this.docID, this.userIDShared);
    this.sharedUsername$.subscribe();

    this.sharingMode = true;
  }

  async initChannel(docId: number) {
    if (this.channel) {
      console.log('Channel already initialized.');
      return;
    }

    this.docID = docId;

    const userMap: Record<string, string> = {};

    this.channel = this.supabase.channel(`realtime:${docId}`, {
      timeout: 20000,
    });

    this.channel!.on('broadcast', { event: 'cursor-pos' }, (payload) => {
      console.log('Received broadcast:', payload);

      if (
        payload['userId'] ===
        (this.userRole === 'host' ? this.userIDHost : this.userIDShared)
      ) {
        return;
      }
      this.cursorPosSubject.next(payload);
    })
      .on('broadcast', { event: 'user-joined' }, (payload: any) => {
        console.log('Received broadcast payload:', payload);
        this.sharedUsername.next(payload.payload.username);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        if (key === this.userIDHost) {
          return;
        }
        console.log('User joined:', key, newPresences);
        if (!this.sharedUser) {
          this.openSnackBar(`${this.sharedUsername.getValue()} joined`, 'Ok');
        }
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
        if (!this.sharedUser) {
          this.openSnackBar(`${this.sharedUsername.getValue()} left`, 'Ok');
        }
      })
      .on('presence', { event: 'sync' }, () => {
        const newState = this.channel?.presenceState();
        console.log('Presence sync:', newState);
      })
      .on('broadcast', { event: 'text-update' }, (payload: any) => {
        if (
          payload.payload.userId ===
          (this.userRole === 'host' ? this.userIDHost : this.userIDShared)
        ) {
          return; // ignores updates from the same user
        }

        this.contentSubject.next(payload.payload.content);
        console.log('Broadcast received:', payload);
      })
      .subscribe((status: string) => {
        console.log('Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to channel successfully.');
        } else {
          console.error('Failed to subscribe:', status);
        }
      });

    console.log('User Role:', this.userRole);
    console.log('Host ID:', this.userIDHost);
    console.log('Shared ID:', this.userIDShared);
    console.log(this.sharedUsername);

    // this.trackChannel();
  }

  async trackChannel() {
    const presencePayload = {
      userId: this.userRole === 'host' ? this.userIDHost : this.userIDShared,
    };
    try {
      await this.channel!.track(presencePayload);
      console.log('Presence tracking initialized for:', presencePayload);
    } catch (error) {
      console.error('Failed to track presence:', error);
    }
  }

  async shareDocument(docId: number, sharedUserId: string) {
    this.sharingMode = true;
    this.docID = docId;

    const { error } = await this.supabase.rpc('append_to_shared_users', {
      doc_id: docId,
      user_index: sharedUserId,
    });

    if (error) {
      console.error('Error while sharing document:', error);
      return;
    }

    await this.initChannel(docId);
  }

  async initSharedAccount(docId: number, sharedUserId: string) {
    const username = await this.authService.fetchUserName();
    this.sharedUsername.next(username);

    if (!this.channel) {
      const hostId = await this.fetchHostIdForDoc(docId);
      this.userIDHost = hostId;
      this.userIDShared = sharedUserId;
      this.sharingMode = true;

      console.log('Shared account initialized:', {
        userIDHost: this.userIDHost,
        userIDShared: this.userIDShared,
      });

      this.userRole = 'shared';

      await this.initChannel(docId);
      this.trackChannel();
    }

    if (this.channel) {
      this.channel.send({
        type: 'broadcast',
        event: 'user-joined',
        payload: { username, userId: this.userIDShared },
      });
    }
  }

  setInitialContent(content: string): void {
    this.contentSubject.next(content);
  }

  sendCursorPos(pos: { start: number; end: number }) {
    if (!this.userRole) {
      console.error(
        'User role is not determined. Cannot send cursor position.'
      );
      return;
    }

    const payload = {
      userId: this.userRole === 'host' ? this.userIDHost : this.userIDShared,
      role: this.userRole,
      position: pos,
    };

    const {} = this.channel!.send({
      type: 'broadcast',
      event: 'cursor-pos',
      payload,
    });

    console.log('Cursor position sent:', payload);
  }

  async fetchHostIdForDoc(docId: number): Promise<string> {
    const { data, error } = await this.supabase
      .from('docs')
      .select('user_id')
      .eq('id', docId)
      .single();

    if (error) {
      console.error('Error fetching host ID:', error);
      return '';
    }

    return data.user_id;
  }

  sendTextUpdate(content: string) {
    const payload = {
      userId: this.userRole === 'host' ? this.userIDHost : this.userIDShared,
      content,
    };
    this.channel?.send({
      type: 'broadcast',
      event: 'text-update',
      payload,
    });
    console.log('Text update sent:', payload);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  async unshare() {
    if (this.channel) {
      await this.supabase.removeChannel(this.channel);
      this.channel = null;
    }
    console.log('Channel removed.');
    this.sharingMode = false;

    console.log(`Clearing shared users`, this.docID, this.userIDHost);
    const { data, error } = await this.supabase.rpc('clear_shared_users', {
      doc_id: this.docID,
      requester_id: this.userIDHost,
    });

    if (error) {
      console.error('Error while calling clear_shared_users:', error);
    } else {
      console.log(`Successfully cleared shared users`, data);
    }
  }
}
