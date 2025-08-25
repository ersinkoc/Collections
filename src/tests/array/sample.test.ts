import { sample } from '../../core/array/sample';
import { ValidationError, RangeError } from '../../utils/errors';

describe('sample', () => {
  beforeEach(() => {
    // Reset Math.random for deterministic tests where needed
    jest.spyOn(Math, 'random').mockRestore();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return single random element by default', () => {
    const array = [1, 2, 3, 4, 5];
    const result = sample(array);
    
    expect(result).toHaveLength(1);
    expect(array).toContain(result[0]);
  });

  it('should return specified number of elements', () => {
    const array = [1, 2, 3, 4, 5];
    const result = sample(array, 3);
    
    expect(result).toHaveLength(3);
    result.forEach(item => expect(array).toContain(item));
  });

  it('should return all elements when count equals array length', () => {
    const array = [1, 2, 3];
    const result = sample(array, 3);
    
    expect(result).toHaveLength(3);
    expect(result.sort()).toEqual(array.sort());
  });

  it('should not modify original array', () => {
    const original = [1, 2, 3, 4, 5];
    const originalCopy = [...original];
    
    sample(original, 2);
    
    expect(original).toEqual(originalCopy);
  });

  it('should return empty array for empty input array', () => {
    const result = sample([]);
    expect(result).toEqual([]);
  });

  it('should return empty array when count is 0', () => {
    const result = sample([1, 2, 3, 4, 5], 0);
    expect(result).toEqual([]);
  });

  it('should handle single element array', () => {
    const array = [42];
    const result = sample(array, 1);
    
    expect(result).toEqual([42]);
  });

  it('should work with different data types', () => {
    const mixedArray = [1, 'hello', true, null, { id: 1 }];
    const result = sample(mixedArray, 2);
    
    expect(result).toHaveLength(2);
    result.forEach(item => expect(mixedArray).toContain(item));
  });

  it('should work with string arrays', () => {
    const strings = ['apple', 'banana', 'cherry', 'date'];
    const result = sample(strings, 2);
    
    expect(result).toHaveLength(2);
    result.forEach(item => expect(strings).toContain(item));
  });

  it('should work with object arrays', () => {
    const objects = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' }
    ];
    const result = sample(objects, 2);
    
    expect(result).toHaveLength(2);
    result.forEach(item => expect(objects).toContain(item));
    
    // Should maintain object references
    expect(result[0]).toBe(objects.find(obj => obj === result[0]));
  });

  it('should produce different results on multiple calls (randomness test)', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const results: number[][] = [];
    
    // Generate multiple samples
    for (let i = 0; i < 10; i++) {
      results.push(sample(array, 3));
    }
    
    // Check that not all results are identical (very unlikely with proper randomness)
    const firstResult = JSON.stringify(results[0]!.sort());
    const allSame = results.every(result => JSON.stringify(result.sort()) === firstResult);
    expect(allSame).toBe(false);
  });

  it('should use Fisher-Yates shuffle algorithm correctly', () => {
    // Mock Math.random to produce predictable sequence
    const mockRandomValues = [0.8, 0.5, 0.2, 0.1]; // Values between 0 and 1
    let callIndex = 0;
    
    jest.spyOn(Math, 'random').mockImplementation(() => {
      return mockRandomValues[callIndex++] || 0;
    });
    
    const array = [1, 2, 3, 4, 5];
    const result = sample(array, 3);
    
    expect(result).toHaveLength(3);
    expect(Math.random).toHaveBeenCalledTimes(3);
  });

  it('should handle arrays with duplicate values', () => {
    const array = [1, 1, 2, 2, 3, 3];
    const result = sample(array, 3);
    
    expect(result).toHaveLength(3);
    result.forEach(item => expect(array).toContain(item));
  });

  it('should work with boolean arrays', () => {
    const booleans = [true, false, true, false];
    const result = sample(booleans, 2);
    
    expect(result).toHaveLength(2);
    result.forEach(item => expect(booleans).toContain(item));
  });

  it('should work with arrays containing special values', () => {
    const specialArray = [null, undefined, 0, false, '', NaN];
    const result = sample(specialArray, 3);
    
    expect(result).toHaveLength(3);
    result.forEach(item => expect(specialArray).toContain(item));
  });

  it('should maintain type safety', () => {
    const numberArray = [1, 2, 3, 4, 5];
    const result = sample(numberArray, 2);
    
    // TypeScript should ensure result is number[]
    expect(typeof result[0]).toBe('number');
  });

  it('should throw ValidationError for non-array input', () => {
    expect(() => sample('not array' as any)).toThrow(ValidationError);
    expect(() => sample(null as any)).toThrow(ValidationError);
    expect(() => sample(undefined as any)).toThrow(ValidationError);
    expect(() => sample(123 as any)).toThrow(ValidationError);
    expect(() => sample({} as any)).toThrow(ValidationError);
  });

  it('should throw ValidationError for invalid count parameter', () => {
    const array = [1, 2, 3];
    
    expect(() => sample(array, -1)).toThrow(ValidationError);
    expect(() => sample(array, 'invalid' as any)).toThrow(ValidationError);
    expect(() => sample(array, null as any)).toThrow(ValidationError);
    expect(() => sample(array, undefined as any)).toThrow(ValidationError);
    expect(() => sample(array, 1.5)).toThrow(ValidationError); // Non-integer
  });

  it('should throw RangeError when count exceeds array length', () => {
    const array = [1, 2, 3];
    
    expect(() => sample(array, 4)).toThrow(RangeError);
    expect(() => sample(array, 10)).toThrow(RangeError);
    
    // Check error message and details
    try {
      sample(array, 4);
    } catch (error) {
      expect(error).toBeInstanceOf(RangeError);
      expect((error as RangeError).message).toContain('Sample count (4) cannot be larger than array length (3)');
      expect((error as RangeError).details).toEqual({ count: 4, arrayLength: 3 });
    }
  });

  it('should handle edge case with count 0 on empty array', () => {
    const result = sample([], 0);
    expect(result).toEqual([]);
  });

  it('should work with large arrays efficiently', () => {
    const largeArray = Array.from({ length: 1000 }, (_, i) => i);
    const result = sample(largeArray, 100);
    
    expect(result).toHaveLength(100);
    
    // All elements should be from original array
    result.forEach(item => expect(largeArray).toContain(item));
    
    // Should not have duplicates (since we're sampling without replacement)
    const uniqueResults = [...new Set(result)];
    expect(uniqueResults).toHaveLength(100);
  });

  it('should ensure no duplicates in sample (sampling without replacement)', () => {
    const array = [1, 2, 3, 4, 5];
    const result = sample(array, 5);
    
    const uniqueResults = [...new Set(result)];
    expect(uniqueResults).toHaveLength(5);
    expect(uniqueResults.sort()).toEqual(array.sort());
  });

  it('should work with nested arrays and objects', () => {
    const complexArray = [
      [1, 2, 3],
      { name: 'test', values: [4, 5, 6] },
      new Date('2023-01-01'),
      /test/g
    ];
    
    const result = sample(complexArray, 2);
    
    expect(result).toHaveLength(2);
    result.forEach(item => expect(complexArray).toContain(item));
  });

  it('should handle arrays with function elements', () => {
    const func1 = () => 'hello';
    const func2 = () => 'world';
    const func3 = () => 'test';
    const funcArray = [func1, func2, func3];
    
    const result = sample(funcArray, 2);
    
    expect(result).toHaveLength(2);
    result.forEach(item => {
      expect(typeof item).toBe('function');
      expect(funcArray).toContain(item);
    });
  });

  it('should preserve Symbol values', () => {
    const sym1 = Symbol('test1');
    const sym2 = Symbol('test2');
    const sym3 = Symbol('test3');
    const symbolArray = [sym1, sym2, sym3];
    
    const result = sample(symbolArray, 2);
    
    expect(result).toHaveLength(2);
    result.forEach(item => {
      expect(typeof item).toBe('symbol');
      expect(symbolArray).toContain(item);
    });
  });

  it('should work with sparse arrays', () => {
    const sparseArray = [1, , 3, , 5]; // Array with holes
    const result = sample(sparseArray, 3);
    
    expect(result).toHaveLength(3);
    // Holes are treated as undefined values
    result.forEach(item => expect([1, undefined, 3, undefined, 5]).toContain(item));
  });

  it('should handle maximum safe integer values', () => {
    const array = [Number.MAX_SAFE_INTEGER - 1, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];
    const result = sample(array, 2);
    
    expect(result).toHaveLength(2);
    result.forEach(item => expect(array).toContain(item));
  });

  it('should be reasonably efficient for moderate sample sizes', () => {
    const array = Array.from({ length: 1000 }, (_, i) => i);
    
    const start = performance.now();
    const result = sample(array, 100);
    const end = performance.now();
    
    expect(result).toHaveLength(100);
    expect(end - start).toBeLessThan(100); // Should complete in reasonable time
  });

  it('should work correctly with various count values', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
    for (let count = 0; count <= array.length; count++) {
      const result = sample(array, count);
      expect(result).toHaveLength(count);
      
      if (count > 0) {
        result.forEach(item => expect(array).toContain(item));
        
        // Check for uniqueness
        const unique = [...new Set(result)];
        expect(unique).toHaveLength(count);
      }
    }
  });
});