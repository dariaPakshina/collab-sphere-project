import { Pipe, PipeTransform } from '@angular/core';
import { orderBy } from 'lodash';

@Pipe({
  name: 'sort',
  standalone: true,
})
export class SortPipe implements PipeTransform {
  transform(array: any, sortBy: string, order?: 'asc' | 'desc'): any[] {
    const sortOrder = order ? order : 'asc';
    return orderBy(array, [sortBy], [sortOrder]);
  }
}

// var users = [
//   { 'user': 'fred',   'age': 48 },
//   { 'user': 'barney', 'age': 34 },
//   { 'user': 'fred',   'age': 40 },
//   { 'user': 'barney', 'age': 36 }
// ];

// // Sort by `user` in ascending order and by `age` in descending order.
// _.orderBy(users, ['user', 'age'], ['asc', 'desc']);
// // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
