import { sumOf } from '../../core/array/sum-of';
import { ValidationError } from '../../utils/errors';

describe('sumOf', () => {
  // Normal cases
  it('should sum array elements using selector function', () => {
    const items = [
      { name: 'Apple', price: 1.5 },
      { name: 'Banana', price: 0.8 },
      { name: 'Orange', price: 1.2 }
    ];
    expect(sumOf(items, item => item.price)).toBe(3.5);
  });

  it('should sum numeric array using identity selector', () => {
    expect(sumOf([1, 2, 3, 4, 5], x => x)).toBe(15);
    expect(sumOf([10, 20, 30], x => x)).toBe(60);
  });

  it('should sum based on object properties', () => {
    const people = [
      { name: 'John', age: 25, salary: 50000 },
      { name: 'Jane', age: 30, salary: 60000 },
      { name: 'Bob', age: 35, salary: 70000 }
    ];
    
    expect(sumOf(people, person => person.age)).toBe(90);
    expect(sumOf(people, person => person.salary)).toBe(180000);
  });

  it('should sum using computed values', () => {
    const numbers = [1, 2, 3, 4, 5];
    expect(sumOf(numbers, x => x * x)).toBe(55); // Sum of squares: 1 + 4 + 9 + 16 + 25
    expect(sumOf(numbers, x => x * 2)).toBe(30); // Sum of doubles: 2 + 4 + 6 + 8 + 10
  });

  it('should work with string arrays using length selector', () => {
    const words = ['hello', 'world', 'test', 'array'];
    expect(sumOf(words, word => word.length)).toBe(19); // 5 + 5 + 4 + 5 = 19
  });

  it('should sum boolean values as numbers', () => {
    const items = [
      { active: true, value: 10 },
      { active: false, value: 20 },
      { active: true, value: 30 },
      { active: false, value: 40 }
    ];
    expect(sumOf(items, item => item.active ? 1 : 0)).toBe(2); // Count of true values
    expect(sumOf(items, item => item.value)).toBe(100);
  });

  it('should work with nested object properties', () => {
    const data = [
      { user: { profile: { score: 100 } } },
      { user: { profile: { score: 200 } } },
      { user: { profile: { score: 300 } } }
    ];
    expect(sumOf(data, item => item.user.profile.score)).toBe(600);
  });

  it('should provide correct parameters to selector function', () => {
    const items = [10, 20, 30];
    const mockSelector = jest.fn((value, index, _array) => value * index);
    
    const result = sumOf(items, mockSelector);
    
    expect(mockSelector).toHaveBeenCalledTimes(3);
    expect(mockSelector).toHaveBeenNthCalledWith(1, 10, 0, items);
    expect(mockSelector).toHaveBeenNthCalledWith(2, 20, 1, items);
    expect(mockSelector).toHaveBeenNthCalledWith(3, 30, 2, items);
    expect(result).toBe(80); // 10*0 + 20*1 + 30*2 = 0 + 20 + 60 = 80
  });

  // Edge cases
  it('should handle empty array', () => {
    expect(sumOf([], x => x)).toBe(0);
    expect(sumOf([], () => 10)).toBe(0);
  });

  it('should handle single element array', () => {
    expect(sumOf([5], x => x)).toBe(5);
    expect(sumOf([{ value: 42 }], item => item.value)).toBe(42);
  });

  it('should handle arrays with zero values', () => {
    const items = [0, 1, 0, 2, 0, 3];
    expect(sumOf(items, x => x)).toBe(6);
  });

  it('should handle negative values', () => {
    const numbers = [-5, -10, 15, 20];
    expect(sumOf(numbers, x => x)).toBe(20); // -5 + (-10) + 15 + 20 = 20
  });

  it('should handle floating point numbers', () => {
    const decimals = [1.1, 2.2, 3.3];
    expect(sumOf(decimals, x => x)).toBeCloseTo(6.6);
  });

  it('should handle very small decimal values', () => {
    const tiny = [0.1, 0.2, 0.3];
    expect(sumOf(tiny, x => x)).toBeCloseTo(0.6);
  });

  it('should handle arrays with null values in selector', () => {
    const items = [
      { value: 10 },
      { value: null },
      { value: 20 },
      { value: undefined }
    ];
    expect(sumOf(items, item => item.value || 0)).toBe(30);
  });

  it('should handle mixed positive and negative results from selector', () => {
    const items = [1, 2, 3, 4, 5];
    expect(sumOf(items, (x, index) => index % 2 === 0 ? x : -x)).toBe(3); // 1 - 2 + 3 - 4 + 5 = 3
  });

  it('should work with arrays containing duplicate values', () => {
    const duplicates = [5, 5, 10, 10, 15];
    expect(sumOf(duplicates, x => x)).toBe(45);
  });

  // Boundary testing
  it('should handle very large numbers', () => {
    const bigNumbers = [Number.MAX_SAFE_INTEGER / 4, Number.MAX_SAFE_INTEGER / 4, Number.MAX_SAFE_INTEGER / 4, Number.MAX_SAFE_INTEGER / 4];
    const result = sumOf(bigNumbers, x => x);
    expect(result).toBeCloseTo(Number.MAX_SAFE_INTEGER, 1);
  });

  it('should handle very small numbers', () => {
    const smallNumbers = [Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE];
    expect(sumOf(smallNumbers, x => x)).toBeGreaterThan(0);
  });

  it('should handle infinity values', () => {
    const withInfinity = [1, 2, Infinity];
    expect(sumOf(withInfinity, x => x)).toBe(Infinity);
  });

  it('should handle negative infinity', () => {
    const withNegativeInfinity = [1, 2, -Infinity];
    expect(sumOf(withNegativeInfinity, x => x)).toBe(-Infinity);
  });

  it('should handle NaN values', () => {
    const withNaN = [1, 2, NaN];
    expect(sumOf(withNaN, x => x)).toBeNaN();
  });

  it('should work with date objects', () => {
    const dates = [
      new Date('2023-01-01'),
      new Date('2023-06-15'),
      new Date('2023-12-31')
    ];
    expect(sumOf(dates, date => date.getFullYear())).toBe(6069); // 2023 * 3
  });

  // Error cases
  it('should throw ValidationError for non-array input', () => {
    expect(() => sumOf('not array' as any, (x: any) => x)).toThrow(ValidationError);
    expect(() => sumOf(null as any, (x: any) => x)).toThrow(ValidationError);
    expect(() => sumOf(undefined as any, (x: any) => x)).toThrow(ValidationError);
    expect(() => sumOf(42 as any, (x: any) => x)).toThrow(ValidationError);
    expect(() => sumOf({} as any, (x: any) => x)).toThrow(ValidationError);
  });

  it('should throw ValidationError for non-function selector', () => {
    expect(() => sumOf([1, 2, 3], 'not function' as any)).toThrow(ValidationError);
    expect(() => sumOf([1, 2, 3], null as any)).toThrow(ValidationError);
    expect(() => sumOf([1, 2, 3], undefined as any)).toThrow(ValidationError);
    expect(() => sumOf([1, 2, 3], 42 as any)).toThrow(ValidationError);
    expect(() => sumOf([1, 2, 3], {} as any)).toThrow(ValidationError);
  });

  // Performance tests
  it('should handle large arrays efficiently', () => {
    const largeArray = Array.from({ length: 100000 }, (_, i) => ({ value: i }));
    
    const start = performance.now();
    const result = sumOf(largeArray, item => item.value);
    const end = performance.now();
    
    expect(result).toBe(4999950000); // Sum of 0 to 99999
    expect(end - start).toBeLessThan(50); // Should complete quickly
  });

  it('should be efficient with complex selectors', () => {
    const array = Array.from({ length: 10000 }, (_, i) => ({ 
      id: i, 
      nested: { value: i * 2 },
      tags: [i, i + 1, i + 2]
    }));
    
    const start = performance.now();
    const result = sumOf(array, item => item.nested.value + item.tags.length);
    const end = performance.now();
    
    expect(result).toBe(99990000 + 30000); // Sum of (i * 2 + 3) for i from 0 to 9999
    expect(end - start).toBeLessThan(100);
  });

  it('should maintain precision with many small additions', () => {
    const array = Array.from({ length: 1000 }, () => 0.01);
    
    const result = sumOf(array, x => x);
    
    expect(result).toBeCloseTo(10, 2); // Should be close to 10.00
  });

  // Complex scenarios
  it('should work with functions as array elements', () => {
    const functions = [
      () => 10,
      () => 20,
      () => 30
    ];
    
    expect(sumOf(functions, fn => fn())).toBe(60);
  });

  it('should work with mixed data types using appropriate selector', () => {
    const mixed = [1, '2', true, { value: 4 }, [5]];
    expect(sumOf(mixed, (item, _index) => {
      if (typeof item === 'number') return item;
      if (typeof item === 'string') return parseInt(item);
      if (typeof item === 'boolean') return item ? 1 : 0;
      if (typeof item === 'object' && item !== null && !Array.isArray(item)) return (item as any).value || 0;
      if (Array.isArray(item)) return item[0] || 0;
      return 0;
    })).toBe(13); // 1 + 2 + 1 + 4 + 5 = 13
  });

  it('should handle array-like objects correctly when converted to arrays', () => {
    const arrayLike = { 0: { val: 10 }, 1: { val: 20 }, 2: { val: 30 }, length: 3 };
    const realArray = Array.from(arrayLike as any);
    expect(sumOf(realArray, (item: any) => item.val)).toBe(60);
  });

  it('should work with sparse arrays', () => {
    const sparse = [1, , 3, , 5]; // Array with holes
    const result = sumOf(sparse, x => x || 0);
    expect(result).toBe(9); // 1 + 0 + 3 + 0 + 5 = 9
  });

  it('should handle selector that returns strings convertible to numbers', () => {
    const items = [
      { strValue: '10' },
      { strValue: '20.5' },
      { strValue: '30' }
    ];
    expect(sumOf(items, item => parseFloat(item.strValue))).toBe(60.5);
  });

  it('should sum conditional values based on index', () => {
    const numbers = [10, 20, 30, 40, 50];
    // Sum only even-indexed elements
    expect(sumOf(numbers, (value, index) => index % 2 === 0 ? value : 0)).toBe(90); // 10 + 0 + 30 + 0 + 50
  });

  it('should work with recursive data structures', () => {
    interface TreeNode {
      value: number;
      children?: TreeNode[];
    }
    
    const nodes: TreeNode[] = [
      { value: 1, children: [{ value: 2 }, { value: 3 }] },
      { value: 4, children: [{ value: 5 }] },
      { value: 6 }
    ];
    
    const getNodeSum = (node: TreeNode): number => {
      let sum = node.value;
      if (node.children) {
        sum += node.children.reduce((acc, child) => acc + getNodeSum(child), 0);
      }
      return sum;
    };
    
    expect(sumOf(nodes, getNodeSum)).toBe(21); // 1+2+3+4+5+6 = 21
  });
});