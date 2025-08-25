import { distinctBy } from '../../core/array/distinct-by';
import { ValidationError } from '../../utils/errors';

describe('distinctBy', () => {
  // Normal cases
  it('should return distinct objects by id property', () => {
    const users = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 1, name: 'Alice2' },
      { id: 3, name: 'Charlie' },
      { id: 2, name: 'Bob2' }
    ];
    const result = distinctBy(users, u => u.id);
    
    expect(result).toEqual([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' }
    ]);
    expect(result).toHaveLength(3);
  });

  it('should return distinct elements by computed value', () => {
    const numbers = [1, 2, 3, 4, 5, 6];
    const result = distinctBy(numbers, n => n % 3);
    
    expect(result).toEqual([1, 2, 3]); // remainder 1, 2, 0
    expect(result).toHaveLength(3);
  });

  it('should return distinct strings by length', () => {
    const words = ['a', 'bb', 'ccc', 'd', 'ee', 'fff'];
    const result = distinctBy(words, w => w.length);
    
    expect(result).toEqual(['a', 'bb', 'ccc']);
    expect(result).toHaveLength(3);
  });

  it('should preserve first occurrence when duplicates exist', () => {
    const items = [
      { type: 'A', value: 1 },
      { type: 'B', value: 2 },
      { type: 'A', value: 3 }, // Should be filtered out
      { type: 'C', value: 4 },
      { type: 'B', value: 5 }  // Should be filtered out
    ];
    const result = distinctBy(items, item => item.type);
    
    expect(result).toEqual([
      { type: 'A', value: 1 },
      { type: 'B', value: 2 },
      { type: 'C', value: 4 }
    ]);
  });

  // Edge cases
  it('should handle empty array', () => {
    const result = distinctBy([], x => x);
    expect(result).toEqual([]);
  });

  it('should handle single element array', () => {
    const result = distinctBy([{ id: 1 }], x => x.id);
    expect(result).toEqual([{ id: 1 }]);
  });

  it('should handle array with all unique elements', () => {
    const numbers = [1, 2, 3, 4, 5];
    const result = distinctBy(numbers, x => x);
    
    expect(result).toEqual([1, 2, 3, 4, 5]);
    expect(result).toHaveLength(5);
  });

  it('should handle array with all duplicate elements', () => {
    const items = [
      { category: 'A' },
      { category: 'A' },
      { category: 'A' }
    ];
    const result = distinctBy(items, x => x.category);
    
    expect(result).toEqual([{ category: 'A' }]);
    expect(result).toHaveLength(1);
  });

  it('should work with complex selector functions', () => {
    const people = [
      { name: 'Alice', age: 25, city: 'NYC' },
      { name: 'Bob', age: 30, city: 'LA' },
      { name: 'Charlie', age: 25, city: 'NYC' }, // Same age+city combination
      { name: 'David', age: 25, city: 'Chicago' }
    ];
    const result = distinctBy(people, p => `${p.age}-${p.city}`);
    
    expect(result).toEqual([
      { name: 'Alice', age: 25, city: 'NYC' },
      { name: 'Bob', age: 30, city: 'LA' },
      { name: 'David', age: 25, city: 'Chicago' }
    ]);
  });

  it('should work with nested object properties', () => {
    const items = [
      { id: 1, meta: { type: 'A' } },
      { id: 2, meta: { type: 'B' } },
      { id: 3, meta: { type: 'A' } },
      { id: 4, meta: { type: 'C' } }
    ];
    const result = distinctBy(items, item => item.meta.type);
    
    expect(result).toEqual([
      { id: 1, meta: { type: 'A' } },
      { id: 2, meta: { type: 'B' } },
      { id: 4, meta: { type: 'C' } }
    ]);
  });

  it('should handle selector returning different types', () => {
    const mixed = [
      { value: 1 },
      { value: '1' },
      { value: true },
      { value: 1 },
      { value: false }
    ];
    const result = distinctBy(mixed, item => typeof item.value);
    
    expect(result).toEqual([
      { value: 1 },
      { value: '1' },
      { value: true }
    ]);
  });

  it('should provide correct parameters to selector function', () => {
    const items = ['a', 'b', 'c'];
    const mockSelector = jest.fn((value, _index, _array) => value);
    
    distinctBy(items, mockSelector);
    
    expect(mockSelector).toHaveBeenCalledTimes(3);
    expect(mockSelector).toHaveBeenNthCalledWith(1, 'a', 0, items);
    expect(mockSelector).toHaveBeenNthCalledWith(2, 'b', 1, items);
    expect(mockSelector).toHaveBeenNthCalledWith(3, 'c', 2, items);
  });

  // Error cases
  it('should throw ValidationError for non-array input', () => {
    expect(() => distinctBy('not array' as any, x => x)).toThrow(ValidationError);
    expect(() => distinctBy(null as any, x => x)).toThrow(ValidationError);
    expect(() => distinctBy(undefined as any, x => x)).toThrow(ValidationError);
    expect(() => distinctBy(42 as any, x => x)).toThrow(ValidationError);
    expect(() => distinctBy({} as any, x => x)).toThrow(ValidationError);
  });

  it('should throw ValidationError for non-function selector', () => {
    expect(() => distinctBy([1, 2, 3], 'not function' as any)).toThrow(ValidationError);
    expect(() => distinctBy([1, 2, 3], null as any)).toThrow(ValidationError);
    expect(() => distinctBy([1, 2, 3], undefined as any)).toThrow(ValidationError);
    expect(() => distinctBy([1, 2, 3], 42 as any)).toThrow(ValidationError);
    expect(() => distinctBy([1, 2, 3], {} as any)).toThrow(ValidationError);
  });

  // Performance tests
  it('should handle large arrays efficiently', () => {
    const largeArray = Array.from({ length: 10000 }, (_, i) => ({
      id: i % 1000, // This will create 1000 unique ids with duplicates
      value: i
    }));
    
    const start = performance.now();
    const result = distinctBy(largeArray, item => item.id);
    const end = performance.now();
    
    expect(result).toHaveLength(1000); // Should have 1000 unique elements
    expect(end - start).toBeLessThan(100); // Should complete in reasonable time
    
    // Verify first occurrence is preserved
    expect(result[0]).toEqual({ id: 0, value: 0 });
    expect(result[1]).toEqual({ id: 1, value: 1 });
    expect(result[999]).toEqual({ id: 999, value: 999 });
  });

  it('should work with various key types', () => {
    const items = [
      { key: 1, value: 'a' },
      { key: '1', value: 'b' },
      { key: true, value: 'c' },
      { key: 1, value: 'd' },
      { key: '1', value: 'e' },
      { key: false, value: 'f' }
    ];
    const result = distinctBy(items, item => item.key);
    
    expect(result).toEqual([
      { key: 1, value: 'a' },
      { key: '1', value: 'b' },
      { key: true, value: 'c' },
      { key: false, value: 'f' }
    ]);
  });

  it('should handle null and undefined keys', () => {
    const items = [
      { key: null, value: 'a' },
      { key: undefined, value: 'b' },
      { key: null, value: 'c' },
      { key: undefined, value: 'd' },
      { key: 'valid', value: 'e' }
    ];
    const result = distinctBy(items, item => item.key);
    
    expect(result).toEqual([
      { key: null, value: 'a' },
      { key: undefined, value: 'b' },
      { key: 'valid', value: 'e' }
    ]);
  });

  it('should work with object references as keys', () => {
    const obj1 = { ref: 'a' };
    const obj2 = { ref: 'b' };
    const items = [
      { key: obj1, value: 1 },
      { key: obj2, value: 2 },
      { key: obj1, value: 3 }, // Same reference
      { key: { ref: 'a' }, value: 4 } // Different reference but same content
    ];
    const result = distinctBy(items, item => item.key);
    
    expect(result).toEqual([
      { key: obj1, value: 1 },
      { key: obj2, value: 2 },
      { key: { ref: 'a' }, value: 4 }
    ]);
    expect(result).toHaveLength(3);
  });
});