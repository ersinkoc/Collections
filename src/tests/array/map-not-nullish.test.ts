import { mapNotNullish } from '../../core/array/map-not-nullish';
import { ValidationError } from '../../utils/errors';

describe('mapNotNullish', () => {
  it('should map and filter out null values', () => {
    const result = mapNotNullish([1, 2, 3, 4], x => x > 2 ? x * 2 : null);
    expect(result).toEqual([6, 8]);
  });

  it('should map and filter out undefined values', () => {
    const result = mapNotNullish([1, 2, 3, 4], x => x % 2 === 0 ? x * 3 : undefined);
    expect(result).toEqual([6, 12]);
  });

  it('should map and filter out both null and undefined values', () => {
    const result = mapNotNullish([1, 2, 3, 4, 5], x => {
      if (x === 1) return null;
      if (x === 3) return undefined;
      return x * 2;
    });
    expect(result).toEqual([4, 8, 10]);
  });

  it('should return all mapped values when none are nullish', () => {
    const result = mapNotNullish([1, 2, 3], x => x * 2);
    expect(result).toEqual([2, 4, 6]);
  });

  it('should return empty array when all mapped values are nullish', () => {
    const result = mapNotNullish([1, 2, 3], () => null);
    expect(result).toEqual([]);
    
    const result2 = mapNotNullish([1, 2, 3], () => undefined);
    expect(result2).toEqual([]);
  });

  it('should handle empty array', () => {
    const result = mapNotNullish([], x => x);
    expect(result).toEqual([]);
  });

  it('should handle single element array', () => {
    expect(mapNotNullish([5], x => x * 2)).toEqual([10]);
    expect(mapNotNullish([5], () => null)).toEqual([]);
    expect(mapNotNullish([5], () => undefined)).toEqual([]);
  });

  it('should provide correct arguments to mapper function', () => {
    const mockMapper = jest.fn(x => x * 2);
    const array = [10, 20, 30];
    
    mapNotNullish(array, mockMapper);
    
    expect(mockMapper).toHaveBeenCalledTimes(3);
    expect(mockMapper).toHaveBeenNthCalledWith(1, 10, 0, array);
    expect(mockMapper).toHaveBeenNthCalledWith(2, 20, 1, array);
    expect(mockMapper).toHaveBeenNthCalledWith(3, 30, 2, array);
  });

  it('should work with different data types', () => {
    // String to number mapping
    expect(mapNotNullish(['1', '2', 'abc', '4'], str => {
      const num = parseInt(str, 10);
      return isNaN(num) ? null : num;
    })).toEqual([1, 2, 4]);

    // Object mapping
    const users = [
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: null },
      { name: 'Charlie', age: 30 }
    ];
    expect(mapNotNullish(users, user => user.age !== null ? user.name : null))
      .toEqual(['Alice', 'Charlie']);

    // Boolean mapping  
    expect(mapNotNullish([1, 2, 3, 4], x => x > 2 ? true : null))
      .toEqual([true, true]);
  });

  it('should handle complex mapper functions', () => {
    const complexMapper = (x: number, index: number, arr: number[]) => {
      if (index === 0) return null; // Skip first element
      if (x % 2 === 0) return undefined; // Skip even numbers
      if (x > arr.length) return x * index; // Multiply by index if greater than array length
      return x; // Return as-is for other cases
    };

    const result = mapNotNullish([1, 2, 3, 4, 5], complexMapper);
    expect(result).toEqual([3, 5]); // Only odd numbers except first (skipped)
  });

  it('should handle falsy but non-nullish values', () => {
    const result = mapNotNullish([1, 2, 3, 4], x => {
      if (x === 1) return 0;        // falsy but not nullish
      if (x === 2) return '';       // falsy but not nullish
      if (x === 3) return false;    // falsy but not nullish
      if (x === 4) return null;     // nullish - should be filtered
      return x;
    });
    expect(result).toEqual([0, '', false]);
  });

  it('should throw ValidationError for non-array input', () => {
    expect(() => mapNotNullish('not array' as any, x => x)).toThrow(ValidationError);
    expect(() => mapNotNullish(null as any, x => x)).toThrow(ValidationError);
    expect(() => mapNotNullish(undefined as any, x => x)).toThrow(ValidationError);
    expect(() => mapNotNullish(123 as any, x => x)).toThrow(ValidationError);
    expect(() => mapNotNullish({} as any, x => x)).toThrow(ValidationError);
  });

  it('should throw ValidationError for non-function mapper', () => {
    expect(() => mapNotNullish([1, 2, 3], 'not function' as any)).toThrow(ValidationError);
    expect(() => mapNotNullish([1, 2, 3], null as any)).toThrow(ValidationError);
    expect(() => mapNotNullish([1, 2, 3], undefined as any)).toThrow(ValidationError);
    expect(() => mapNotNullish([1, 2, 3], 123 as any)).toThrow(ValidationError);
    expect(() => mapNotNullish([1, 2, 3], {} as any)).toThrow(ValidationError);
  });

  it('should handle large arrays efficiently', () => {
    const largeArray = Array.from({ length: 10000 }, (_, i) => i);
    const result = mapNotNullish(largeArray, x => x % 2 === 0 ? x * 2 : null);
    
    expect(result).toHaveLength(5000); // Half should be filtered out (odd numbers)
    expect(result[0]).toBe(0);  // First even number (0) mapped to 0
    expect(result[1]).toBe(4);  // Second even number (2) mapped to 4
    expect(result[2]).toBe(8);  // Third even number (4) mapped to 8
  });

  it('should maintain correct type inference', () => {
    // Number to string
    const stringResult = mapNotNullish([1, 2, 3], x => x > 1 ? x.toString() : null);
    expect(stringResult).toEqual(['2', '3']);
    expect(typeof stringResult[0]).toBe('string');

    // Number to boolean
    const boolResult = mapNotNullish([1, 2, 3], x => x > 2 ? true : null);
    expect(boolResult).toEqual([true]);
    expect(typeof boolResult[0]).toBe('boolean');
  });

  it('should handle nested arrays and objects', () => {
    const data = [
      { items: [1, 2] },
      { items: null },
      { items: [3, 4, 5] }
    ];

    const result = mapNotNullish(data, obj => 
      obj.items ? obj.items.length : null
    );
    expect(result).toEqual([2, 3]);
  });

  it('should work with sparse arrays', () => {
    // Create sparse array with holes
    const sparseArray = [1, , 3, , 5]; // Array with undefined elements at indices 1 and 3
    const result = mapNotNullish(sparseArray, x => x !== undefined ? x * 2 : null);
    expect(result).toEqual([2, 6, 10]);
  });
});