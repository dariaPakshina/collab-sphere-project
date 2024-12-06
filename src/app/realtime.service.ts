import { inject, Injectable, ViewChild } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject } from 'rxjs';
import { RealtimePresence } from '@supabase/supabase-js';
import { DocEditComponent } from './doc-edit/doc-edit.component';

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

  async getUserIdHost() {
    this.userIDHost = await this.apiService.getUserId();
    return this.userIDHost;
  }

  async onDialogShare(userId: string) {
    this.userIDShared = userId;
    this.userIDHost = await this.getUserIdHost();

    this.initChannel();
    this.presenceJoin();
    this.presenceLeave();
    this.presenceSync();
    this.shareDocument(this.docID, this.userIDShared);

    this.sharingMode = true;

    console.log('channel initialized');
    console.log('document', this.docID, 'shared with', this.userIDShared);
  }

  channel = this.supabase.channel(`${this.docID}`);

  initChannel() {
    this.channel
      .on('broadcast', { event: 'cursor-pos' }, (payload: any) => {
        this.sharingMode = true;
        console.log('Received cursor position broadcast:', payload);
        const { userIDHost, position } = payload;
        if (userIDHost && position) {
          this.cursorPosSubject.next({ userIDHost, position });
        }
      })
      .subscribe((status: any) => {
        if (status === 'SUBSCRIBED') {
          console.log('Channel subscribed for document ID:', this.docID);
        } else {
          console.error('Failed to subscribe to channel:', status);
        }
      });
  }

  async shareDocument(docId: number, userId: string | null) {
    console.log(docId, userId);
    this.sharingMode = true;
    const { error } = await this.supabase.rpc('append_to_shared_users', {
      doc_id: docId,
      user_index: userId,
    });

    if (error) {
      console.error('Error while calling append_to_shared_users:', error);
    } else {
      return;
    }
  }

  sendCursorPos(pos: { start: number; end: number }) {
    this.sharingMode = true;
    const payload = {
      userId: this.userIDHost,
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

  //Trigger notifications when users join or leave the session
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

  async unshareDocument(docId: number, userId: string) {
    console.log(`Clearing shared users`);
    const { error } = await this.supabase.rpc('clear_shared_users', {
      doc_id: docId,
      requester_id: userId,
    });

    if (error) {
      console.error('Error while calling clear_shared_users:', error);
    } else {
      console.log(`Successfully cleared shared users`);
    }
  }

  unshare() {
    this.sharingMode = false;
    this.unshareDocument(this.docID, this.userIDHost).then(
      this.supabase.removeChannel(this.channel)
    );
    console.log('channel removed');
  }
}
