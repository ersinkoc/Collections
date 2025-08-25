import { union } from '../../../src/core/set/union';
import { ValidationError } from '../../../src/utils/errors';

describe('union', () => {
  describe('normal cases', () => {
    it('should return all elements from both sets', () => {
      const setA = new Set([1, 2, 3]);
      const setB = new Set([3, 4, 5]);
      const result = union(setA, setB);
      expect(result).toEqual(new Set([1, 2, 3, 4, 5]));
    });

    it('should handle no common elements', () => {
      const setA = new Set([1, 2, 3]);
      const setB = new Set([4, 5, 6]);
      const result = union(setA, setB);
      expect(result).toEqual(new Set([1, 2, 3, 4, 5, 6]));
    });

    it('should handle all common elements', () => {
      const setA = new Set([1, 2, 3]);
      const setB = new Set([1, 2, 3]);
      const result = union(setA, setB);
      expect(result).toEqual(new Set([1, 2, 3]));
    });

    it('should work with strings', () => {
      const setA = new Set(['a', 'b']);
      const setB = new Set(['b', 'c', 'd']);
      const result = union(setA, setB);
      expect(result).toEqual(new Set(['a', 'b', 'c', 'd']));
    });

    it('should work with objects by reference', () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const obj3 = { id: 3 };
      const setA = new Set([obj1, obj2]);
      const setB = new Set([obj2, obj3]);
      const result = union(setA, setB);
      expect(result).toEqual(new Set([obj1, obj2, obj3]));
    });

    it('should handle mixed types', () => {
      const setA = new Set([1, '2', true]);
      const setB = new Set(['2', false, null]);
      const result = union(setA, setB);
      expect(result).toEqual(new Set([1, '2', true, false, null]));
    });

    it('should handle NaN correctly', () => {
      const setA = new Set([1, NaN]);
      const setB = new Set([NaN, 2]);
      const result = union(setA, setB);
      expect(result).toEqual(new Set([1, NaN, 2]));
      expect(result.size).toBe(3);
    });

    it('should preserve order from setA first then setB', () => {
      const setA = new Set([3, 1, 2]);
      const setB = new Set([5, 4, 2]);
      const result = union(setA, setB);
      const values = Array.from(result);
      expect(values).toEqual([3, 1, 2, 5, 4]);
    });
  });

  describe('edge cases', () => {
    it('should handle empty setA', () => {
      const setA = new Set();
      const setB = new Set([1, 2, 3]);
      const result = union(setA, setB);
      expect(result).toEqual(new Set([1, 2, 3]));
    });

    it('should handle empty setB', () => {
      const setA = new Set([1, 2, 3]);
      const setB = new Set();
      const result = union(setA, setB);
      expect(result).toEqual(new Set([1, 2, 3]));
    });

    it('should handle both empty sets', () => {
      const setA = new Set();
      const setB = new Set();
      const result = union(setA, setB);
      expect(result).toEqual(new Set());
    });

    it('should handle subset relationship', () => {
      const setA = new Set([1, 2]);
      const setB = new Set([1, 2, 3, 4]);
      const result = union(setA, setB);
      expect(result).toEqual(new Set([1, 2, 3, 4]));
    });

    it('should handle large sets', () => {
      const setA = new Set(Array.from({ length: 10000 }, (_, i) => i));
      const setB = new Set(Array.from({ length: 10000 }, (_, i) => i + 5000));
      const result = union(setA, setB);
      expect(result.size).toBe(15000);
      expect(result.has(0)).toBe(true);
      expect(result.has(14999)).toBe(true);
    });

    it('should maintain immutability', () => {
      const setA = new Set([1, 2]);
      const setB = new Set([3, 4]);
      const result = union(setA, setB);
      
      expect(setA).toEqual(new Set([1, 2]));
      expect(setB).toEqual(new Set([3, 4]));
      
      result.add(5);
      expect(setA.has(5)).toBe(false);
      expect(setB.has(5)).toBe(false);
    });

    it('should return a new Set instance', () => {
      const setA = new Set([1, 2]);
      const setB = new Set([3, 4]);
      const result = union(setA, setB);
      expect(result).not.toBe(setA);
      expect(result).not.toBe(setB);
    });

    it('should handle undefined and null values', () => {
      const setA = new Set([undefined, 1]);
      const setB = new Set([null, 2]);
      const result = union(setA, setB);
      expect(result).toEqual(new Set([undefined, 1, null, 2]));
    });
  });

  describe('error cases', () => {
    it('should throw ValidationError for non-Set first argument', () => {
      const setB = new Set([1, 2]);
      expect(() => union(null as any, setB)).toThrow(ValidationError);
      expect(() => union(undefined as any, setB)).toThrow(ValidationError);
      expect(() => union([] as any, setB)).toThrow(ValidationError);
      expect(() => union({} as any, setB)).toThrow(ValidationError);
      expect(() => union(123 as any, setB)).toThrow(ValidationError);
    });

    it('should throw ValidationError for non-Set second argument', () => {
      const setA = new Set([1, 2]);
      expect(() => union(setA, null as any)).toThrow(ValidationError);
      expect(() => union(setA, undefined as any)).toThrow(ValidationError);
      expect(() => union(setA, [] as any)).toThrow(ValidationError);
      expect(() => union(setA, {} as any)).toThrow(ValidationError);
      expect(() => union(setA, 123 as any)).toThrow(ValidationError);
    });

    it('should throw ValidationError with meaningful message', () => {
      try {
        union(null as any, new Set());
      } catch (error: any) {
        expect(error.message).toContain('Set');
        expect(error.message).toContain('setA');
        expect(error.code).toBe('VALIDATION_ERROR');
        expect(error.details).toEqual({ paramName: 'setA', value: null });
      }

      try {
        union(new Set(), null as any);
      } catch (error: any) {
        expect(error.message).toContain('Set');
        expect(error.message).toContain('setB');
        expect(error.code).toBe('VALIDATION_ERROR');
        expect(error.details).toEqual({ paramName: 'setB', value: null });
      }
    });
  });

  describe('performance', () => {
    it('should handle large sets efficiently', () => {
      const setA = new Set(Array.from({ length: 100000 }, (_, i) => i));
      const setB = new Set(Array.from({ length: 100000 }, (_, i) => i + 50000));
      
      const start = performance.now();
      const result = union(setA, setB);
      const end = performance.now();
      
      expect(result.size).toBe(150000);
      expect(end - start).toBeLessThan(300); // Should complete within 300ms
    });

    it('should have O(n + m) complexity', () => {
      const sizes = [
        [1000, 1000],
        [10000, 10000],
        [100000, 100000],
      ];
      const times: number[] = [];
      
      for (const [sizeA, sizeB] of sizes) {
        const setA = new Set(Array.from({ length: sizeA } as ArrayLike<unknown>, (_, i) => i));
        const setB = new Set(Array.from({ length: sizeB } as ArrayLike<unknown>, (_, i) => i + sizeA));
        const start = performance.now();
        union(setA, setB);
        const end = performance.now();
        times.push(end - start);
      }
      
      // Verify roughly linear growth
      const ratio1 = times[1]! / times[0]!;
      const ratio2 = times[2]! / times[1]!;
      expect(ratio2).toBeLessThan(ratio1 * 2);
    });

    it('should efficiently handle duplicate elements', () => {
      const setA = new Set(Array.from({ length: 50000 }, (_, i) => i));
      const setB = new Set(Array.from({ length: 50000 }, (_, i) => i)); // Same elements
      
      const start = performance.now();
      const result = union(setA, setB);
      const end = performance.now();
      
      expect(result.size).toBe(50000);
      expect(end - start).toBeLessThan(100); // Should be fast for duplicates
    });
  });
});