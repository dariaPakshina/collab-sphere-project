import { inject, Injectable, ViewChild } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject } from 'rxjs';
import { RealtimePresence } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class RealtimeService {
  apiService = inject(ApiService);
  supabase = this.apiService.supabase;
  channel = this.supabase.channel(`document-${this.apiService.index}`);

  cursorPosSubject = new BehaviorSubject<any>(null);
  cursorPos$ = this.cursorPosSubject.asObservable();

  initChannel(doc: number) {
    this.channel
      .on('broadcast', { event: 'cursor-pos' }, (payload: any) => {
        this.cursorPosSubject.next(payload);
      })
      .subscribe();
  }

  async shareDocument(docId: number, userId: number) {
    const { data, error } = await this.supabase
      .from('docs')
      .update({
        shared_users: this.supabase.raw('array_append(shared_users, ?)', [
          userId,
        ]),
      })
      .match({ id: docId });

    if (error) {
      console.error(error);
      return null;
    }
    return data;
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
  }

  activeUsers: { [userId: string]: RealtimePresence } = {};

  //Trigger notifications when users join or leave the session
  presenceJoin() {
    this.channel
      .on('presence', { event: 'join' }, ({ newPresences }: any) => {
        newPresences.forEach((presence: any) => {
          console.log(`${presence} joined`);
          this.activeUsers[presence.userId] = presence;
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
