import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject } from 'rxjs';
import { RealtimeChannel } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class RealtimeService {
  apiService = inject(ApiService);
  supabase = this.apiService.supabase;

  cursorPosSubject = new BehaviorSubject<any>(null);
  cursorPos$ = this.cursorPosSubject.asObservable();

  userIDShared!: string;
  userIDHost!: string;
  docID!: number;
  sharingMode = false;

  private channel: RealtimeChannel | null = null;

  userRole: 'host' | 'shared' | null = null;

  textarea!: any;
  private contentSubject = new BehaviorSubject<string>('');
  content$ = this.contentSubject.asObservable();

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
    console.log(
      'onDialogShare: Host ID:',
      this.userIDHost,
      'Shared ID:',
      this.userIDShared
    );

    this.userRole = 'host';
    console.log('Host role set. Sharing document:', this.docID);

    this.shareDocument(this.docID, this.userIDShared);

    this.sharingMode = true;
  }

  async initChannel(docId: number) {
    if (this.channel) {
      console.log('Channel already initialized.');
      return;
    }

    this.docID = docId;

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
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
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

    this.trackChannel();
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
      console.log('Shared user role set for document:', this.docID);

      await this.initChannel(docId);
    }
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
