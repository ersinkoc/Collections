import { difference } from '../../../src/core/set/difference';
import { ValidationError } from '../../../src/utils/errors';

describe('difference', () => {
  describe('normal cases', () => {
    it('should return elements in A but not in B', () => {
      const setA = new Set([1, 2, 3, 4]);
      const setB = new Set([3, 4, 5, 6]);
      const result = difference(setA, setB);
      expect(result).toEqual(new Set([1, 2]));
    });

    it('should handle no common elements', () => {
      const setA = new Set([1, 2, 3]);
      const setB = new Set([4, 5, 6]);
      const result = difference(setA, setB);
      expect(result).toEqual(new Set([1, 2, 3]));
    });

    it('should handle all common elements', () => {
      const setA = new Set([1, 2, 3]);
      const setB = new Set([1, 2, 3, 4, 5]);
      const result = difference(setA, setB);
      expect(result).toEqual(new Set());
    });

    it('should work with strings', () => {
      const setA = new Set(['a', 'b', 'c']);
      const setB = new Set(['b', 'c', 'd']);
      const result = difference(setA, setB);
      expect(result).toEqual(new Set(['a']));
    });

    it('should work with objects by reference', () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const obj3 = { id: 3 };
      const setA = new Set([obj1, obj2]);
      const setB = new Set([obj2, obj3]);
      const result = difference(setA, setB);
      expect(result).toEqual(new Set([obj1]));
    });

    it('should handle mixed types', () => {
      const setA = new Set([1, '2', true, null]);
      const setB = new Set(['2', false, null]);
      const result = difference(setA, setB);
      expect(result).toEqual(new Set([1, true]));
    });

    it('should handle NaN correctly', () => {
      const setA = new Set([1, NaN, 2]);
      const setB = new Set([NaN, 3]);
      const result = difference(setA, setB);
      expect(result).toEqual(new Set([1, 2]));
    });
  });

  describe('edge cases', () => {
    it('should handle empty setA', () => {
      const setA = new Set();
      const setB = new Set([1, 2, 3]);
      const result = difference(setA, setB);
      expect(result).toEqual(new Set());
    });

    it('should handle empty setB', () => {
      const setA = new Set([1, 2, 3]);
      const setB = new Set();
      const result = difference(setA, setB);
      expect(result).toEqual(new Set([1, 2, 3]));
    });

    it('should handle both empty sets', () => {
      const setA = new Set();
      const setB = new Set();
      const result = difference(setA, setB);
      expect(result).toEqual(new Set());
    });

    it('should handle identical sets', () => {
      const setA = new Set([1, 2, 3]);
      const setB = new Set([1, 2, 3]);
      const result = difference(setA, setB);
      expect(result).toEqual(new Set());
    });

    it('should handle large sets', () => {
      const setA = new Set(Array.from({ length: 10000 }, (_, i) => i));
      const setB = new Set(Array.from({ length: 10000 }, (_, i) => i + 5000));
      const result = difference(setA, setB);
      expect(result.size).toBe(5000);
      expect(result.has(0)).toBe(true);
      expect(result.has(4999)).toBe(true);
      expect(result.has(5000)).toBe(false);
    });

    it('should maintain immutability', () => {
      const setA = new Set([1, 2, 3]);
      const setB = new Set([2, 3, 4]);
      const result = difference(setA, setB);
      
      expect(setA).toEqual(new Set([1, 2, 3]));
      expect(setB).toEqual(new Set([2, 3, 4]));
      
      result.add(5);
      expect(setA.has(5)).toBe(false);
    });

    it('should return a new Set instance', () => {
      const setA = new Set([1, 2]);
      const setB = new Set([3, 4]);
      const result = difference(setA, setB);
      expect(result).not.toBe(setA);
      expect(result).not.toBe(setB);
    });
  });

  describe('error cases', () => {
    it('should throw ValidationError for non-Set first argument', () => {
      const setB = new Set([1, 2]);
      expect(() => difference(null as any, setB)).toThrow(ValidationError);
      expect(() => difference(undefined as any, setB)).toThrow(ValidationError);
      expect(() => difference([] as any, setB)).toThrow(ValidationError);
      expect(() => difference({} as any, setB)).toThrow(ValidationError);
      expect(() => difference(123 as any, setB)).toThrow(ValidationError);
    });

    it('should throw ValidationError for non-Set second argument', () => {
      const setA = new Set([1, 2]);
      expect(() => difference(setA, null as any)).toThrow(ValidationError);
      expect(() => difference(setA, undefined as any)).toThrow(ValidationError);
      expect(() => difference(setA, [] as any)).toThrow(ValidationError);
      expect(() => difference(setA, {} as any)).toThrow(ValidationError);
      expect(() => difference(setA, 123 as any)).toThrow(ValidationError);
    });

    it('should throw ValidationError with meaningful message', () => {
      try {
        difference(null as any, new Set());
      } catch (error: any) {
        expect(error.message).toContain('Set');
        expect(error.message).toContain('setA');
        expect(error.code).toBe('VALIDATION_ERROR');
      }

      try {
        difference(new Set(), null as any);
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
      const result = difference(setA, setB);
      const end = performance.now();
      
      expect(result.size).toBe(50000); // Odd numbers
      expect(end - start).toBeLessThan(200); // Should complete within 200ms
    });

    it('should have O(n) complexity where n is size of setB', () => {
      const setA = new Set(Array.from({ length: 10000 }, (_, i) => i));
      const sizes = [100, 1000, 10000];
      const times: number[] = [];
      
      for (const size of sizes) {
        const setB = new Set(Array.from({ length: size }, (_, i) => i * 2));
        const start = performance.now();
        difference(setA, setB);
        const end = performance.now();
        times.push(end - start);
      }
      
      // Verify roughly linear growth
      const ratio1 = times[1]! / times[0]!;
      const ratio2 = times[2]! / times[1]!;
      expect(ratio2).toBeLessThan(ratio1 * 2);
    });
  });
});