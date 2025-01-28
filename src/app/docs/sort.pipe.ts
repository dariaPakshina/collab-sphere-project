import { Pipe, PipeTransform } from '@angular/core';
import { orderBy } from 'lodash';

// lodash sorting documents pipe

@Pipe({
  name: 'sort',
  standalone: true,
})
export class SortPipe implements PipeTransform {
  transform<T>(
    array: T[],
    sortBy: keyof T,
    sortOrder: 'asc' | 'desc' = 'asc'
  ): T[] {
    if (!Array.isArray(array) || !sortBy) {
      return array;
    }
    return orderBy(array, [sortBy], [sortOrder]);
  }
}
