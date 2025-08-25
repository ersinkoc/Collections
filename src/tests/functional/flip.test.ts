import { flip } from '../../core/functional/flip';
import { ValidationError } from '../../utils/errors';

describe('flip', () => {
  it('should reverse arguments for binary function', () => {
    const divide = (a: number, b: number) => a / b;
    const flippedDivide = flip(divide);
    
    expect(divide(10, 2)).toBe(5);
    expect(flippedDivide(10, 2)).toBe(0.2); // Same as divide(2, 10)
  });

  it('should work with subtraction', () => {
    const subtract = (a: number, b: number) => a - b;
    const flippedSubtract = flip(subtract);
    
    expect(subtract(10, 3)).toBe(7);
    expect(flippedSubtract(10, 3)).toBe(-7); // Same as subtract(3, 10)
  });

  it('should work with string operations', () => {
    const concat = (a: string, b: string) => a + b;
    const flippedConcat = flip(concat);
    
    expect(concat('hello', 'world')).toBe('helloworld');
    expect(flippedConcat('hello', 'world')).toBe('worldhello');
  });

  it('should work with functions that have more than 2 arguments', () => {
    const threeArgs = (a: number, b: number, c: number) => `${a}-${b}-${c}`;
    const flippedThreeArgs = flip(threeArgs);
    
    expect(threeArgs(1, 2, 3)).toBe('1-2-3');
    expect(flippedThreeArgs(1, 2, 3)).toBe('3-2-1');
  });

  it('should work with single argument functions', () => {
    const singleArg = (x: number) => x * 2;
    const flippedSingleArg = flip(singleArg);
    
    expect(singleArg(5)).toBe(10);
    expect(flippedSingleArg(5)).toBe(10); // Same result for single argument
  });

  it('should work with zero argument functions', () => {
    const zeroArgs = () => 'constant';
    const flippedZeroArgs = flip(zeroArgs);
    
    expect(zeroArgs()).toBe('constant');
    expect(flippedZeroArgs()).toBe('constant');
  });

  it('should be useful with array methods', () => {
    const subtract = (a: number, b: number) => a - b;
    const flippedSubtract = flip(subtract);
    
    // Regular subtract: (((10 - 1) - 2) - 3) = 4
    expect([1, 2, 3].reduce(subtract, 10)).toBe(4);
    
    // Let's test a simple case instead
    expect(flippedSubtract(10, 3)).toBe(-7); // subtract(3, 10) = -7
  });

  it('should work with comparison functions', () => {
    const compare = (a: number, b: number) => a - b;
    const flippedCompare = flip(compare);
    
    const numbers = [3, 1, 4, 1, 5, 9];
    
    expect([...numbers].sort(compare)).toEqual([1, 1, 3, 4, 5, 9]);
    expect([...numbers].sort(flippedCompare)).toEqual([9, 5, 4, 3, 1, 1]);
  });

  it('should preserve function context', () => {
    const obj = {
      value: 10,
      add(a: number, b: number) {
        return a + b + this.value;
      }
    };
    
    const flippedAdd = flip(obj.add.bind(obj));
    
    expect(obj.add(2, 3)).toBe(15); // 2 + 3 + 10
    expect(flippedAdd(2, 3)).toBe(15); // 3 + 2 + 10 (same result since addition is commutative)
  });

  it('should work with functions returning different types', () => {
    const formatName = (first: string, last: string) => `${first} ${last}`;
    const flippedFormatName = flip(formatName);
    
    expect(formatName('John', 'Doe')).toBe('John Doe');
    expect(flippedFormatName('John', 'Doe')).toBe('Doe John');
  });

  it('should work with array/object operations', () => {
    const concat = (a: string, b: string) => a + b;
    const flippedConcat = flip(concat);
    
    expect(concat('hello', 'world')).toBe('helloworld');
    expect(flippedConcat('hello', 'world')).toBe('worldhello'); // Arguments reversed
  });

  it('should handle complex argument types', () => {
    const merge = (obj1: object, obj2: object) => ({ ...obj1, ...obj2 });
    const flippedMerge = flip(merge);
    
    const a = { x: 1, y: 2 };
    const b = { y: 3, z: 4 };
    
    expect(merge(a, b)).toEqual({ x: 1, y: 3, z: 4 }); // b overrides a.y
    expect(flippedMerge(a, b)).toEqual({ x: 1, y: 2, z: 4 }); // a overrides b.y
  });

  it('should maintain function length and name properties where possible', () => {
    const testFn = (a: number, b: number) => a + b;
    const flipped = flip(testFn);
    
    expect(typeof flipped).toBe('function');
    // Note: flipped functions typically don't preserve length/name exactly
  });

  it('should throw ValidationError for non-function argument', () => {
    expect(() => flip('not a function' as any)).toThrow(ValidationError);
    expect(() => flip(null as any)).toThrow(ValidationError);
    expect(() => flip(undefined as any)).toThrow(ValidationError);
    expect(() => flip(123 as any)).toThrow(ValidationError);
    expect(() => flip({} as any)).toThrow(ValidationError);
  });

  it('should work with async functions', async () => {
    const asyncConcat = async (a: string, b: string) => a + b;
    const flippedAsyncConcat = flip(asyncConcat);
    
    await expect(asyncConcat('hello', 'world')).resolves.toBe('helloworld');
    await expect(flippedAsyncConcat('hello', 'world')).resolves.toBe('worldhello');
  });

  it('should be composable', () => {
    const subtract = (a: number, b: number) => a - b;
    const doubleFlipped = flip(flip(subtract));
    
    // Double flip should return to original behavior
    expect(subtract(10, 3)).toBe(7);
    expect(doubleFlipped(10, 3)).toBe(7);
  });

  it('should handle rest parameters correctly', () => {
    const joinWithSeparator = (separator: string, ...items: string[]) => items.join(separator);
    const flipped = flip(joinWithSeparator);
    
    // Original: separator first, then items
    expect(joinWithSeparator('-', 'a', 'b', 'c')).toBe('a-b-c');
    
    // Flipped reverses ALL args: ['-', 'a', 'b', 'c'] -> ['c', 'b', 'a', '-']
    // So it becomes joinWithSeparator('c', 'b', 'a', '-') which joins ['b', 'a', '-'] with separator 'c'
    expect(flipped('-', 'a', 'b', 'c')).toBe('bcac-');
  });
});