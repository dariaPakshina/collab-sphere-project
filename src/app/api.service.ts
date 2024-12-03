import { Injectable, NgZone } from '@angular/core';
import { Doc } from './doc.model';
import { createClient } from '@supabase/supabase-js';
import { DocsService } from './docs/docs.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  supabase: any;
  constructor(private ngZone: NgZone, private docsService: DocsService) {
    this.ngZone.runOutsideAngular(() => {
      this.supabase = createClient(
        'https://xbjxhogwjbyxwfvvfuit.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhianhob2d3amJ5eHdmdnZmdWl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4NjY1NTQsImV4cCI6MjA0NzQ0MjU1NH0.W0-H8dwvW66ROmHU3T62UeZjOqNboh6Bui9k85BHDFs'
      );
    });
  }

  public userId: string | null = null;

  async getUserId() {
    try {
      const {
        data: { user },
      } = await this.supabase.auth.getUser();

      if (user) {
        this.userId = user.id;
        return user.id;
      }
      return null;
    } catch (error) {
      console.error('Unexpected error in postDoc:', error);
      return null;
    }
  }

  async postDoc(title: string, edittime: string, content: string) {
    const userId = await this.getUserId();
    if (!userId) {
      console.error('No user ID available. Cannot fetch documents.');
      return;
    }

    try {
      const docData = {
        title: title,
        edittime: edittime,
        content: content,
        user_id: userId,
      };
      const { data, error } = await this.supabase.from('docs').insert(docData);
      if (error) {
        console.error('Error inserting document:', error.message);
        console.error('Detailed error:', error);
        return;
      }
      console.log('Document inserted successfully:', data);
    } catch (error) {
      console.error('Unexpected error in postDoc:', error);
    }
  }

  //-------------

  async fetchDocs() {
    const userId = await this.getUserId();
    if (!userId) {
      console.error('No user ID available. Cannot fetch documents.');
      return;
    }
    try {
      const { data, error } = await this.supabase
        .from('docs')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching document:', error.message);
        return;
      }
      if (data) {
        this.docsService.setDocs(data);
      }
    } catch (error) {
      console.error('Unexpected error in fetchDocs:', error);
    }
  }

  // async fetchSharedDocument(documentId: string, sharedLink: string) {
  //   const { data, error } = await this.supabase
  //     .from('documents')
  //     .select('*')
  //     .eq('id', documentId)
  //     .eq('shared_link', sharedLink);

  //   if (error || !data) {
  //     console.error('Error fetching document:', error);
  //     return null;
  //   }
  //   return data[0];
  // }

  //--------------

  index!: number;
  indices: number[] = [];

  getID(id: number) {
    this.index = id;
  }

  getIDs(ids: number) {
    this.indices.push(ids);
    this.deleteDocs();
  }

  async deleteDoc() {
    try {
      this.docsService.deleteDoc(this.index);
      const {} = await this.supabase.from('docs').delete().eq('id', this.index);
      window.location.reload();
    } catch (error) {
      console.error('Unexpected error in fetchDocs:', error);
    }
  }

  async deleteDocs() {
    try {
      console.log(this.indices);
      if (this.indices.length > 0) {
        this.docsService.deleteDocs(this.indices);
        const {} = await this.supabase
          .from('docs')
          .delete()
          .in('id', this.indices);
        window.location.reload();
      }
    } catch (error) {
      console.error('Unexpected error in fetchDocs:', error);
    }
  }

  //---------------

  async updateDoc(title: string, edittime: string, content: string) {
    try {
      let newDoc: Doc = {
        id: this.index,
        title: title,
        edittime: edittime,
        content: content,
        shared_users: null,
      };
      console.log('Doc to be updated:', newDoc);

      this.docsService.updateDoc(this.index, newDoc);
      const { error } = await this.supabase
        .from('docs')
        .update(newDoc)
        .eq('id', this.index);
      console.log('Updated');
    } catch (error) {
      console.error('Unexpected error in updateDoc:', error);
    }
  }
}
