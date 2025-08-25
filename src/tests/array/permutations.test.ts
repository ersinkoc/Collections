import { permutations } from '../../core/array/permutations';
import { ValidationError } from '../../utils/errors';

describe('permutations', () => {
  it('should generate all permutations of a simple array', () => {
    const result = permutations([1, 2, 3]);
    expect(result).toEqual([
      [1, 2, 3],
      [1, 3, 2],
      [2, 1, 3],
      [2, 3, 1],
      [3, 1, 2],
      [3, 2, 1]
    ]);
    expect(result).toHaveLength(6); // 3! = 6
  });

  it('should generate permutations of two elements', () => {
    const result = permutations(['a', 'b']);
    expect(result).toEqual([
      ['a', 'b'],
      ['b', 'a']
    ]);
    expect(result).toHaveLength(2); // 2! = 2
  });

  it('should handle single element array', () => {
    const result = permutations([5]);
    expect(result).toEqual([[5]]);
    expect(result).toHaveLength(1); // 1! = 1
  });

  it('should handle empty array', () => {
    const result = permutations([]);
    expect(result).toEqual([[]]);
    expect(result).toHaveLength(1); // 0! = 1 by definition
  });

  it('should work with string elements', () => {
    const result = permutations(['x', 'y']);
    expect(result).toEqual([
      ['x', 'y'],
      ['y', 'x']
    ]);
  });

  it('should work with mixed data types', () => {
    const result = permutations([1, 'a', true]);
    expect(result).toEqual([
      [1, 'a', true],
      [1, true, 'a'],
      ['a', 1, true],
      ['a', true, 1],
      [true, 1, 'a'],
      [true, 'a', 1]
    ]);
    expect(result).toHaveLength(6); // 3! = 6
  });

  it('should handle arrays with duplicate elements', () => {
    const result = permutations([1, 1, 2]);
    expect(result).toEqual([
      [1, 1, 2],
      [1, 2, 1],
      [1, 1, 2], // Duplicate because original elements are identical
      [1, 2, 1], // Duplicate because original elements are identical
      [2, 1, 1],
      [2, 1, 1]  // Duplicate because original elements are identical
    ]);
    expect(result).toHaveLength(6); // Still 3! = 6, but with duplicates
  });

  it('should work with object elements', () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };
    const result = permutations([obj1, obj2]);
    
    expect(result).toEqual([
      [obj1, obj2],
      [obj2, obj1]
    ]);
    expect(result[0]![0]).toBe(obj1); // Should maintain object references
  });

  it('should generate correct number of permutations for different sizes', () => {
    expect(permutations([1])).toHaveLength(1);           // 1! = 1
    expect(permutations([1, 2])).toHaveLength(2);        // 2! = 2
    expect(permutations([1, 2, 3])).toHaveLength(6);     // 3! = 6
    expect(permutations([1, 2, 3, 4])).toHaveLength(24); // 4! = 24
  });

  it('should not modify original array', () => {
    const original = [1, 2, 3];
    const originalCopy = [...original];
    
    permutations(original);
    
    expect(original).toEqual(originalCopy);
  });

  it('should generate unique array instances', () => {
    const result = permutations([1, 2]);
    
    // Each permutation should be a different array instance
    expect(result[0]).not.toBe(result[1]);
    
    // Modifying one shouldn't affect others
    result[0]![0] = 999;
    expect(result[1]![0]).not.toBe(999);
  });

  it('should work with boolean values', () => {
    const result = permutations([true, false]);
    expect(result).toEqual([
      [true, false],
      [false, true]
    ]);
  });

  it('should work with null and undefined values', () => {
    const result = permutations([null, undefined, 1]);
    expect(result).toEqual([
      [null, undefined, 1],
      [null, 1, undefined],
      [undefined, null, 1],
      [undefined, 1, null],
      [1, null, undefined],
      [1, undefined, null]
    ]);
    expect(result).toHaveLength(6);
  });

  it('should handle arrays with nested arrays', () => {
    const result = permutations([[1, 2], [3, 4]]);
    expect(result).toEqual([
      [[1, 2], [3, 4]],
      [[3, 4], [1, 2]]
    ]);
    expect(result).toHaveLength(2);
  });

  it('should work with zero values', () => {
    const result = permutations([0, 1, 2]);
    expect(result).toEqual([
      [0, 1, 2],
      [0, 2, 1],
      [1, 0, 2],
      [1, 2, 0],
      [2, 0, 1],
      [2, 1, 0]
    ]);
  });

  it('should work with negative numbers', () => {
    const result = permutations([-1, 0, 1]);
    expect(result).toEqual([
      [-1, 0, 1],
      [-1, 1, 0],
      [0, -1, 1],
      [0, 1, -1],
      [1, -1, 0],
      [1, 0, -1]
    ]);
  });

  it('should throw ValidationError for non-array input', () => {
    expect(() => permutations('not array' as any)).toThrow(ValidationError);
    expect(() => permutations(null as any)).toThrow(ValidationError);
    expect(() => permutations(undefined as any)).toThrow(ValidationError);
    expect(() => permutations(123 as any)).toThrow(ValidationError);
    expect(() => permutations({} as any)).toThrow(ValidationError);
  });

  it('should handle large arrays with caution (performance test)', () => {
    // Test with 5 elements (5! = 120 permutations)
    const result = permutations([1, 2, 3, 4, 5]);
    expect(result).toHaveLength(120);
    
    // Verify first and last permutations are correct
    expect(result[0]).toEqual([1, 2, 3, 4, 5]);
    expect(result[result.length - 1]).toEqual([5, 4, 3, 2, 1]);
  });

  it('should maintain element order in each permutation correctly', () => {
    const result = permutations(['A', 'B', 'C']);
    
    // Check that each permutation contains all original elements
    for (const perm of result) {
      expect(perm).toHaveLength(3);
      expect(perm).toContain('A');
      expect(perm).toContain('B');
      expect(perm).toContain('C');
    }
  });

  it('should work with Symbol values', () => {
    const sym1 = Symbol('test1');
    const sym2 = Symbol('test2');
    const result = permutations([sym1, sym2]);
    
    expect(result).toEqual([
      [sym1, sym2],
      [sym2, sym1]
    ]);
  });

  it('should preserve array elements exactly', () => {
    const date = new Date('2023-01-01');
    const regex = /test/;
    const func = () => 'test';
    
    const result = permutations([date, regex, func]);
    
    // Check that all permutations contain the same object references
    for (const perm of result) {
      expect(perm).toContain(date);
      expect(perm).toContain(regex);
      expect(perm).toContain(func);
    }
    
    expect(result).toHaveLength(6);
  });

  it('should handle floating point numbers', () => {
    const result = permutations([1.1, 2.2]);
    expect(result).toEqual([
      [1.1, 2.2],
      [2.2, 1.1]
    ]);
  });

  it('should verify all permutations are unique for distinct elements', () => {
    const result = permutations([1, 2, 3]);
    const stringified = result.map(perm => JSON.stringify(perm));
    const uniqueStringified = [...new Set(stringified)];
    
    expect(stringified).toHaveLength(uniqueStringified.length);
  });

  it('should handle sparse arrays correctly', () => {
    const sparseArray = [1, , 3]; // Array with hole at index 1
    const result = permutations(sparseArray);
    
    // Should treat undefined as a value
    expect(result).toHaveLength(6); // 3! = 6
    expect(result.some(perm => perm.includes(undefined))).toBe(true);
  });

  it('should work with special numeric values', () => {
    const result = permutations([Infinity, -Infinity, NaN]);
    expect(result).toHaveLength(6);
    
    // Verify all special values are preserved
    for (const perm of result) {
      expect(perm.some(val => val === Infinity)).toBe(true);
      expect(perm.some(val => val === -Infinity)).toBe(true);
      expect(perm.some(val => Number.isNaN(val))).toBe(true);
    }
  });
});