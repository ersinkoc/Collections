import { distinct } from '../../../src/core/array/distinct';
import { ValidationError } from '../../../src/utils/errors';

describe('distinct', () => {
  describe('normal cases', () => {
    it('should return unique elements from array', () => {
      expect(distinct([1, 2, 2, 3, 3, 3, 4])).toEqual([1, 2, 3, 4]);
    });

    it('should handle array with no duplicates', () => {
      expect(distinct([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
    });

    it('should work with strings', () => {
      expect(distinct(['a', 'b', 'b', 'c', 'a'])).toEqual(['a', 'b', 'c']);
    });

    it('should work with booleans', () => {
      expect(distinct([true, false, true, false, true])).toEqual([true, false]);
    });

    it('should work with mixed types', () => {
      expect(distinct([1, '1', 1, '1', 2])).toEqual([1, '1', 2]);
    });

    it('should maintain first occurrence order', () => {
      expect(distinct([3, 1, 2, 1, 3, 2])).toEqual([3, 1, 2]);
    });

    it('should handle null and undefined', () => {
      expect(distinct([1, null, 2, null, undefined, 3, undefined])).toEqual([
        1,
        null,
        2,
        undefined,
        3,
      ]);
    });

    it('should handle NaN values correctly', () => {
      expect(distinct([NaN, 1, NaN, 2])).toEqual([NaN, 1, 2]);
    });
  });

  describe('edge cases', () => {
    it('should handle empty array', () => {
      expect(distinct([])).toEqual([]);
    });

    it('should handle single element array', () => {
      expect(distinct([1])).toEqual([1]);
    });

    it('should handle all duplicate elements', () => {
      expect(distinct([1, 1, 1, 1, 1])).toEqual([1]);
    });

    it('should handle very large arrays', () => {
      const largeArray = Array.from({ length: 10000 }, (_, i) => i % 100);
      const result = distinct(largeArray);
      expect(result.length).toBe(100);
    });

    it('should maintain immutability', () => {
      const original = [1, 2, 2, 3];
      const result = distinct(original);
      expect(original).toEqual([1, 2, 2, 3]);
      result.push(4);
      expect(original).toEqual([1, 2, 2, 3]);
    });

    it('should handle objects by reference', () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const obj3 = { id: 1 }; // Different object with same content
      expect(distinct([obj1, obj2, obj1, obj3])).toEqual([obj1, obj2, obj3]);
    });
  });

  describe('error cases', () => {
    it('should throw ValidationError for non-array input', () => {
      expect(() => distinct(null as any)).toThrow(ValidationError);
      expect(() => distinct(undefined as any)).toThrow(ValidationError);
      expect(() => distinct('string' as any)).toThrow(ValidationError);
      expect(() => distinct(123 as any)).toThrow(ValidationError);
      expect(() => distinct({} as any)).toThrow(ValidationError);
      expect(() => distinct(new Set() as any)).toThrow(ValidationError);
    });

    it('should throw ValidationError with meaningful message', () => {
      try {
        distinct(null as any);
      } catch (error: any) {
        expect(error.message).toContain('array');
        expect(error.code).toBe('VALIDATION_ERROR');
        expect(error.details).toEqual({ paramName: 'array', value: null });
      }
    });
  });

  describe('performance', () => {
    it('should handle large arrays efficiently', () => {
      const largeArray = Array.from({ length: 100000 }, (_, i) => i % 1000);
      const start = performance.now();
      const result = distinct(largeArray);
      const end = performance.now();

      expect(result.length).toBe(1000);
      expect(end - start).toBeLessThan(100); // Should complete within 100ms
    });

    it('should use Set internally for O(n) complexity', () => {
      // Test with increasingly large arrays to verify linear complexity
      const sizes = [1000, 10000, 100000];
      const times: number[] = [];

      for (const size of sizes) {
        const array = Array.from({ length: size }, (_, i) => i % 100);
        const start = performance.now();
        distinct(array);
        const end = performance.now();
        times.push(end - start);
      }

      // Verify roughly linear growth (not exponential)
      const ratio1 = times[1]! / times[0]!;
      const ratio2 = times[2]! / times[1]!;
      expect(ratio2).toBeLessThan(ratio1 * 2); // Allow some variance but ensure not exponential
    });
  });
});