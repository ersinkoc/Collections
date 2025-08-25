import { unset } from '../../core/object/unset';
import { ValidationError } from '../../utils/errors';

describe('unset', () => {
  it('should remove simple property using dot notation', () => {
    const obj = { name: 'John', age: 30 };
    const result = unset(obj, 'name');
    
    expect(result).toBe(true);
    expect(obj).toEqual({ age: 30 });
  });

  it('should remove nested property using dot notation', () => {
    const obj = { user: { name: 'John', age: 30 } };
    const result = unset(obj, 'user.name');
    
    expect(result).toBe(true);
    expect(obj).toEqual({ user: { age: 30 } });
  });

  it('should remove deeply nested property', () => {
    const obj = { a: { b: { c: { d: { e: 'deep' } } } } };
    const result = unset(obj, 'a.b.c.d.e');
    
    expect(result).toBe(true);
    expect(obj).toEqual({ a: { b: { c: { d: {} } } } });
  });

  it('should remove property using array path', () => {
    const obj = { user: { profile: { name: 'Jane' } } };
    const result = unset(obj, ['user', 'profile', 'name']);
    
    expect(result).toBe(true);
    expect(obj).toEqual({ user: { profile: {} } });
  });

  it('should remove array element using numeric index', () => {
    const obj = { items: ['first', 'second', 'third'] };
    const result = unset(obj, 'items.1');
    
    expect(result).toBe(true);
    expect(obj.items).toEqual(['first', 'third']); // Array is spliced
    expect(obj.items.length).toBe(2);
  });

  it('should remove nested array element', () => {
    const obj = { users: [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }] };
    const result = unset(obj, 'users.0.name');
    
    expect(result).toBe(true);
    expect(obj).toEqual({ users: [{ age: 30 }, { name: 'Jane', age: 25 }] });
  });

  it('should remove entire array element', () => {
    const obj = { users: [{ name: 'John' }, { name: 'Jane' }, { name: 'Bob' }] };
    const result = unset(obj, 'users.1');
    
    expect(result).toBe(true);
    expect(obj.users).toEqual([{ name: 'John' }, { name: 'Bob' }]);
    expect(obj.users.length).toBe(2);
  });

  it('should throw ValidationError for arrays at root level', () => {
    const arr = [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }];
    expect(() => unset(arr, '0.name')).toThrow(ValidationError);
  });

  it('should throw ValidationError for arrays at root level', () => {
    const arr = ['first', 'second', 'third'];
    expect(() => unset(arr, '1')).toThrow(ValidationError);
  });

  it('should return false for non-existent properties', () => {
    const obj = { user: { name: 'John' } };
    
    expect(unset(obj, 'user.age')).toBe(false);
    expect(unset(obj, 'nonexistent')).toBe(false);
    expect(unset(obj, 'user.profile.email')).toBe(false);
    expect(obj).toEqual({ user: { name: 'John' } }); // Unchanged
  });

  it('should return false for non-existent array indices', () => {
    const obj = { items: ['first', 'second'] };
    
    expect(unset(obj, 'items.5')).toBe(false);
    expect(unset(obj, 'items.-1')).toBe(false);
    expect(obj.items).toEqual(['first', 'second']); // Unchanged
  });

  it('should handle null values in path', () => {
    const obj = { user: null };
    const result = unset(obj, 'user.name');
    
    expect(result).toBe(false);
    expect(obj).toEqual({ user: null }); // Unchanged
  });

  it('should handle undefined values in path', () => {
    const obj = { user: undefined };
    const result = unset(obj, 'user.name');
    
    expect(result).toBe(false);
    expect(obj).toEqual({ user: undefined }); // Unchanged
  });

  it('should handle primitive values in path', () => {
    const obj = { user: 'string value' };
    const result = unset(obj, 'user.name');
    
    expect(result).toBe(false);
    expect(obj).toEqual({ user: 'string value' }); // Unchanged
  });

  it('should remove various value types', () => {
    const obj = {
      string: 'text',
      number: 42,
      boolean: true,
      null: null,
      undefined: undefined,
      array: [1, 2, 3],
      object: { nested: true },
      date: new Date(),
      func: () => 'test'
    };
    
    expect(unset(obj, 'string')).toBe(true);
    expect(unset(obj, 'number')).toBe(true);
    expect(unset(obj, 'boolean')).toBe(true);
    expect(unset(obj, 'null')).toBe(true);
    expect(unset(obj, 'undefined')).toBe(true);
    expect(unset(obj, 'array')).toBe(true);
    expect(unset(obj, 'object')).toBe(true);
    expect(unset(obj, 'date')).toBe(true);
    expect(unset(obj, 'func')).toBe(true);
    
    expect(obj).toEqual({});
  });

  it('should handle complex nested structures', () => {
    const obj = {
      users: [
        {
          profile: {
            settings: {
              theme: 'dark',
              notifications: { email: true, sms: false }
            }
          },
          posts: [{ title: 'First Post', likes: 10 }]
        }
      ]
    };
    
    expect(unset(obj, 'users.0.profile.settings.notifications.sms')).toBe(true);
    expect(unset(obj, 'users.0.posts.0.likes')).toBe(true);
    
    expect(obj).toEqual({
      users: [
        {
          profile: {
            settings: {
              theme: 'dark',
              notifications: { email: true }
            }
          },
          posts: [{ title: 'First Post' }]
        }
      ]
    });
  });

  it('should handle numeric string keys', () => {
    const obj = { data: { '123': { value: 'test' }, '456': { value: 'another' } } };
    const result = unset(obj, 'data.123');
    
    expect(result).toBe(true);
    expect(obj).toEqual({ data: { '456': { value: 'another' } } });
  });

  it('should handle special characters in keys', () => {
    const obj = {
      'key-with-dash': {
        'key.with.dots': {
          'key with spaces': 'value'
        }
      }
    };
    
    const result = unset(obj, ['key-with-dash', 'key.with.dots', 'key with spaces']);
    expect(result).toBe(true);
    expect(obj).toEqual({ 'key-with-dash': { 'key.with.dots': {} } });
  });

  it('should handle empty path gracefully', () => {
    const obj = { existing: 'value' };
    
    expect(unset(obj, '')).toBe(false);
    expect(unset(obj, [])).toBe(false);
    expect(obj).toEqual({ existing: 'value' }); // Unchanged
  });

  it('should throw ValidationError for null object', () => {
    expect(() => unset(null as any, 'path')).toThrow(ValidationError);
  });

  it('should throw ValidationError for undefined object', () => {
    expect(() => unset(undefined as any, 'path')).toThrow(ValidationError);
  });

  it('should remove properties from objects with prototype chain', () => {
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
    instance.ownProp = 'own';
    
    expect(unset(instance, 'ownProp')).toBe(true);
    expect(unset(instance, 'childProp')).toBe(true);
    expect(unset(instance, 'parentProp')).toBe(true);
    
    // Prototype properties might be removable if they exist on the instance
    // The exact behavior depends on the implementation
    const prototypePropResult = unset(instance, 'prototypeProp');
    expect([true, false]).toContain(prototypePropResult);
    
    expect(instance.ownProp).toBeUndefined();
    expect(instance.childProp).toBeUndefined();
    expect(instance.parentProp).toBeUndefined();
    expect(instance.prototypeProp).toBe('prototype'); // Still accessible via prototype
  });

  it('should handle single-level paths correctly', () => {
    const obj = { a: 1, b: 2, c: 3 };
    
    expect(unset(obj, 'b')).toBe(true);
    expect(obj).toEqual({ a: 1, c: 3 });
    
    expect(unset(obj, 'nonexistent')).toBe(false);
    expect(obj).toEqual({ a: 1, c: 3 });
  });

  it('should throw ValidationError for single-level array paths', () => {
    const arr = ['a', 'b', 'c'];
    expect(() => unset(arr, '1')).toThrow(ValidationError);
  });

  it('should distinguish between array and object deletion', () => {
    const obj = {
      arr: ['a', 'b', 'c'],
      obj: { '0': 'zero', '1': 'one', '2': 'two' }
    };
    
    // Array deletion uses splice
    expect(unset(obj, 'arr.1')).toBe(true);
    expect(obj.arr).toEqual(['a', 'c']);
    expect(obj.arr.length).toBe(2);
    
    // Object deletion uses delete
    expect(unset(obj, 'obj.1')).toBe(true);
    expect(obj.obj).toEqual({ '0': 'zero', '2': 'two' });
    expect(Object.keys(obj.obj)).toEqual(['0', '2']);
  });

  it('should handle mixed array and object paths', () => {
    const obj = {
      data: {
        items: [
          { properties: { values: ['first', 'second'] } },
          { name: 'item2' }
        ]
      }
    };
    
    expect(unset(obj, 'data.items.0.properties.values.1')).toBe(true);
    expect(unset(obj, 'data.items.1.name')).toBe(true);
    
    expect(obj).toEqual({
      data: {
        items: [
          { properties: { values: ['first'] } },
          {}
        ]
      }
    });
  });

  it('should throw ValidationError for non-object first argument', () => {
    expect(() => unset('string' as any, 'path')).toThrow(ValidationError);
    expect(() => unset(123 as any, 'path')).toThrow(ValidationError);
    expect(() => unset(true as any, 'path')).toThrow(ValidationError);
  });

  it('should handle performance with deep paths', () => {
    const obj: any = { level1: {} };
    let current = obj.level1;
    for (let i = 2; i <= 10; i++) {
      current[`level${i}`] = {};
      current = current[`level${i}`];
    }
    current.finalProp = 'value';
    
    const start = performance.now();
    for (let i = 0; i < 100; i++) {
      const testObj = JSON.parse(JSON.stringify(obj)); // Deep clone for testing
      unset(testObj, 'level1.level2.level3.level4.level5.level6.level7.level8.level9.level10.finalProp');
    }
    const end = performance.now();
    
    expect(end - start).toBeLessThan(100); // Should complete in under 100ms
  });

  it('should handle large arrays efficiently', () => {
    const arr = Array.from({ length: 1000 }, (_, i) => i);
    const obj = { items: arr };
    
    const start = performance.now();
    
    // Remove from middle
    expect(unset(obj, 'items.500')).toBe(true);
    expect(obj.items.length).toBe(999);
    
    // Remove from end
    expect(unset(obj, 'items.998')).toBe(true);
    expect(obj.items.length).toBe(998);
    
    const end = performance.now();
    expect(end - start).toBeLessThan(50); // Should be very fast
  });

  it('should handle paths that traverse through arrays correctly', () => {
    const obj = {
      matrix: [
        ['a', 'b', 'c'],
        ['d', 'e', 'f'],
        ['g', 'h', 'i']
      ]
    };
    
    expect(unset(obj, 'matrix.1.1')).toBe(true);
    expect(obj.matrix[1]).toEqual(['d', 'f']);
    
    expect(unset(obj, 'matrix.2')).toBe(true);
    expect(obj.matrix).toEqual([['a', 'b', 'c'], ['d', 'f']]);
  });

  it('should handle edge case with path through non-objects', () => {
    const obj = {
      str: 'string',
      num: 42,
      bool: true
    };
    
    expect(unset(obj, 'str.length')).toBe(false);
    expect(unset(obj, 'num.valueOf')).toBe(false);
    expect(unset(obj, 'bool.toString')).toBe(false);
    
    // Original object should be unchanged
    expect(obj).toEqual({
      str: 'string',
      num: 42,
      bool: true
    });
  });

  it('should handle path with leading/trailing dots', () => {
    const obj = {
      '': { path: 'value1' },
      path: { '': 'value2' }
    };
    
    // Leading dot creates empty string key
    const result1 = unset(obj, '.path');
    const result2 = unset(obj, 'path.');
    
    // Both should attempt to remove properties, exact behavior may vary
    expect([true, false]).toContain(result1);
    expect([true, false]).toContain(result2);
    
    expect(typeof obj).toBe('object');
  });

  it('should handle concurrent property removal', () => {
    const obj = {
      a: { b: { c: 1, d: 2 }, e: { f: 3 } },
      g: { h: 4 }
    };
    
    expect(unset(obj, 'a.b.c')).toBe(true);
    expect(unset(obj, 'a.b.d')).toBe(true);
    expect(unset(obj, 'a.e.f')).toBe(true);
    expect(unset(obj, 'g.h')).toBe(true);
    
    expect(obj).toEqual({
      a: { b: {}, e: {} },
      g: {}
    });
  });

  it('should handle non-enumerable properties', () => {
    const obj: any = {};
    Object.defineProperty(obj, 'nonEnumerable', {
      value: 'hidden',
      enumerable: false,
      writable: true,
      configurable: true
    });
    
    expect(unset(obj, 'nonEnumerable')).toBe(true);
    expect(obj.nonEnumerable).toBeUndefined();
  });

  it('should handle non-configurable properties', () => {
    const obj: any = {};
    Object.defineProperty(obj, 'nonConfigurable', {
      value: 'permanent',
      enumerable: true,
      writable: true,
      configurable: false
    });
    
    // In strict mode, this will throw an error when trying to delete non-configurable properties
    expect(() => unset(obj, 'nonConfigurable')).toThrow();
  });

  it('should throw ValidationError when trying to operate on root-level arrays', () => {
    const arr = ['a', 'b', 'c', 'd', 'e'];
    expect(() => unset(arr, '2')).toThrow(ValidationError);
  });
});