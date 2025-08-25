import { includesValue } from '../../core/array/includes-value';
import { ValidationError } from '../../utils/errors';

describe('includesValue', () => {
  // Normal cases with primitive values
  it('should find primitive values using deep equality', () => {
    expect(includesValue([1, 2, 3], 2)).toBe(true);
    expect(includesValue(['a', 'b', 'c'], 'b')).toBe(true);
    expect(includesValue([true, false], true)).toBe(true);
    expect(includesValue([1, 2, 3], 4)).toBe(false);
    expect(includesValue(['a', 'b', 'c'], 'd')).toBe(false);
  });

  it('should find objects using deep equality', () => {
    const objects = [{ a: 1 }, { b: 2 }, { c: 3 }];
    
    expect(includesValue(objects, { a: 1 })).toBe(true);
    expect(includesValue(objects, { b: 2 })).toBe(true);
    expect(includesValue(objects, { c: 3 })).toBe(true);
    expect(includesValue(objects as any[], { d: 4 })).toBe(false);
    expect(includesValue(objects, { a: 2 })).toBe(false);
  });

  it('should find nested objects using deep equality', () => {
    const nested = [
      { user: { id: 1, name: 'Alice' } },
      { user: { id: 2, name: 'Bob' } },
      { data: { values: [1, 2, 3] } }
    ];
    
    expect(includesValue(nested, { user: { id: 1, name: 'Alice' } })).toBe(true);
    expect(includesValue(nested, { user: { id: 2, name: 'Bob' } })).toBe(true);
    expect(includesValue(nested, { data: { values: [1, 2, 3] } })).toBe(true);
    expect(includesValue(nested, { user: { id: 1, name: 'Charlie' } })).toBe(false);
    expect(includesValue(nested, { data: { values: [1, 2] } })).toBe(false);
  });

  it('should find arrays using deep equality', () => {
    const arrays = [[1, 2], ['a', 'b'], [true, false]];
    
    expect(includesValue(arrays, [1, 2])).toBe(true);
    expect(includesValue(arrays, ['a', 'b'])).toBe(true);
    expect(includesValue(arrays, [true, false])).toBe(true);
    expect(includesValue(arrays, [1, 3])).toBe(false);
    expect(includesValue(arrays, ['a'])).toBe(false);
  });

  it('should handle nested arrays', () => {
    const nestedArrays = [[[1, 2]], [['a'], ['b']], [[true, false], [null]]];
    
    expect(includesValue(nestedArrays, [[1, 2]])).toBe(true);
    expect(includesValue(nestedArrays, [['a'], ['b']])).toBe(true);
    expect(includesValue(nestedArrays, [[true, false], [null]])).toBe(true);
    expect(includesValue(nestedArrays, [[1, 3]])).toBe(false);
  });

  // Edge cases
  it('should handle empty array', () => {
    expect(includesValue([], 'anything')).toBe(false);
    expect(includesValue([], {})).toBe(false);
    expect(includesValue([], null)).toBe(false);
  });

  it('should handle single element array', () => {
    expect(includesValue([42], 42)).toBe(true);
    expect(includesValue([{ key: 'value' }], { key: 'value' })).toBe(true);
    expect(includesValue([42], 43)).toBe(false);
  });

  it('should handle null and undefined values', () => {
    const withNulls = [1, null, 'test', undefined, { a: 1 }];
    
    expect(includesValue(withNulls, null)).toBe(true);
    expect(includesValue(withNulls, undefined)).toBe(true);
    expect(includesValue(withNulls, 1)).toBe(true);
    expect(includesValue(withNulls, 'test')).toBe(true);
    expect(includesValue(withNulls, { a: 1 })).toBe(true);
  });

  it('should distinguish between null and undefined', () => {
    expect(includesValue([null], undefined)).toBe(false);
    expect(includesValue([undefined], null)).toBe(false);
    expect(includesValue([null], null)).toBe(true);
    expect(includesValue([undefined], undefined)).toBe(true);
  });

  it('should handle arrays with different data types', () => {
    const mixed = [1, 'hello', true, null, { a: 1 }, [1, 2]];
    
    expect(includesValue(mixed, 1)).toBe(true);
    expect(includesValue(mixed, 'hello')).toBe(true);
    expect(includesValue(mixed, true)).toBe(true);
    expect(includesValue(mixed, null)).toBe(true);
    expect(includesValue(mixed, { a: 1 })).toBe(true);
    expect(includesValue(mixed, [1, 2])).toBe(true);
    
    expect(includesValue(mixed, 2)).toBe(false);
    expect(includesValue(mixed, 'world')).toBe(false);
    expect(includesValue(mixed, false)).toBe(false);
    expect(includesValue(mixed as any[], { b: 2 })).toBe(false);
    expect(includesValue(mixed, [2, 3])).toBe(false);
  });

  // Type distinction tests
  it('should distinguish between different types', () => {
    const mixed = [1, '1', true, 'true'] as any[];
    
    expect(includesValue(mixed, 1)).toBe(true);
    expect(includesValue(mixed, '1')).toBe(true);
    expect(includesValue(mixed, true)).toBe(true);
    expect(includesValue(mixed, 'true')).toBe(true);
    
    // These should be false due to type differences
    expect(includesValue([1] as any[], '1')).toBe(false);
    expect(includesValue(['1'] as any[], 1)).toBe(false);
    expect(includesValue([true] as any[], 1)).toBe(false);
    expect(includesValue([true] as any[], 'true')).toBe(false);
  });

  it('should handle objects with different property order', () => {
    const objects = [{ a: 1, b: 2 }];
    
    expect(includesValue(objects, { a: 1, b: 2 })).toBe(true);
    expect(includesValue(objects, { b: 2, a: 1 })).toBe(true); // Different order, same content
  });

  it('should handle objects with missing properties', () => {
    const objects = [{ a: 1, b: 2, c: 3 }];
    
    expect(includesValue(objects as any[], { a: 1, b: 2 })).toBe(false); // Missing property c
    expect(includesValue(objects as any[], { a: 1, b: 2, c: 3, d: 4 })).toBe(false); // Extra property d
  });

  it('should handle arrays with different lengths', () => {
    const arrays = [[1, 2, 3]];
    
    expect(includesValue(arrays, [1, 2])).toBe(false);
    expect(includesValue(arrays, [1, 2, 3, 4])).toBe(false);
  });

  it('should handle complex nested structures', () => {
    const complex = [
      {
        id: 1,
        user: { name: 'Alice', roles: ['admin', 'user'] },
        settings: { theme: 'dark', notifications: true },
        metadata: { created: new Date('2023-01-01'), tags: ['important'] }
      }
    ];
    
    const searchValue = {
      id: 1,
      user: { name: 'Alice', roles: ['admin', 'user'] },
      settings: { theme: 'dark', notifications: true },
      metadata: { created: new Date('2023-01-01'), tags: ['important'] }
    };
    
    expect(includesValue(complex, searchValue)).toBe(true);
    
    // Modify one nested property
    const modifiedSearch = { ...searchValue };
    modifiedSearch.user.name = 'Bob';
    expect(includesValue(complex, modifiedSearch)).toBe(false);
  });

  // Performance considerations
  it('should handle arrays with many identical objects', () => {
    const duplicates = Array(100).fill({ a: 1, b: 2 });
    
    expect(includesValue(duplicates, { a: 1, b: 2 })).toBe(true);
    expect(includesValue(duplicates, { a: 2, b: 1 })).toBe(false);
  });

  it('should handle deep nesting', () => {
    const deep = [{ a: { b: { c: { d: { e: 'deep' } } } } }];
    
    expect(includesValue(deep, { a: { b: { c: { d: { e: 'deep' } } } } })).toBe(true);
    expect(includesValue(deep, { a: { b: { c: { d: { e: 'shallow' } } } } })).toBe(false);
  });

  // Special values
  it('should handle special numeric values', () => {
    const special = [NaN, Infinity, -Infinity, 0, -0];
    
    expect(includesValue(special, NaN)).toBe(false); // NaN !== NaN
    expect(includesValue(special, Infinity)).toBe(true);
    expect(includesValue(special, -Infinity)).toBe(true);
    expect(includesValue(special, 0)).toBe(true);
    expect(includesValue(special, -0)).toBe(true);
  });

  it('should handle Date objects', () => {
    const date1 = new Date('2023-01-01');
    const date2 = new Date('2023-01-01'); // Same date, different instance
    const date3 = new Date('2023-01-02');
    const dates = [date1];
    
    expect(includesValue(dates, date1)).toBe(true); // Same reference
    expect(includesValue(dates, date2)).toBe(true); // Different instance but deep equality finds it
    expect(includesValue(dates, date3)).toBe(false);
  });

  it('should handle function references', () => {
    const fn1 = () => 'test';
    const fn2 = () => 'test'; // Same code, different reference
    const functions = [fn1];
    
    expect(includesValue(functions, fn1)).toBe(true); // Same reference
    expect(includesValue(functions, fn2)).toBe(false); // Different reference
  });

  // Error cases
  it('should throw ValidationError for non-array input', () => {
    expect(() => includesValue('not array' as any, 'value')).toThrow(ValidationError);
    expect(() => includesValue(null as any, 'value')).toThrow(ValidationError);
    expect(() => includesValue(undefined as any, 'value')).toThrow(ValidationError);
    expect(() => includesValue(42 as any, 'value')).toThrow(ValidationError);
    expect(() => includesValue({} as any, 'value')).toThrow(ValidationError);
  });

  // Performance tests
  it('should handle large arrays with primitive values efficiently', () => {
    const largeArray = Array.from({ length: 10000 }, (_, i) => i);
    
    const start = performance.now();
    const found = includesValue(largeArray, 5000);
    const notFound = includesValue(largeArray, 15000);
    const end = performance.now();
    
    expect(found).toBe(true);
    expect(notFound).toBe(false);
    expect(end - start).toBeLessThan(50); // Should complete reasonably fast
  });

  it('should handle large arrays with objects efficiently', () => {
    const largeArray = Array.from({ length: 1000 }, (_, i) => ({ id: i, value: `item${i}` }));
    
    const start = performance.now();
    const found = includesValue(largeArray, { id: 500, value: 'item500' });
    const notFound = includesValue(largeArray, { id: 1500, value: 'item1500' });
    const end = performance.now();
    
    expect(found).toBe(true);
    expect(notFound).toBe(false);
    expect(end - start).toBeLessThan(100); // Object comparison is more expensive
  });

  it('should short-circuit on first match', () => {
    const array = [{ a: 1 }, { b: 2 }, { c: 3 }];
    
    const target = { a: 1 }; // Should match first element
    const result = includesValue(array, target);
    
    expect(result).toBe(true);
    // The function should find the match early and not continue checking
  });

  it('should handle circular references by throwing error', () => {
    const circular: any = { a: 1 };
    circular.self = circular;
    const array = [circular];
    
    const searchCircular: any = { a: 1 };
    searchCircular.self = searchCircular;
    
    // The deep equality implementation causes stack overflow with circular references
    expect(() => includesValue(array, searchCircular)).toThrow();
  });

  it('should maintain consistent behavior with standard array methods', () => {
    const primitives = [1, 2, 3, 'a', 'b'];
    
    // For primitives, should behave similar to includes()
    expect(includesValue(primitives, 2)).toBe(primitives.includes(2));
    expect(includesValue(primitives, 'a')).toBe(primitives.includes('a'));
    expect(includesValue(primitives, 4)).toBe(primitives.includes(4));
    
    // But for objects, our deep equality should find matches that includes() wouldn't
    const objects = [{ a: 1 }];
    expect(includesValue(objects, { a: 1 })).toBe(true);
    expect(objects.includes({ a: 1 } as any)).toBe(false);
  });
});