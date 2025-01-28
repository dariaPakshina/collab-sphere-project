import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
/**
 * 'sort by' options for sorting documents on dashboard
 */
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
