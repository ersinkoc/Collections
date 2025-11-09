import { minBy } from '../../core/array/min-by';
import { ValidationError } from '../../utils/errors';

describe('minBy', () => {
  it('should find element with minimum value using selector', () => {
    const users = [
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 30 },
      { name: 'Charlie', age: 20 }
    ];
    expect(minBy(users, u => u.age)).toEqual({ name: 'Charlie', age: 20 });
  });

  it('should find minimum with number selector', () => {
    const numbers = [3, 7, 2, 9, 1, 5];
    expect(minBy(numbers, x => x)).toBe(1);
  });

  it('should find minimum with transformed values', () => {
    const strings = ['elephant', 'cat', 'dog', 'butterfly'];
    expect(minBy(strings, s => s.length)).toBe('cat');
  });

  it('should find minimum with negative numbers', () => {
    const numbers = [-5, -2, -8, -1, -10];
    expect(minBy(numbers, x => x)).toBe(-10);
  });

  it('should return first element when all values are equal', () => {
    const items = [
      { name: 'A', value: 5 },
      { name: 'B', value: 5 },
      { name: 'C', value: 5 }
    ];
    expect(minBy(items, item => item.value)).toEqual({ name: 'A', value: 5 });
  });

  it('should return undefined for empty array', () => {
    expect(minBy([], x => x)).toBeUndefined();
  });

  it('should handle single element array', () => {
    expect(minBy([42], x => x)).toBe(42);
    expect(minBy([{ id: 1, score: 100 }], item => item.score))
      .toEqual({ id: 1, score: 100 });
  });

  it('should provide correct arguments to selector function', () => {
    const mockSelector = jest.fn(x => x.value);
    const array = [{ value: 10 }, { value: 20 }, { value: 15 }];
    
    minBy(array, mockSelector);
    
    expect(mockSelector).toHaveBeenCalledTimes(3);
    expect(mockSelector).toHaveBeenNthCalledWith(1, { value: 10 }, 0, array);
    expect(mockSelector).toHaveBeenNthCalledWith(2, { value: 20 }, 1, array);
    expect(mockSelector).toHaveBeenNthCalledWith(3, { value: 15 }, 2, array);
  });

  it('should work with floating point numbers', () => {
    const values = [3.14, 2.71, 3.16, 2.65];
    expect(minBy(values, x => x)).toBe(2.65);
  });

  it('should handle zero values correctly', () => {
    const numbers = [0, 1, 0, 5, 0];
    expect(minBy(numbers, x => x)).toBe(0);
  });

  it('should work with complex selector functions', () => {
    const products = [
      { name: 'Laptop', price: 999, discount: 0.1 },
      { name: 'Phone', price: 599, discount: 0.2 },
      { name: 'Tablet', price: 499, discount: 0.15 }
    ];
    
    // Find product with lowest final price after discount
    const result = minBy(products, p => p.price * (1 - p.discount));
    expect(result).toEqual({ name: 'Tablet', price: 499, discount: 0.15 });
  });

  it('should handle selector returning different numeric types', () => {
    const data = [
      { id: 'a', timestamp: 1640995200000 }, // Large timestamp
      { id: 'b', timestamp: 1609459200000 },
      { id: 'c', timestamp: 1672531200000 }
    ];
    
    expect(minBy(data, item => item.timestamp))
      .toEqual({ id: 'b', timestamp: 1609459200000 });
  });

  it('should work with string to number conversion', () => {
    const items = [
      { name: 'Item A', rating: '4.5' },
      { name: 'Item B', rating: '3.8' },
      { name: 'Item C', rating: '4.9' },
      { name: 'Item D', rating: '4.2' }
    ];
    
    expect(minBy(items, item => parseFloat(item.rating)))
      .toEqual({ name: 'Item B', rating: '3.8' });
  });

  it('should handle Infinity values', () => {
    const values = [1, Infinity, 5, -Infinity, 3];
    expect(minBy(values, x => x)).toBe(-Infinity);
  });

  it('should handle NaN values correctly', () => {
    const values = [1, NaN, 3, 2];
    // NaN comparisons always return false, so NaN should not be selected as min
    expect(minBy(values, x => x)).toBe(1);
  });

  it('should work with array indices as selector', () => {
    const letters = ['a', 'b', 'c', 'd'];
    // Find element with lowest index
    expect(minBy(letters, (_, index) => index)).toBe('a');
  });

  it('should work with array length in selector', () => {
    const words = ['hi', 'hello', 'hey', 'greetings'];
    const result = minBy(words, (word, _, arr) => word.length + arr.length);
    // 'hi' has length 2, plus array length 4 = 6 (lowest)
    expect(result).toBe('hi');
  });

  it('should maintain original object references', () => {
    const originalObj = { id: 1, value: 10 };
    const objects = [{ id: 2, value: 50 }, originalObj, { id: 3, value: 75 }];
    
    const result = minBy(objects, obj => obj.value);
    expect(result).toBe(originalObj); // Same reference
  });

  it('should throw ValidationError for non-array input', () => {
    expect(() => minBy('not array' as any, (x: any) => x as number)).toThrow(ValidationError);
    expect(() => minBy(null as any, (x: any) => x as number)).toThrow(ValidationError);
    expect(() => minBy(undefined as any, (x: any) => x as number)).toThrow(ValidationError);
    expect(() => minBy(123 as any, (x: any) => x as number)).toThrow(ValidationError);
    expect(() => minBy({} as any, (x: any) => x as number)).toThrow(ValidationError);
  });

  it('should throw ValidationError for non-function selector', () => {
    expect(() => minBy([1, 2, 3], 'not function' as any)).toThrow(ValidationError);
    expect(() => minBy([1, 2, 3], null as any)).toThrow(ValidationError);
    expect(() => minBy([1, 2, 3], undefined as any)).toThrow(ValidationError);
    expect(() => minBy([1, 2, 3], 123 as any)).toThrow(ValidationError);
    expect(() => minBy([1, 2, 3], {} as any)).toThrow(ValidationError);
  });

  it('should handle large arrays efficiently', () => {
    const largeArray = Array.from({ length: 10000 }, (_, i) => ({ id: i, value: i * 2 }));
    const result = minBy(largeArray, item => item.value);
    
    expect(result).toEqual({ id: 0, value: 0 });
  });

  it('should work with mixed positive and negative values', () => {
    const data = [
      { name: 'A', score: -10 },
      { name: 'B', score: 5 },
      { name: 'C', score: -3 },
      { name: 'D', score: 0 }
    ];
    
    expect(minBy(data, item => item.score)).toEqual({ name: 'A', score: -10 });
  });

  it('should handle duplicate minimum values correctly', () => {
    const items = [
      { id: 1, priority: 3 },
      { id: 2, priority: 1 },
      { id: 3, priority: 1 }, // Same min value
      { id: 4, priority: 2 }
    ];
    
    // Should return the first occurrence of the minimum value
    expect(minBy(items, item => item.priority)).toEqual({ id: 2, priority: 1 });
  });

  it('should work with boolean to number conversion', () => {
    const flags = [
      { name: 'A', active: true },
      { name: 'B', active: false },
      { name: 'C', active: true },
      { name: 'D', active: false }
    ];
    
    // Convert boolean to number: true = 1, false = 0
    const result = minBy(flags, item => item.active ? 1 : 0);
    expect(result).toEqual({ name: 'B', active: false }); // First false value
  });

  it('should handle sparse arrays', () => {
    const sparseArray = [3, , 1, , 5]; // Array with holes
    expect(minBy(sparseArray, x => x !== undefined ? x : Infinity)).toBe(1);
  });

  it('should work with date objects', () => {
    const events = [
      { name: 'Event A', date: new Date('2023-01-15') },
      { name: 'Event B', date: new Date('2023-01-10') },
      { name: 'Event C', date: new Date('2023-01-20') }
    ];
    
    expect(minBy(events, event => event.date.getTime()))
      .toEqual({ name: 'Event B', date: new Date('2023-01-10') });
  });

  it('should work with mathematical operations in selector', () => {
    const points = [
      { x: 3, y: 4 }, // distance from origin: 5
      { x: 1, y: 1 }, // distance from origin: ~1.41
      { x: 0, y: 5 }, // distance from origin: 5
      { x: 2, y: 0 }  // distance from origin: 2
    ];
    
    // Find point closest to origin
    const result = minBy(points, p => Math.sqrt(p.x * p.x + p.y * p.y));
    expect(result).toEqual({ x: 1, y: 1 });
  });

  it('should handle extremely large numbers', () => {
    const values = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER - 1, Number.MAX_SAFE_INTEGER - 2];
    expect(minBy(values, x => x)).toBe(Number.MAX_SAFE_INTEGER - 2);
  });

  it('should handle extremely small numbers', () => {
    const values = [Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER + 1, Number.MIN_SAFE_INTEGER + 2];
    expect(minBy(values, x => x)).toBe(Number.MIN_SAFE_INTEGER);
  });
});