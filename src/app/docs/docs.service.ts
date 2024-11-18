import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Doc } from '../doc.model';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class DocsService {
  // constructor(private apiService: ApiService) {}

  docsChanged = new Subject<Doc[]>();

  private docs: Doc[] = [];

  setDocs(docs: Doc[]) {
    this.docs = docs;
    this.docsChanged.next(this.docs.slice());
  }

  // to access recipes copy from outside
  getDocs() {
    return this.docs.slice(); // copying an array
  }

  getDoc(id: number) {
    return this.docs[id];
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
