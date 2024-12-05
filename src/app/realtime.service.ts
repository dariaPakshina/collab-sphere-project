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

  userID!: string | null;
  docID!: number;

  async onDialogShare(userId: string) {
    this.userID = userId;

    this.initChannel();
    this.presenceJoin();
    this.presenceLeave();
    this.presenceSync();
    this.shareDocument(this.docID, this.userID);

    console.log('channel initialized');
    console.log('document shared');
  }

  channel = this.supabase.channel(`${this.docID}`);

  initChannel() {
    this.channel
      .on('broadcast', { event: 'cursor-pos' }, (payload: any) => {
        console.log('Received cursor position broadcast:', payload);
        this.cursorPosSubject.next(payload);
      })
      .subscribe();
    console.log('channel initialized');
  }

  async shareDocument(docId: number, userId: string | null) {
    console.log(docId, userId);
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

  sendCursorPos(userId: number, pos: any) {
    this.channel.send({
      type: 'broadcast',
      event: 'cursor-pos',
      payload: {
        userId: userId,
        position: pos,
      },
    });
    console.log('cursor position sent');
  }

  activeUsers: { [userId: string]: RealtimePresence } = {};

  //Trigger notifications when users join or leave the session
  presenceJoin() {
    this.channel
      .on('presence', { event: 'join' }, ({ newPresences }: any) => {
        newPresences.forEach((presence: any) => {
          this.activeUsers[presence.userId] = presence;
          console.log(`${presence} joined`, this.activeUsers);
          this.displayNotif(`${presence.userId} has joined`);
        });
      })
      .subscribe(async (status: any) => {
        if (status === 'SUBSCRIBED') {
          await this.channel.track({ online_at: new Date().toISOString() });
        }
      });
  }

  presenceLeave() {
    this.channel
      .on('presence', { event: 'leave' }, ({ leftPresences }: any) => {
        leftPresences.forEach((presence: any) => {
          console.log(`${presence.userId} left`);
          delete this.activeUsers[presence.userId];
          this.displayNotif(`${presence.userId} has left`);
        });
      })
      .subscribe(async (status: any) => {
        if (status === 'SUBSCRIBED') {
          await this.channel.track({ online_at: new Date().toISOString() });
          await this.channel.untrack();
        }
      });
  }

  displayNotif(notif: string) {}

  //Keeps the active users list synchronized, displays current presence state.
  presenceSync() {
    this.channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = this.channel.presenceState();
        console.log('Synced presence state:', presenceState);

        // Update active users list
        this.activeUsers = presenceState;
      })
      .subscribe(async (status: any) => {
        if (status === 'SUBSCRIBED') {
          await this.channel.track({ online_at: new Date().toISOString() });
        }
      });
  }
}
