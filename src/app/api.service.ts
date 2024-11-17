import { Injectable, NgZone } from '@angular/core';
import { Doc } from './doc.model';
import { createClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  supabase: any;
  constructor(private ngZone: NgZone) {
    this.ngZone.runOutsideAngular(() => {
      this.supabase = createClient(
        'https://xbjxhogwjbyxwfvvfuit.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhianhob2d3amJ5eHdmdnZmdWl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4NjY1NTQsImV4cCI6MjA0NzQ0MjU1NH0.W0-H8dwvW66ROmHU3T62UeZjOqNboh6Bui9k85BHDFs'
      );
    });
  }

  async postDoc(title: string, edittime: string, content: string) {
    try {
      const docData: Doc = {
        title: title,
        edittime: edittime,
        content: content,
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
  // postDoc(title: string, editTime: string, content: string) {
  //   const docData: Doc = { title: title, editTime: editTime, content: content };
  //   this.http
  //     .post<Doc>('https://toewuctoxgghgiionmsx.supabase.co', docData, {
  //       observe: 'response',
  //     })
  //     .subscribe({
  //       next: (resData) => {
  //         console.log(resData.body);
  //       },
  //       error: (error) => {
  //         console.error(error.message);
  //       },
  //       complete: () => {
  //         console.log('Document successfully posted to SupaBase.');
  //       },
  //     });
  // }
}
