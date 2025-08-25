import { intersection } from '../../../src/core/set/intersection';
import { ValidationError } from '../../../src/utils/errors';

describe('intersection', () => {
  describe('normal cases', () => {
    it('should return common elements between two sets', () => {
      const setA = new Set([1, 2, 3, 4]);
      const setB = new Set([3, 4, 5, 6]);
      const result = intersection(setA, setB);
      expect(result).toEqual(new Set([3, 4]));
    });

    it('should handle no common elements', () => {
      const setA = new Set([1, 2, 3]);
      const setB = new Set([4, 5, 6]);
      const result = intersection(setA, setB);
      expect(result).toEqual(new Set());
    });

    it('should handle all common elements', () => {
      const setA = new Set([1, 2, 3]);
      const setB = new Set([1, 2, 3]);
      const result = intersection(setA, setB);
      expect(result).toEqual(new Set([1, 2, 3]));
    });

    it('should work with strings', () => {
      const setA = new Set(['a', 'b', 'c']);
      const setB = new Set(['b', 'c', 'd']);
      const result = intersection(setA, setB);
      expect(result).toEqual(new Set(['b', 'c']));
    });

    it('should work with objects by reference', () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const obj3 = { id: 3 };
      const setA = new Set([obj1, obj2]);
      const setB = new Set([obj2, obj3]);
      const result = intersection(setA, setB);
      expect(result).toEqual(new Set([obj2]));
    });

    it('should handle mixed types', () => {
      const setA = new Set([1, '2', true, null]);
      const setB = new Set(['2', false, null, 1]);
      const result = intersection(setA, setB);
      expect(result).toEqual(new Set([1, '2', null]));
    });

    it('should handle NaN correctly', () => {
      const setA = new Set([1, NaN, 2]);
      const setB = new Set([NaN, 2, 3]);
      const result = intersection(setA, setB);
      expect(result).toEqual(new Set([NaN, 2]));
    });

    it('should optimize by iterating over smaller set', () => {
      const smallSet = new Set([1, 2]);
      const largeSet = new Set(Array.from({ length: 10000 }, (_, i) => i));
      
      const start1 = performance.now();
      const result1 = intersection(smallSet, largeSet);
      const time1 = performance.now() - start1;
      
      const start2 = performance.now();
      const result2 = intersection(largeSet, smallSet);
      const time2 = performance.now() - start2;
      
      expect(result1).toEqual(result2);
      expect(result1).toEqual(new Set([1, 2]));
      // Both should be fast due to optimization
      expect(Math.max(time1, time2)).toBeLessThan(10);
    });
  });

  describe('edge cases', () => {
    it('should handle empty setA', () => {
      const setA = new Set();
      const setB = new Set([1, 2, 3]);
      const result = intersection(setA, setB);
      expect(result).toEqual(new Set());
    });

    it('should handle empty setB', () => {
      const setA = new Set([1, 2, 3]);
      const setB = new Set();
      const result = intersection(setA, setB);
      expect(result).toEqual(new Set());
    });

    it('should handle both empty sets', () => {
      const setA = new Set();
      const setB = new Set();
      const result = intersection(setA, setB);
      expect(result).toEqual(new Set());
    });

    it('should handle subset relationship', () => {
      const setA = new Set([1, 2]);
      const setB = new Set([1, 2, 3, 4]);
      const result = intersection(setA, setB);
      expect(result).toEqual(new Set([1, 2]));
    });

    it('should handle large sets', () => {
      const setA = new Set(Array.from({ length: 10000 }, (_, i) => i));
      const setB = new Set(Array.from({ length: 10000 }, (_, i) => i + 5000));
      const result = intersection(setA, setB);
      expect(result.size).toBe(5000);
      expect(result.has(5000)).toBe(true);
      expect(result.has(9999)).toBe(true);
      expect(result.has(4999)).toBe(false);
    });

    it('should maintain immutability', () => {
      const setA = new Set([1, 2, 3]);
      const setB = new Set([2, 3, 4]);
      const result = intersection(setA, setB);
      
      expect(setA).toEqual(new Set([1, 2, 3]));
      expect(setB).toEqual(new Set([2, 3, 4]));
      
      result.add(5);
      expect(setA.has(5)).toBe(false);
      expect(setB.has(5)).toBe(false);
    });

    it('should return a new Set instance', () => {
      const setA = new Set([1, 2]);
      const setB = new Set([1, 2]);
      const result = intersection(setA, setB);
      expect(result).not.toBe(setA);
      expect(result).not.toBe(setB);
    });
  });

  describe('error cases', () => {
    it('should throw ValidationError for non-Set first argument', () => {
      const setB = new Set([1, 2]);
      expect(() => intersection(null as any, setB)).toThrow(ValidationError);
      expect(() => intersection(undefined as any, setB)).toThrow(ValidationError);
      expect(() => intersection([] as any, setB)).toThrow(ValidationError);
      expect(() => intersection({} as any, setB)).toThrow(ValidationError);
      expect(() => intersection(123 as any, setB)).toThrow(ValidationError);
    });

    it('should throw ValidationError for non-Set second argument', () => {
      const setA = new Set([1, 2]);
      expect(() => intersection(setA, null as any)).toThrow(ValidationError);
      expect(() => intersection(setA, undefined as any)).toThrow(ValidationError);
      expect(() => intersection(setA, [] as any)).toThrow(ValidationError);
      expect(() => intersection(setA, {} as any)).toThrow(ValidationError);
      expect(() => intersection(setA, 123 as any)).toThrow(ValidationError);
    });

    it('should throw ValidationError with meaningful message', () => {
      try {
        intersection(null as any, new Set());
      } catch (error: any) {
        expect(error.message).toContain('Set');
        expect(error.message).toContain('setA');
        expect(error.code).toBe('VALIDATION_ERROR');
      }

      try {
        intersection(new Set(), null as any);
      } catch (error: any) {
        expect(error.message).toContain('Set');
        expect(error.message).toContain('setB');
        expect(error.code).toBe('VALIDATION_ERROR');
      }
    });
  });

  describe('performance', () => {
    it('should handle large sets efficiently', () => {
      const setA = new Set(Array.from({ length: 100000 }, (_, i) => i));
      const setB = new Set(Array.from({ length: 100000 }, (_, i) => i * 2));
      
      const start = performance.now();
      const result = intersection(setA, setB);
      const end = performance.now();
      
      expect(result.size).toBe(50000); // Even numbers up to 100000
      expect(end - start).toBeLessThan(200); // Should complete within 200ms
    });

    it('should have O(min(n,m)) complexity', () => {
      // Test with different size combinations
      const sizes = [
        [100, 10000],
        [1000, 10000],
        [10000, 10000],
      ];
      const times: number[] = [];
      
      for (const [sizeA, sizeB] of sizes) {
        const setA = new Set(Array.from({ length: sizeA } as ArrayLike<unknown>, (_, i) => i));
        const setB = new Set(Array.from({ length: sizeB } as ArrayLike<unknown>, (_, i) => i));
        const start = performance.now();
        intersection(setA, setB);
        const end = performance.now();
        times.push(end - start);
      }
      
      // Time should scale with smaller set size
      expect(times[0]!).toBeLessThan(times[1]!);
      expect(times[1]!).toBeLessThan(times[2]!);
    });
  });
});