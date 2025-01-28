import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Doc } from '../doc.model';

// managing inner document storage, retreived from supabase

@Injectable({
  providedIn: 'root',
})
export class DocsService {
  docsChanged = new Subject<Doc[]>();
  docChanged = new Subject<Doc>();
  editMode = false;

  docsChanged$ = this.docsChanged.asObservable();
  docChanged$ = this.docChanged.asObservable();

  private docs: Doc[] = [];

  setDocs(data: Doc[]) {
    this.docs = data;
    this.docsChanged.next(this.docs.slice());
  }

  getDocs() {
    return this.docs.slice(); // copying an array
  }

  getDoc(id: number) {
    const doc = this.docs.find((doc) => doc.id === id);
    return doc || null;
  }

  addDoc(doc: Doc) {
    this.docs.push(doc);
    this.docsChanged.next(this.docs.slice());
  }

  updateDoc(id: number, newDoc: Doc) {
    this.docs[id] = newDoc;
    this.docsChanged.next(this.docs.slice());
  }

  deleteDoc(id: number) {
    this.docs.splice(id, 1);
    this.docsChanged.next(this.docs.slice());
  }

  selectMode = false;

  deleteAction = new Subject<void>();
  deleteAction$ = this.deleteAction.asObservable();

  triggerDelete() {
    this.deleteAction.next();
  }

  deleteDocs(ids: number[]) {
    if (this.selectMode === true) {
      this.docs.splice(ids[0], ids.length);
      this.docsChanged.next(this.docs.slice());
    }
  }
}
