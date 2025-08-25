import { mapValues } from '../../core/object/map-values';
import { ValidationError } from '../../utils/errors';

describe('mapValues', () => {
  const testObj = {
    a: 1,
    b: 2,
    c: 3,
    d: 0,
    e: -5
  };

  it('should transform values using double mapper', () => {
    const result = mapValues(testObj, value => (value as number) * 2);
    expect(result).toEqual({
      a: 2,
      b: 4,
      c: 6,
      d: 0,
      e: -10
    });
  });

  it('should transform values using string conversion', () => {
    const result = mapValues(testObj, value => `value_${value}`);
    expect(result).toEqual({
      a: 'value_1',
      b: 'value_2',
      c: 'value_3',
      d: 'value_0',
      e: 'value_-5'
    });
  });

  it('should transform values using boolean mapper', () => {
    const result = mapValues(testObj, value => (value as number) > 1);
    expect(result).toEqual({
      a: false, // 1 > 1 is false
      b: true,  // 2 > 1 is true
      c: true,  // 3 > 1 is true
      d: false, // 0 > 1 is false
      e: false  // -5 > 1 is false
    });
  });

  it('should transform values using conditional logic', () => {
    const result = mapValues(testObj, value => 
      (value as number) > 0 ? 'positive' : (value as number) < 0 ? 'negative' : 'zero'
    );
    expect(result).toEqual({
      a: 'positive',
      b: 'positive', 
      c: 'positive',
      d: 'zero',
      e: 'negative'
    });
  });

  it('should provide key and index to mapper function', () => {
    const mapper = jest.fn((value, key, index) => `${index}_${key}_${value}`);
    const result = mapValues({ x: 10, y: 20, z: 30 }, mapper);
    
    expect(mapper).toHaveBeenCalledTimes(3);
    expect(mapper).toHaveBeenCalledWith(10, 'x', 0);
    expect(mapper).toHaveBeenCalledWith(20, 'y', 1);
    expect(mapper).toHaveBeenCalledWith(30, 'z', 2);
    
    expect(result).toEqual({
      x: '0_x_10',
      y: '1_y_20',
      z: '2_z_30'
    });
  });

  it('should handle empty object', () => {
    const result = mapValues({}, value => (value as number) * 2);
    expect(result).toEqual({});
  });

  it('should handle object with various value types', () => {
    const mixedObj = {
      num: 42,
      str: 'hello',
      bool: true,
      nil: null,
      undef: undefined,
      arr: [1, 2, 3],
      obj: { nested: true }
    };
    
    const result = mapValues(mixedObj, value => typeof value);
    expect(result).toEqual({
      num: 'number',
      str: 'string',
      bool: 'boolean',
      nil: 'object',  // typeof null is 'object'
      undef: 'undefined',
      arr: 'object',
      obj: 'object'
    });
  });

  it('should handle null and undefined values', () => {
    const obj = { a: null, b: undefined, c: 0, d: '', e: false };
    const result = mapValues(obj, value => value === null ? 'NULL' : value === undefined ? 'UNDEFINED' : value);
    expect(result).toEqual({
      a: 'NULL',
      b: 'UNDEFINED',
      c: 0,
      d: '',
      e: false
    });
  });

  it('should handle nested objects as values', () => {
    const obj = {
      user: { name: 'John', age: 30 },
      settings: { theme: 'dark', notifications: true }
    };
    
    const result = mapValues(obj, value => Object.keys(value as object).length);
    expect(result).toEqual({
      user: 2,      // { name, age }
      settings: 2   // { theme, notifications }
    });
  });

  it('should handle arrays as values', () => {
    const obj = {
      numbers: [1, 2, 3],
      strings: ['a', 'b'],
      empty: []
    };
    
    const result = mapValues(obj, value => (value as any[]).length);
    expect(result).toEqual({
      numbers: 3,
      strings: 2,
      empty: 0
    });
  });

  it('should handle complex value types', () => {
    const date = new Date('2023-01-01');
    const regex = /test/;
    const fn = () => 'test';
    const map = new Map([['key', 'value']]);
    const set = new Set([1, 2, 3]);
    
    const obj = { date, regex, fn, map, set };
    const result = mapValues(obj, value => value.constructor.name);
    
    expect(result).toEqual({
      date: 'Date',
      regex: 'RegExp',
      fn: 'Function',
      map: 'Map',
      set: 'Set'
    });
  });

  it('should handle string transformations', () => {
    const stringObj = {
      name: 'john doe',
      city: 'new york',
      country: 'usa'
    };
    
    const result = mapValues(stringObj, value => (value as string).toUpperCase());
    expect(result).toEqual({
      name: 'JOHN DOE',
      city: 'NEW YORK',
      country: 'USA'
    });
  });

  it('should maintain original object immutability', () => {
    const original = { a: 1, b: 2 };
    const result = mapValues(original, value => (value as number) * 2);
    
    expect(original).toEqual({ a: 1, b: 2 });
    expect(result).toEqual({ a: 2, b: 4 });
    expect(result).not.toBe(original);
  });

  it('should preserve all keys', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 };
    const result = mapValues(obj, value => (value as number) * 2);
    
    expect(Object.keys(result)).toEqual(Object.keys(obj));
    expect(Object.keys(result)).toHaveLength(5);
  });

  it('should work with numeric string keys', () => {
    const obj = { '0': 'zero', '1': 'one', '10': 'ten' };
    const result = mapValues(obj, value => (value as string).toUpperCase());
    expect(result).toEqual({
      '0': 'ZERO',
      '1': 'ONE',
      '10': 'TEN'
    });
  });

  it('should handle special characters in values', () => {
    const obj = {
      special: 'hello@world.com',
      unicode: '🚀',
      multiline: 'line1\nline2',
      escaped: 'quote: "test"'
    };
    
    const result = mapValues(obj, value => (value as string).length);
    expect(result).toEqual({
      special: 15,  // 'hello@world.com'.length
      unicode: 2,   // '🚀'.length (2 because it's a surrogate pair)
      multiline: 11, // 'line1\nline2'.length
      escaped: 13   // 'quote: "test"'.length
    });
  });

  it('should work with objects having symbol keys', () => {
    const sym = Symbol('test');
    const obj = { a: 1, [sym]: 'symbol value' };
    // Note: Object.entries doesn't include symbol keys, so they won't be transformed
    const result = mapValues(obj, value => (value as number) * 2);
    expect(result).toEqual({ a: 2 });
    expect(result[sym]).toBeUndefined();
  });

  it('should throw ValidationError when source is not an object', () => {
    expect(() => mapValues('string' as any, value => value)).toThrow(ValidationError);
    expect(() => mapValues(123 as any, value => value)).toThrow(ValidationError);
    expect(() => mapValues(true as any, value => value)).toThrow(ValidationError);
    expect(() => mapValues(null as any, value => value)).toThrow(ValidationError);
    expect(() => mapValues(undefined as any, value => value)).toThrow(ValidationError);
  });

  it('should throw ValidationError when mapper is not a function', () => {
    expect(() => mapValues(testObj, 'not a function' as any)).toThrow(ValidationError);
    expect(() => mapValues(testObj, 123 as any)).toThrow(ValidationError);
    expect(() => mapValues(testObj, null as any)).toThrow(ValidationError);
    expect(() => mapValues(testObj, undefined as any)).toThrow(ValidationError);
    expect(() => mapValues(testObj, {} as any)).toThrow(ValidationError);
  });

  it('should handle mapper that returns undefined', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = mapValues(obj, value => 
      (value as number) === 2 ? undefined : value
    );
    expect(result).toEqual({
      a: 1,
      b: undefined,
      c: 3
    });
  });

  it('should handle performance with large objects', () => {
    const largeObj: Record<string, number> = {};
    for (let i = 0; i < 1000; i++) {
      largeObj[`key${i}`] = i;
    }
    
    const start = performance.now();
    const result = mapValues(largeObj, value => (value as number) * 2);
    const end = performance.now();
    
    expect(Object.keys(result)).toHaveLength(1000);
    expect(result['key0']).toBe(0);
    expect(result['key500']).toBe(1000);
    expect(result['key999']).toBe(1998);
    expect(end - start).toBeLessThan(100); // Should complete in under 100ms
  });

  it('should handle mapper that throws errors', () => {
    const obj = { a: 1, b: 2 };
    const throwingMapper = (value: number) => {
      if (value === 2) throw new Error('Mapper error');
      return value * 2;
    };
    
    expect(() => mapValues(obj, throwingMapper)).toThrow('Mapper error');
  });

  it('should handle mathematical operations', () => {
    const mathObj = { pi: 3.14159, e: 2.71828, sqrt2: 1.41421 };
    const result = mapValues(mathObj, value => Math.round(value as number));
    expect(result).toEqual({
      pi: 3,
      e: 3,
      sqrt2: 1
    });
  });

  it('should preserve insertion order', () => {
    const obj = { c: 3, a: 1, b: 2 };
    const result = mapValues(obj, value => (value as number) * 10);
    const keys = Object.keys(result);
    
    // Should maintain the same order as original
    expect(keys).toEqual(['c', 'a', 'b']);
    expect(result).toEqual({ c: 30, a: 10, b: 20 });
  });

  it('should work with date operations', () => {
    const dateObj = {
      created: new Date('2023-01-01'),
      modified: new Date('2023-06-15'),
      accessed: new Date('2023-12-31')
    };
    
    const result = mapValues(dateObj, date => (date as Date).getFullYear());
    expect(result).toEqual({
      created: 2023,
      modified: 2023,
      accessed: 2023
    });
  });

  it('should handle nested transformations', () => {
    const nestedObj = {
      user: { name: 'John', scores: [85, 90, 78] },
      team: { name: 'Alpha', scores: [92, 88, 95] }
    };
    
    const result = mapValues(nestedObj, value => {
      const obj = value as { name: string; scores: number[] };
      return {
        ...obj,
        averageScore: obj.scores.reduce((sum, score) => sum + score, 0) / obj.scores.length
      };
    });
    
    expect(result.user.averageScore).toBeCloseTo(84.33, 2);
    expect(result.team.averageScore).toBeCloseTo(91.67, 2);
  });

  it('should work with prototype chain properties', () => {
    function Parent(this: any) {
      this.parentProp = 10;
    }
    Parent.prototype.prototypeProp = 20;
    
    function Child(this: any) {
      Parent.call(this);
      this.childProp = 30;
    }
    Child.prototype = Object.create(Parent.prototype);
    
    const instance = new (Child as any)();
    const result = mapValues(instance, value => (value as number) * 2);
    
    // Should only transform own enumerable properties
    expect(result).toEqual({
      parentProp: 20,
      childProp: 60
    });
    expect(result['prototypeProp']).toBeUndefined();
  });
});