import { mapKeys } from '../../core/object/map-keys';
import { ValidationError } from '../../utils/errors';

describe('mapKeys', () => {
  const testObj = {
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
    city: 'New York'
  };

  it('should transform keys using uppercase mapper', () => {
    const result = mapKeys(testObj, key => key.toUpperCase());
    expect(result).toEqual({
      FIRSTNAME: 'John',
      LASTNAME: 'Doe',
      AGE: 30,
      CITY: 'New York'
    });
  });

  it('should transform keys using custom prefixes', () => {
    const result = mapKeys(testObj, key => `prefix_${key}`);
    expect(result).toEqual({
      prefix_firstName: 'John',
      prefix_lastName: 'Doe',
      prefix_age: 30,
      prefix_city: 'New York'
    });
  });

  it('should transform keys using camelCase to snake_case', () => {
    const result = mapKeys(testObj, key => 
      key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
    );
    expect(result).toEqual({
      first_name: 'John',
      last_name: 'Doe',
      age: 30,
      city: 'New York'
    });
  });

  it('should transform keys using key length', () => {
    const result = mapKeys(testObj, key => `key${key.length}`);
    expect(result).toEqual({
      key9: 'John',    // firstName = 9 chars
      key8: 'Doe',     // lastName = 8 chars
      key3: 30,        // age = 3 chars
      key4: 'New York' // city = 4 chars
    });
  });

  it('should provide value and index to mapper function', () => {
    const mapper = jest.fn((key, value, index) => `${index}_${key}_${value}`);
    const result = mapKeys({ a: 1, b: 2, c: 3 }, mapper);
    
    expect(mapper).toHaveBeenCalledTimes(3);
    expect(mapper).toHaveBeenCalledWith('a', 1, 0);
    expect(mapper).toHaveBeenCalledWith('b', 2, 1);
    expect(mapper).toHaveBeenCalledWith('c', 3, 2);
    
    expect(result).toEqual({
      '0_a_1': 1,
      '1_b_2': 2,
      '2_c_3': 3
    });
  });

  it('should handle empty object', () => {
    const result = mapKeys({}, key => key.toUpperCase());
    expect(result).toEqual({});
  });

  it('should handle object with null and undefined values', () => {
    const obj = { a: null, b: undefined, c: 0, d: '', e: false };
    const result = mapKeys(obj, key => key.toUpperCase());
    expect(result).toEqual({
      A: null,
      B: undefined,
      C: 0,
      D: '',
      E: false
    });
  });

  it('should handle nested objects as values', () => {
    const obj = {
      user: { name: 'John', age: 30 },
      settings: { theme: 'dark' }
    };
    const result = mapKeys(obj, key => key.toUpperCase());
    expect(result).toEqual({
      USER: { name: 'John', age: 30 },
      SETTINGS: { theme: 'dark' }
    });
  });

  it('should handle arrays as values', () => {
    const obj = {
      numbers: [1, 2, 3],
      strings: ['a', 'b', 'c']
    };
    const result = mapKeys(obj, key => key.toUpperCase());
    expect(result).toEqual({
      NUMBERS: [1, 2, 3],
      STRINGS: ['a', 'b', 'c']
    });
  });

  it('should handle complex value types', () => {
    const date = new Date('2023-01-01');
    const regex = /test/;
    const fn = () => 'test';
    const obj = { date, regex, fn };
    
    const result = mapKeys(obj, key => key.toUpperCase());
    expect(result).toEqual({
      DATE: date,
      REGEX: regex,
      FN: fn
    });
  });

  it('should handle key collisions by overwriting', () => {
    const obj = { a: 1, A: 2, b: 3 };
    const result = mapKeys(obj, key => key.toUpperCase());
    
    // The behavior depends on iteration order, but one should overwrite the other
    expect(result['A']).toBeDefined();
    expect(result['B']).toBe(3);
    expect(Object.keys(result)).toHaveLength(2);
  });

  it('should handle numeric string keys', () => {
    const obj = { '0': 'zero', '1': 'one', '2': 'two' };
    const result = mapKeys(obj, key => `key_${key}`);
    expect(result).toEqual({
      key_0: 'zero',
      key_1: 'one',
      key_2: 'two'
    });
  });

  it('should handle special characters in keys', () => {
    const obj = { 'key-1': 1, 'key.2': 2, 'key@3': 3, 'key space': 4 };
    const result = mapKeys(obj, key => key.replace(/[^a-zA-Z0-9]/g, '_'));
    expect(result).toEqual({
      key_1: 1,
      key_2: 2,
      key_3: 3,
      key_space: 4
    });
  });

  it('should maintain original object immutability', () => {
    const original = { a: 1, b: 2 };
    const result = mapKeys(original, key => key.toUpperCase());
    
    expect(original).toEqual({ a: 1, b: 2 });
    expect(result).toEqual({ A: 1, B: 2 });
    expect(result).not.toBe(original);
  });

  it('should work with objects having symbol keys', () => {
    const sym = Symbol('test');
    const obj = { a: 1, [sym]: 'symbol value' };
    // Note: Object.entries doesn't include symbol keys, so they won't be transformed
    const result = mapKeys(obj, key => key.toUpperCase());
    expect(result).toEqual({ A: 1 });
    expect((result as any)[sym]).toBeUndefined();
  });

  it('should throw ValidationError when source is not an object', () => {
    expect(() => mapKeys('string' as any, key => key)).toThrow(ValidationError);
    expect(() => mapKeys(123 as any, key => key)).toThrow(ValidationError);
    expect(() => mapKeys(true as any, key => key)).toThrow(ValidationError);
    expect(() => mapKeys(null as any, key => key)).toThrow(ValidationError);
    expect(() => mapKeys(undefined as any, key => key)).toThrow(ValidationError);
  });

  it('should throw ValidationError when mapper is not a function', () => {
    expect(() => mapKeys(testObj, 'not a function' as any)).toThrow(ValidationError);
    expect(() => mapKeys(testObj, 123 as any)).toThrow(ValidationError);
    expect(() => mapKeys(testObj, null as any)).toThrow(ValidationError);
    expect(() => mapKeys(testObj, undefined as any)).toThrow(ValidationError);
    expect(() => mapKeys(testObj, {} as any)).toThrow(ValidationError);
  });

  it('should handle mapper function that returns various types', () => {
    const obj = { a: 1, b: 2, c: 3 };
    
    // Numbers as keys (converted to strings)
    const numResult = mapKeys(obj, (_, value) => String(value * 10));
    expect(numResult).toEqual({
      '10': 1,
      '20': 2,
      '30': 3
    });
    
    // Booleans as keys (converted to strings)
    const boolResult = mapKeys(obj, (_, value) => String(value > 1));
    expect(boolResult).toEqual({
      'false': 1,
      'true': 3  // Last one wins in case of collision
    });
  });

  it('should handle performance with large objects', () => {
    const largeObj: Record<string, number> = {};
    for (let i = 0; i < 1000; i++) {
      largeObj[`key${i}`] = i;
    }
    
    const start = performance.now();
    const result = mapKeys(largeObj, key => key.toUpperCase());
    const end = performance.now();
    
    expect(Object.keys(result)).toHaveLength(1000);
    expect(result['KEY0']).toBe(0);
    expect(result['KEY999']).toBe(999);
    expect(end - start).toBeLessThan(100); // Should complete in under 100ms
  });

  it('should handle mapper that throws errors', () => {
    const obj = { a: 1, b: 2 };
    const throwingMapper = (key: string) => {
      if (key === 'b') throw new Error('Mapper error');
      return key.toUpperCase();
    };
    
    expect(() => mapKeys(obj, throwingMapper)).toThrow('Mapper error');
  });

  it('should handle edge case with empty string keys', () => {
    const obj = { '': 'empty', a: 'normal' };
    const result = mapKeys(obj, key => key || 'empty_key');
    expect(result).toEqual({
      empty_key: 'empty',
      a: 'normal'
    });
  });

  it('should preserve insertion order', () => {
    const obj = { c: 3, a: 1, b: 2 };
    const result = mapKeys(obj, key => key.toUpperCase());
    const keys = Object.keys(result);
    
    // Should maintain the same order as original
    expect(keys).toEqual(['C', 'A', 'B']);
  });

  it('should work with prototype chain properties', () => {
    function Parent(this: any) {
      this.parentProp = 'parent';
    }
    Parent.prototype.prototypeProp = 'prototype';
    
    function Child(this: any) {
      Parent.call(this);
      this.childProp = 'child';
    }
    Child.prototype = Object.create(Parent.prototype);
    
    const instance = new (Child as any)();
    const result = mapKeys(instance, key => key.toUpperCase());
    
    // Should only transform own enumerable properties
    expect(result).toEqual({
      PARENTPROP: 'parent',
      CHILDPROP: 'child'
    });
    expect(result['PROTOTYPEPROP']).toBeUndefined();
  });
});