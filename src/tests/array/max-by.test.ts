import { maxBy } from '../../core/array/max-by';
import { ValidationError } from '../../utils/errors';

describe('maxBy', () => {
  it('should find element with maximum value using selector', () => {
    const users = [
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 30 },
      { name: 'Charlie', age: 20 }
    ];
    expect(maxBy(users, u => u.age)).toEqual({ name: 'Bob', age: 30 });
  });

  it('should find maximum with number selector', () => {
    const numbers = [3, 7, 2, 9, 1, 5];
    expect(maxBy(numbers, x => x)).toBe(9);
  });

  it('should find maximum with transformed values', () => {
    const strings = ['cat', 'elephant', 'dog', 'butterfly'];
    expect(maxBy(strings, s => s.length)).toBe('butterfly');
  });

  it('should find maximum with negative numbers', () => {
    const numbers = [-5, -2, -8, -1, -10];
    expect(maxBy(numbers, x => x)).toBe(-1);
  });

  it('should return first element when all values are equal', () => {
    const items = [
      { name: 'A', value: 5 },
      { name: 'B', value: 5 },
      { name: 'C', value: 5 }
    ];
    expect(maxBy(items, item => item.value)).toEqual({ name: 'A', value: 5 });
  });

  it('should return undefined for empty array', () => {
    expect(maxBy([], x => x)).toBeUndefined();
  });

  it('should handle single element array', () => {
    expect(maxBy([42], x => x)).toBe(42);
    expect(maxBy([{ id: 1, score: 100 }], item => item.score))
      .toEqual({ id: 1, score: 100 });
  });

  it('should provide correct arguments to selector function', () => {
    const mockSelector = jest.fn(x => x.value);
    const array = [{ value: 10 }, { value: 20 }, { value: 15 }];
    
    maxBy(array, mockSelector);
    
    expect(mockSelector).toHaveBeenCalledTimes(3);
    expect(mockSelector).toHaveBeenNthCalledWith(1, { value: 10 }, 0, array);
    expect(mockSelector).toHaveBeenNthCalledWith(2, { value: 20 }, 1, array);
    expect(mockSelector).toHaveBeenNthCalledWith(3, { value: 15 }, 2, array);
  });

  it('should work with floating point numbers', () => {
    const values = [3.14, 2.71, 3.16, 2.65];
    expect(maxBy(values, x => x)).toBe(3.16);
  });

  it('should handle zero values correctly', () => {
    const numbers = [0, -1, 0, -5, 0];
    expect(maxBy(numbers, x => x)).toBe(0);
  });

  it('should work with complex selector functions', () => {
    const products = [
      { name: 'Laptop', price: 999, discount: 0.1 },
      { name: 'Phone', price: 599, discount: 0.2 },
      { name: 'Tablet', price: 499, discount: 0.15 }
    ];
    
    // Find product with highest final price after discount
    const result = maxBy(products, p => p.price * (1 - p.discount));
    expect(result).toEqual({ name: 'Laptop', price: 999, discount: 0.1 });
  });

  it('should handle selector returning different numeric types', () => {
    const data = [
      { id: 'a', timestamp: 1640995200000 }, // Large timestamp
      { id: 'b', timestamp: 1609459200000 },
      { id: 'c', timestamp: 1672531200000 }
    ];
    
    expect(maxBy(data, item => item.timestamp))
      .toEqual({ id: 'c', timestamp: 1672531200000 });
  });

  it('should work with string to number conversion', () => {
    const items = [
      { name: 'Item A', rating: '4.5' },
      { name: 'Item B', rating: '3.8' },
      { name: 'Item C', rating: '4.9' },
      { name: 'Item D', rating: '4.2' }
    ];
    
    expect(maxBy(items, item => parseFloat(item.rating)))
      .toEqual({ name: 'Item C', rating: '4.9' });
  });

  it('should handle Infinity values', () => {
    const values = [1, Infinity, 5, -Infinity, 3];
    expect(maxBy(values, x => x)).toBe(Infinity);
  });

  it('should handle NaN values correctly', () => {
    const values = [1, NaN, 3, 2];
    // NaN comparisons always return false, so NaN should not be selected as max
    expect(maxBy(values, x => x)).toBe(3);
  });

  it('should work with array indices as selector', () => {
    const letters = ['a', 'b', 'c', 'd'];
    // Find element with highest index
    expect(maxBy(letters, (_, index) => index)).toBe('d');
  });

  it('should work with array length in selector', () => {
    const words = ['hi', 'hello', 'hey', 'greetings'];
    const result = maxBy(words, (word, _, arr) => word.length + arr.length);
    // 'greetings' has length 9, plus array length 4 = 13 (highest)
    expect(result).toBe('greetings');
  });

  it('should maintain original object references', () => {
    const originalObj = { id: 1, value: 100 };
    const objects = [{ id: 2, value: 50 }, originalObj, { id: 3, value: 75 }];
    
    const result = maxBy(objects, obj => obj.value);
    expect(result).toBe(originalObj); // Same reference
  });

  it('should throw ValidationError for non-array input', () => {
    expect(() => maxBy('not array' as any, x => x)).toThrow(ValidationError);
    expect(() => maxBy(null as any, x => x)).toThrow(ValidationError);
    expect(() => maxBy(undefined as any, x => x)).toThrow(ValidationError);
    expect(() => maxBy(123 as any, x => x)).toThrow(ValidationError);
    expect(() => maxBy({} as any, x => x)).toThrow(ValidationError);
  });

  it('should throw ValidationError for non-function selector', () => {
    expect(() => maxBy([1, 2, 3], 'not function' as any)).toThrow(ValidationError);
    expect(() => maxBy([1, 2, 3], null as any)).toThrow(ValidationError);
    expect(() => maxBy([1, 2, 3], undefined as any)).toThrow(ValidationError);
    expect(() => maxBy([1, 2, 3], 123 as any)).toThrow(ValidationError);
    expect(() => maxBy([1, 2, 3], {} as any)).toThrow(ValidationError);
  });

  it('should handle large arrays efficiently', () => {
    const largeArray = Array.from({ length: 10000 }, (_, i) => ({ id: i, value: i * 2 }));
    const result = maxBy(largeArray, item => item.value);
    
    expect(result).toEqual({ id: 9999, value: 19998 });
  });

  it('should work with mixed positive and negative values', () => {
    const data = [
      { name: 'A', score: -10 },
      { name: 'B', score: 5 },
      { name: 'C', score: -3 },
      { name: 'D', score: 0 }
    ];
    
    expect(maxBy(data, item => item.score)).toEqual({ name: 'B', score: 5 });
  });

  it('should handle duplicate maximum values correctly', () => {
    const items = [
      { id: 1, priority: 3 },
      { id: 2, priority: 5 },
      { id: 3, priority: 5 }, // Same max value
      { id: 4, priority: 2 }
    ];
    
    // Should return the first occurrence of the maximum value
    expect(maxBy(items, item => item.priority)).toEqual({ id: 2, priority: 5 });
  });

  it('should work with boolean to number conversion', () => {
    const flags = [
      { name: 'A', active: false },
      { name: 'B', active: true },
      { name: 'C', active: false },
      { name: 'D', active: true }
    ];
    
    // Convert boolean to number: true = 1, false = 0
    const result = maxBy(flags, item => item.active ? 1 : 0);
    expect(result).toEqual({ name: 'B', active: true }); // First true value
  });

  it('should handle sparse arrays', () => {
    const sparseArray = [1, , 5, , 3]; // Array with holes
    expect(maxBy(sparseArray, x => x !== undefined ? x : -Infinity)).toBe(5);
  });
});