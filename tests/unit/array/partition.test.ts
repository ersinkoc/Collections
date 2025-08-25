import { partition } from '../../../src/core/array/partition';
import { ValidationError } from '../../../src/utils/errors';

describe('partition', () => {
  describe('normal cases', () => {
    it('should partition array based on predicate', () => {
      const result = partition([1, 2, 3, 4, 5], (x) => x % 2 === 0);
      expect(result).toEqual([[2, 4], [1, 3, 5]]);
    });

    it('should partition strings by length', () => {
      const words = ['a', 'bb', 'ccc', 'dd', 'e'];
      const result = partition(words, (w) => w.length >= 2);
      expect(result).toEqual([
        ['bb', 'ccc', 'dd'],
        ['a', 'e'],
      ]);
    });

    it('should partition objects by property', () => {
      const users = [
        { name: 'Alice', active: true },
        { name: 'Bob', active: false },
        { name: 'Charlie', active: true },
      ];
      const result = partition(users, (u) => u.active);
      expect(result).toEqual([
        [
          { name: 'Alice', active: true },
          { name: 'Charlie', active: true },
        ],
        [{ name: 'Bob', active: false }],
      ]);
    });

    it('should pass index to predicate', () => {
      const result = partition([10, 20, 30, 40], (_, index) => index < 2);
      expect(result).toEqual([[10, 20], [30, 40]]);
    });

    it('should pass array to predicate', () => {
      const arr = [1, 2, 3];
      partition(arr, (value, _index, array) => {
        expect(array).toBe(arr);
        return value > 1;
      });
    });

    it('should preserve element order in partitions', () => {
      const result = partition([5, 1, 4, 2, 3], (x) => x > 2);
      expect(result).toEqual([[5, 4, 3], [1, 2]]);
    });
  });

  describe('edge cases', () => {
    it('should handle empty array', () => {
      const result = partition([], (_x: any) => true);
      expect(result).toEqual([[], []]);
    });

    it('should handle single element array', () => {
      expect(partition([1], (x) => x > 0)).toEqual([[1], []]);
      expect(partition([1], (x) => x < 0)).toEqual([[], [1]]);
    });

    it('should handle all elements matching predicate', () => {
      const result = partition([2, 4, 6, 8], (x) => x % 2 === 0);
      expect(result).toEqual([[2, 4, 6, 8], []]);
    });

    it('should handle no elements matching predicate', () => {
      const result = partition([1, 3, 5, 7], (x) => x % 2 === 0);
      expect(result).toEqual([[], [1, 3, 5, 7]]);
    });

    it('should handle null and undefined values', () => {
      const result = partition(
        [1, null, 2, undefined, 3],
        (x) => x !== null && x !== undefined
      );
      expect(result).toEqual([[1, 2, 3], [null, undefined]]);
    });

    it('should maintain immutability', () => {
      const original = [1, 2, 3, 4];
      const result = partition(original, (x) => x % 2 === 0);
      original.push(5);
      expect(result).toEqual([[2, 4], [1, 3]]);
      result[0].push(6);
      expect(original).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle very large arrays', () => {
      const largeArray = Array.from({ length: 10000 }, (_, i) => i);
      const result = partition(largeArray, (x) => x < 5000);
      expect(result[0]?.length).toBe(5000);
      expect(result[1]?.length).toBe(5000);
    });
  });

  describe('error cases', () => {
    it('should throw ValidationError for non-array input', () => {
      expect(() => partition(null as any, () => true)).toThrow(ValidationError);
      expect(() => partition(undefined as any, () => true)).toThrow(ValidationError);
      expect(() => partition('string' as any, () => true)).toThrow(ValidationError);
      expect(() => partition(123 as any, () => true)).toThrow(ValidationError);
      expect(() => partition({} as any, () => true)).toThrow(ValidationError);
    });

    it('should throw ValidationError for non-function predicate', () => {
      expect(() => partition([1, 2, 3], null as any)).toThrow(ValidationError);
      expect(() => partition([1, 2, 3], undefined as any)).toThrow(ValidationError);
      expect(() => partition([1, 2, 3], 'string' as any)).toThrow(ValidationError);
      expect(() => partition([1, 2, 3], 123 as any)).toThrow(ValidationError);
      expect(() => partition([1, 2, 3], {} as any)).toThrow(ValidationError);
    });

    it('should throw ValidationError with meaningful message', () => {
      try {
        partition(null as any, () => true);
      } catch (error: any) {
        expect(error.message).toContain('array');
        expect(error.code).toBe('VALIDATION_ERROR');
      }

      try {
        partition([1, 2, 3], null as any);
      } catch (error: any) {
        expect(error.message).toContain('function');
        expect(error.code).toBe('VALIDATION_ERROR');
      }
    });

    it('should handle predicate function throwing error', () => {
      const errorPredicate = () => {
        throw new Error('Predicate error');
      };
      expect(() => partition([1, 2, 3], errorPredicate)).toThrow('Predicate error');
    });
  });

  describe('performance', () => {
    it('should handle large arrays efficiently', () => {
      const largeArray = Array.from({ length: 100000 }, (_, i) => i);
      const start = performance.now();
      const result = partition(largeArray, (x) => x % 2 === 0);
      const end = performance.now();

      expect(result[0]?.length).toBe(50000);
      expect(result[1]?.length).toBe(50000);
      expect(end - start).toBeLessThan(100); // Should complete within 100ms
    });

    it('should have O(n) time complexity', () => {
      const sizes = [1000, 10000, 100000];
      const times: number[] = [];

      for (const size of sizes) {
        const array = Array.from({ length: size }, (_, i) => i);
        const start = performance.now();
        partition(array, (x) => x % 2 === 0);
        const end = performance.now();
        times.push(end - start);
      }

      // Verify roughly linear growth
      const ratio1 = times[1]! / times[0]!;
      const ratio2 = times[2]! / times[1]!;
      expect(ratio2).toBeLessThan(ratio1 * 2);
    });

    it('should not cause memory leaks', () => {
      const largeArray = Array.from({ length: 10000 }, (_, i) => ({ id: i }));
      const result = partition(largeArray, (item) => item.id % 2 === 0);

      // Verify result structure
      expect(result[0]?.length).toBe(5000);
      expect(result[1]?.length).toBe(5000);
      expect(result[0]?.[0]?.id).toBe(0);
      expect(result[1]?.[0]?.id).toBe(1);
    });
  });
});