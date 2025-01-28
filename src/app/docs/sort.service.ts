import { Injectable } from '@angular/core';

// 'sort by' options for sorting documents on dashboard

@Injectable({
  providedIn: 'root',
})
export class SortService {
  sortValues = {
    sortLatest: true,
    sortOldest: false,
    sortTitle: false,
  };

  onLatest() {
    this.sortValues = {
      sortLatest: true,
      sortOldest: false,
      sortTitle: false,
    };
  }

  onOldest() {
    this.sortValues = {
      sortLatest: false,
      sortOldest: true,
      sortTitle: false,
    };
  }

  onTitle() {
    this.sortValues = {
      sortLatest: false,
      sortOldest: false,
      sortTitle: true,
    };
  }
}
