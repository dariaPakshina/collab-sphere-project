import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Doc } from '../doc.model';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class DocsService {
  docsChanged = new Subject<Doc[]>();
  editMode = false;

  private docs: Doc[] = [];

  setDocs(data: Doc[]) {
    this.docs = data;
    this.docsChanged.next(this.docs.slice());
  }

  // to access recipes copy from outside
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
}
