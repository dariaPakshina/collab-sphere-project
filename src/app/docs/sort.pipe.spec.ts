import { SortPipe } from './sort.pipe';
import { orderBy } from 'lodash';

describe('SortPipe', () => {
  let pipe: SortPipe;
  beforeEach(() => {
    pipe = new SortPipe();
  });

  const users = [
    { user: 'fred', age: 48 },
    { user: 'barney', age: 34 },
    { user: 'fred', age: 40 },
    { user: 'barney', age: 36 },
  ];

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  // it('should call lodash orderBy', () => {
  //   const orderSpy = spyOn(orderBy, 'bind').and.callThrough()
  //   pipe.transform(users, 'age')
  //   expect(orderSpy).toHaveBeenCalled()
  // })

  it('should sort in ascending order', () => {
    const result = pipe.transform(users, 'age', 'asc');
    expect(result).toEqual([
      { user: 'barney', age: 34 },
      { user: 'barney', age: 36 },
      { user: 'fred', age: 40 },
      { user: 'fred', age: 48 },
    ]);
  });

  it('should sort in descending order', () => {
    const result = pipe.transform(users, 'age', 'desc');
    expect(result).toEqual([
      { user: 'fred', age: 48 },
      { user: 'fred', age: 40 },
      { user: 'barney', age: 36 },
      { user: 'barney', age: 34 },
    ]);
  });

  it('should return same array if input is not an array', () => {
    const invalidInput = null as any;
    const result = pipe.transform(invalidInput, 'age');
    expect(result).toEqual(null!);
  });

  it('should return same array if no sortBy parameter', () => {
    const result = pipe.transform(users, null as any, 'asc');
    expect(result).toEqual(users);
  });
});
