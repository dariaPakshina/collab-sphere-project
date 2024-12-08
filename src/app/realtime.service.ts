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

  async onDialogShare(userId: string) {
    this.userIDHost = await this.fetchHostIdForDoc(this.docID);
    this.userIDShared = userId;
    console.log(
      'onDialogShare: Host ID:',
      this.userIDHost,
      'Shared ID:',
      this.userIDShared
    );

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

    this.channel!.on('broadcast', { event: 'cursor-pos' }, (payload: any) => {
      const { userId, position } = payload;
      console.log('Received cursor position broadcast:', payload);
      this.cursorPosSubject.next({ userId, position });
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
      .subscribe((status: string) => {
        console.log('Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to channel successfully.');
        } else {
          console.error('Failed to subscribe:', status);
        }
      });
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

      await this.initChannel(docId);
    }
  }

  sendCursorPos(pos: { start: number; end: number }) {
    if (!this.channel) {
      console.error('Channel not initialized.');
      return;
    }

    const userId = this.userIDShared || this.userIDHost;
    const payload = { userId, position: pos };

    this.channel
      .send({
        type: 'broadcast',
        event: 'cursor-pos',
        payload,
      })
      .then(() => {
        console.log('Cursor position sent:', payload);
      });
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
