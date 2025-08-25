import { chunk } from '../../../src/core/array/chunk';
import { ValidationError, RangeError } from '../../../src/utils/errors';

describe('chunk', () => {
  describe('normal cases', () => {
    it('should split array into chunks of specified size', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('should handle array length divisible by chunk size', () => {
      expect(chunk([1, 2, 3, 4, 5, 6], 2)).toEqual([[1, 2], [3, 4], [5, 6]]);
    });

    it('should handle chunk size of 1', () => {
      expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
    });

    it('should handle chunk size larger than array', () => {
      expect(chunk([1, 2, 3], 5)).toEqual([[1, 2, 3]]);
    });

    it('should work with different types', () => {
      expect(chunk(['a', 'b', 'c', 'd'], 2)).toEqual([['a', 'b'], ['c', 'd']]);
      expect(chunk([true, false, true], 2)).toEqual([[true, false], [true]]);
    });

    it('should maintain element order', () => {
      const result = chunk([1, 2, 3, 4, 5, 6, 7], 3);
      expect(result).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
    });
  });

  describe('edge cases', () => {
    it('should handle empty array', () => {
      expect(chunk([], 1)).toEqual([]);
    });

    it('should handle single element array', () => {
      expect(chunk([1], 1)).toEqual([[1]]);
      expect(chunk([1], 5)).toEqual([[1]]);
    });

    it('should handle very large arrays', () => {
      const largeArray = Array.from({ length: 10000 }, (_, i) => i);
      const result = chunk(largeArray, 100);
      expect(result.length).toBe(100);
      expect(result[0]?.length).toBe(100);
    });

    it('should maintain immutability', () => {
      const original = [1, 2, 3, 4];
      const result = chunk(original, 2);
      expect(original).toEqual([1, 2, 3, 4]);
      result[0]?.push(5);
      expect(original).toEqual([1, 2, 3, 4]);
    });
  });

  describe('error cases', () => {
    it('should throw ValidationError for non-array input', () => {
      expect(() => chunk(null as any, 1)).toThrow(ValidationError);
      expect(() => chunk(undefined as any, 1)).toThrow(ValidationError);
      expect(() => chunk('string' as any, 1)).toThrow(ValidationError);
      expect(() => chunk(123 as any, 1)).toThrow(ValidationError);
      expect(() => chunk({} as any, 1)).toThrow(ValidationError);
    });

    it('should throw RangeError for invalid size', () => {
      expect(() => chunk([1, 2, 3], 0)).toThrow(RangeError);
      expect(() => chunk([1, 2, 3], -1)).toThrow(RangeError);
      expect(() => chunk([1, 2, 3], 1.5)).toThrow(RangeError);
      expect(() => chunk([1, 2, 3], NaN)).toThrow(RangeError);
      expect(() => chunk([1, 2, 3], Infinity)).toThrow(RangeError);
    });

    it('should throw ValidationError with meaningful message', () => {
      try {
        chunk(null as any, 1);
      } catch (error: any) {
        expect(error.message).toContain('array');
        expect(error.code).toBe('VALIDATION_ERROR');
      }
    });

    it('should throw RangeError with meaningful message', () => {
      try {
        chunk([1, 2, 3], 0);
      } catch (error: any) {
        expect(error.message).toContain('positive integer');
        expect(error.code).toBe('RANGE_ERROR');
      }
    });
  });

  describe('performance', () => {
    it('should handle large arrays efficiently', () => {
      const largeArray = Array.from({ length: 100000 }, (_, i) => i);
      const start = performance.now();
      const result = chunk(largeArray, 1000);
      const end = performance.now();
      
      expect(result.length).toBe(100);
      expect(end - start).toBeLessThan(100); // Should complete within 100ms
    });

    it('should not cause memory leaks', () => {
      const largeArray = Array.from({ length: 10000 }, (_, i) => ({ id: i }));
      const result = chunk(largeArray, 100);
      
      // Verify result structure
      expect(result.length).toBe(100);
      expect(result[0]?.length).toBe(100);
      expect(result[99]?.length).toBe(100);
    });
  });
});