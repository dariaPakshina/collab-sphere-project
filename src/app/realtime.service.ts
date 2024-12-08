import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject } from 'rxjs';
import { RealtimePresence } from '@supabase/supabase-js';

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

  channel = this.supabase.channel(`${this.docID}`, { timeout: 20000 });

  async initChannel() {
    if (this.docID === undefined) {
      console.error('Document ID is not set. Cannot initialize channel.');
      return;
    }

    this.channel
      .on('broadcast', { event: 'cursor-pos' }, (payload: any) => {
        this.sharingMode = true;
        console.log('Received cursor position broadcast:', payload);
        const { userId, position } = payload;
        if (userId && position) {
          this.cursorPosSubject.next({ userId, position });
        }
      })
      .subscribe((status: any) => {
        console.log('Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Channel subscribed for document ID:', this.docID);
        } else {
          console.error(
            'Failed to subscribe to channel:',
            status,
            this.channel
          );
        }
      });
  }

  async shareDocument(docId: number, userId: string) {
    console.log(docId, userId);
    this.sharingMode = true;
    this.docID = docId;

    const { error } = await this.supabase.rpc('append_to_shared_users', {
      doc_id: docId,
      user_index: userId,
    });

    if (error) {
      console.error('Error while calling append_to_shared_users:', error);
    } else {
      this.initChannel();
      this.presenceJoin();
      this.presenceLeave();
      this.presenceSync();
      return;
    }
  }

  sendCursorPos(pos: { start: number; end: number }) {
    console.log(this.userIDShared, this.userIDHost, this.sharingMode);
    this.sharingMode = true;
    const payload = {
      userId: this.userIDShared || this.userIDHost,
      position: pos,
    };

    const { error } = this.channel.send({
      type: 'broadcast',
      event: 'cursor-pos',
      payload,
    });

    if (error) {
      console.error('Error sending cursor position:', error);
    } else {
      console.log('Cursor position sent:', payload);
    }
  }

  activeUsers: { [userId: string]: RealtimePresence } = {};

  presenceJoin() {
    this.channel.on('presence', { event: 'join' }, ({ newPresences }: any) => {
      newPresences.forEach((presence: any) => {
        this.activeUsers[presence.userId] = presence;
        console.log(`${presence} joined`, this.activeUsers);
        this.displayNotif(`${presence.userId} has joined`);
      });
    });
  }

  presenceLeave() {
    this.channel.on(
      'presence',
      { event: 'leave' },
      ({ leftPresences }: any) => {
        leftPresences.forEach((presence: any) => {
          console.log(`${presence.userId} left`);
          delete this.activeUsers[presence.userId];
          this.displayNotif(`${presence.userId} has left`);
        });
      }
    );
  }

  displayNotif(notif: string) {}

  //Keeps the active users list synchronized, displays current presence state.
  presenceSync() {
    this.channel.on('presence', { event: 'sync' }, () => {
      const presenceState = this.channel.presenceState();
      console.log('Synced presence state:', presenceState);

      // Update active users list
      this.activeUsers = presenceState;
      console.log(this.activeUsers, presenceState);
    });
  }

  async getUserIdHost() {
    this.userIDHost = await this.apiService.getUserId();
    return this.userIDHost;
  }

  async onDialogShare(userId: string) {
    this.userIDHost = await this.getUserIdHost();
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

  async initSharedAccount(docId: number, userId: string) {
    const hostId = await this.fetchHostIdForDocument(docId);
    this.userIDHost = hostId;

    this.userIDShared = userId;

    console.log(
      'Shared account initialized with Host ID:',
      this.userIDHost,
      'Shared ID:',
      this.userIDShared
    );

    this.presenceJoin();
    this.presenceLeave();
    this.presenceSync();
  }

  async fetchHostIdForDocument(docId: number): Promise<string> {
    const { data, error } = await this.supabase
      .from('docs')
      .select('user_id')
      .eq('id', docId)
      .single();

    if (error) {
      console.error('Error fetching host ID for document:', error);
      return '';
    }
    return data.user_id;
  }

  async unshareDocument(docId: number, userId: string) {
    console.log(`Clearing shared users`, docId, userId);
    const { data, error } = await this.supabase.rpc('clear_shared_users', {
      doc_id: docId,
      requester_id: userId,
    });

    if (error) {
      console.error('Error while calling clear_shared_users:', error);
    } else {
      console.log(`Successfully cleared shared users`, data);
    }
  }

  async unshare() {
    await this.supabase.removeChannel(this.channel);
    console.log('channel removed', this.channel);
    this.userIDHost = await this.getUserIdHost();
    this.unshareDocument(this.docID, this.userIDHost);
    this.sharingMode = false;
  }
}
