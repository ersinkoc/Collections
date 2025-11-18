import { groupBy } from '../../../src/core/array/group-by';
import { ValidationError } from '../../../src/utils/errors';

describe('groupBy', () => {
  describe('normal cases', () => {
    it('should group elements by selector function', () => {
      const users = [
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
        { name: 'Charlie', age: 25 },
      ];
      const result = groupBy(users, (u) => u.age);
      expect(result).toEqual({
        25: [
          { name: 'Alice', age: 25 },
          { name: 'Charlie', age: 25 },
        ],
        30: [{ name: 'Bob', age: 30 }],
      });
    });

    it('should group numbers by value', () => {
      const result = groupBy([1, 2, 1, 3, 2, 3, 3], (x) => x);
      expect(result).toEqual({
        1: [1, 1],
        2: [2, 2],
        3: [3, 3, 3],
      });
    });

    it('should group strings by first letter', () => {
      const words = ['apple', 'apricot', 'banana', 'cherry', 'cranberry'];
      const result = groupBy(words, (w) => w[0]!);
      expect(result).toEqual({
        a: ['apple', 'apricot'],
        b: ['banana'],
        c: ['cherry', 'cranberry'],
      });
    });

    it('should pass index to selector function', () => {
      const result = groupBy([10, 20, 30, 40], (_, index) => index % 2);
      expect(result).toEqual({
        0: [10, 30],
        1: [20, 40],
      });
    });

    it('should pass array to selector function', () => {
      const arr = [1, 2, 3];
      groupBy(arr, (value, _index, array) => {
        expect(array).toBe(arr);
        return value;
      });
    });

    it('should handle computed keys', () => {
      const result = groupBy([1, 2, 3, 4, 5], (x) => x % 2 === 0 ? 'even' : 'odd');
      expect(result).toEqual({
        odd: [1, 3, 5],
        even: [2, 4],
      });
    });

    it('should preserve element order within groups', () => {
      const items = [
        { id: 1, type: 'a' },
        { id: 2, type: 'b' },
        { id: 3, type: 'a' },
        { id: 4, type: 'b' },
        { id: 5, type: 'a' },
      ];
      const result = groupBy(items, (item) => item.type);
      expect(result['a']).toEqual([
        { id: 1, type: 'a' },
        { id: 3, type: 'a' },
        { id: 5, type: 'a' },
      ]);
    });
  });

  describe('edge cases', () => {
    it('should handle empty array', () => {
      const result = groupBy([], (x: any) => x);
      expect(result).toEqual({});
    });

    it('should handle single element array', () => {
      const result = groupBy([1], (x) => x);
      expect(result).toEqual({ 1: [1] });
    });

    it('should handle all elements in same group', () => {
      const result = groupBy([1, 2, 3, 4], () => 'same');
      expect(result).toEqual({ same: [1, 2, 3, 4] });
    });

    it('should handle all elements in different groups', () => {
      const result = groupBy([1, 2, 3], (x) => x);
      expect(result).toEqual({ 1: [1], 2: [2], 3: [3] });
    });

    it('should handle null and undefined keys', () => {
      const items = [
        { id: 1, type: null },
        { id: 2, type: undefined },
        { id: 3, type: null },
      ];
      const result = groupBy(items, (item) => item.type as any);
      expect(result).toEqual({
        null: [
          { id: 1, type: null },
          { id: 3, type: null },
        ],
        undefined: [{ id: 2, type: undefined }],
      });
    });

    it('should maintain immutability', () => {
      const original = [1, 2, 3];
      const result = groupBy(original, (x) => x % 2);
      original.push(4);
      expect(result).toEqual({ 0: [2], 1: [1, 3] });
    });

    it('should handle very large arrays', () => {
      const largeArray = Array.from({ length: 10000 }, (_, i) => i);
      const result = groupBy(largeArray, (x) => x % 100);
      expect(Object.keys(result).length).toBe(100);
      expect(result[0]?.length).toBe(100);
    });
  });

  describe('error cases', () => {
    it('should throw ValidationError for non-array input', () => {
      expect(() => groupBy(null as any, (x: any) => x)).toThrow(ValidationError);
      expect(() => groupBy(undefined as any, (x: any) => x)).toThrow(ValidationError);
      expect(() => groupBy('string' as any, (x: any) => x)).toThrow(ValidationError);
      expect(() => groupBy(123 as any, (x: any) => x)).toThrow(ValidationError);
      expect(() => groupBy({} as any, (x: any) => x)).toThrow(ValidationError);
    });

    it('should throw ValidationError for non-function selector', () => {
      expect(() => groupBy([1, 2, 3], null as any)).toThrow(ValidationError);
      expect(() => groupBy([1, 2, 3], undefined as any)).toThrow(ValidationError);
      expect(() => groupBy([1, 2, 3], 'string' as any)).toThrow(ValidationError);
      expect(() => groupBy([1, 2, 3], 123 as any)).toThrow(ValidationError);
      expect(() => groupBy([1, 2, 3], {} as any)).toThrow(ValidationError);
    });

    it('should throw ValidationError with meaningful message', () => {
      try {
        groupBy(null as any, (x: any) => x);
      } catch (error: any) {
        expect(error.message).toContain('array');
        expect(error.code).toBe('VALIDATION_ERROR');
      }

      try {
        groupBy([1, 2, 3], null as any);
      } catch (error: any) {
        expect(error.message).toContain('function');
        expect(error.code).toBe('VALIDATION_ERROR');
      }
    });

    it('should handle selector function throwing error', () => {
      const errorSelector = () => {
        throw new Error('Selector error');
      };
      expect(() => groupBy([1, 2, 3], errorSelector)).toThrow('Selector error');
    });
  });

  describe('performance', () => {
    it('should handle large arrays efficiently', () => {
      const largeArray = Array.from({ length: 100000 }, (_, i) => ({
        id: i,
        category: i % 100,
      }));
      const start = performance.now();
      const result = groupBy(largeArray, (item) => item.category);
      const end = performance.now();

      expect(Object.keys(result).length).toBe(100);
      expect(end - start).toBeLessThan(200); // Should complete within 200ms
    });

    it('should have O(n) time complexity', () => {
      const sizes = [1000, 10000, 100000];
      const times: number[] = [];

      for (const size of sizes) {
        const array = Array.from({ length: size }, (_, i) => i);
        const start = performance.now();
        groupBy(array, (x) => x % 10);
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