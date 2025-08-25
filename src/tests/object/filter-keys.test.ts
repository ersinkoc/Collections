import { filterKeys } from '../../core/object/filter-keys';
import { ValidationError } from '../../utils/errors';

describe('filterKeys', () => {
  describe('basic functionality', () => {
    it('should filter object by key predicate', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const result = filterKeys(obj, key => key !== 'b');
      
      expect(result).toEqual({ a: 1, c: 3, d: 4 });
      expect(result).not.toBe(obj);
    });

    it('should include keys that match the predicate', () => {
      const obj = { apple: 1, banana: 2, cherry: 3 };
      const result = filterKeys(obj, key => key.startsWith('a') || key.startsWith('c'));
      
      expect(result).toEqual({ apple: 1, cherry: 3 });
    });

    it('should exclude keys that do not match the predicate', () => {
      const obj = { x: 10, y: 20, z: 30 };
      const result = filterKeys(obj, key => key === 'y');
      
      expect(result).toEqual({ y: 20 });
    });

    it('should return empty object when no keys match', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = filterKeys(obj, key => key === 'x');
      
      expect(result).toEqual({});
    });

    it('should return all keys when all match predicate', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = filterKeys(obj, () => true);
      
      expect(result).toEqual(obj);
      expect(result).not.toBe(obj);
    });
  });

  describe('predicate with index parameter', () => {
    it('should provide index to predicate function', () => {
      const obj = { first: 1, second: 2, third: 3, fourth: 4 };
      const result = filterKeys(obj, (_key, index) => index % 2 === 0);
      
      // Should include keys at even indices (0, 2)
      expect(result).toEqual({ first: 1, third: 3 });
    });

    it('should handle index parameter with different object sizes', () => {
      const indices: number[] = [];
      const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 };
      
      filterKeys(obj, (_key, index) => {
        indices.push(index);
        return true;
      });
      
      expect(indices).toEqual([0, 1, 2, 3, 4]);
    });

    it('should use index for complex filtering logic', () => {
      const obj = { item0: 'a', item1: 'b', item2: 'c', item3: 'd', item4: 'e' };
      const result = filterKeys(obj, (key, index) => {
        return key.includes(index.toString()) && index < 3;
      });
      
      expect(result).toEqual({ item0: 'a', item1: 'b', item2: 'c' });
    });
  });

  describe('different key types', () => {
    it('should handle string keys', () => {
      const obj = { name: 'John', age: 30, city: 'NYC' };
      const result = filterKeys(obj, key => key.length > 3);
      
      expect(result).toEqual({ name: 'John', city: 'NYC' });
    });

    it('should handle numeric string keys', () => {
      const obj = { '0': 'zero', '1': 'one', '10': 'ten', '2': 'two' };
      const result = filterKeys(obj, key => parseInt(key) < 5);
      
      expect(result).toEqual({ '0': 'zero', '1': 'one', '2': 'two' });
    });

    it('should handle mixed alphanumeric keys', () => {
      const obj = { a1: 1, b2: 2, c3: 3, x: 4, y: 5 };
      const result = filterKeys(obj, key => /^[a-z]\d$/.test(key));
      
      expect(result).toEqual({ a1: 1, b2: 2, c3: 3 });
    });

    it('should handle special character keys', () => {
      const obj = { 'key-1': 1, 'key_2': 2, 'key.3': 3, 'key 4': 4 };
      const result = filterKeys(obj, key => key.includes('-') || key.includes('_'));
      
      expect(result).toEqual({ 'key-1': 1, 'key_2': 2 });
    });
  });

  describe('different value types', () => {
    it('should preserve all value types', () => {
      const obj = {
        string: 'text',
        number: 42,
        boolean: true,
        nullValue: null,
        undefinedValue: undefined,
        array: [1, 2, 3],
        object: { nested: 'value' },
        date: new Date('2023-01-01'),
        regex: /test/g,
        fn: () => 'function'
      };
      
      const result = filterKeys(obj, key => key !== 'boolean');
      
      expect(result.string).toBe('text');
      expect(result.number).toBe(42);
      expect(result.nullValue).toBe(null);
      expect(result.undefinedValue).toBe(undefined);
      expect(result.array).toEqual([1, 2, 3]);
      expect(result.object).toEqual({ nested: 'value' });
      expect(result.date).toBeInstanceOf(Date);
      expect(result.regex).toBeInstanceOf(RegExp);
      expect(typeof result.fn).toBe('function');
      expect(result).not.toHaveProperty('boolean');
    });

    it('should handle complex nested objects', () => {
      const obj = {
        simple: 'value',
        nested: {
          deep: {
            value: 'nested'
          }
        },
        array: [{ item: 1 }, { item: 2 }]
      };
      
      const result = filterKeys(obj, key => key !== 'simple');
      
      expect(result).toEqual({
        nested: {
          deep: {
            value: 'nested'
          }
        },
        array: [{ item: 1 }, { item: 2 }]
      });
      
      // Verify object references are preserved
      expect(result.nested).toBe(obj.nested);
      expect(result.array).toBe(obj.array);
    });
  });

  describe('edge cases', () => {
    it('should handle empty objects', () => {
      const obj = {};
      const result = filterKeys(obj, () => true);
      
      expect(result).toEqual({});
      expect(result).not.toBe(obj);
    });

    it('should handle objects with one property', () => {
      const obj = { single: 'value' };
      const resultInclude = filterKeys(obj, () => true);
      const resultExclude = filterKeys(obj, () => false);
      
      expect(resultInclude).toEqual({ single: 'value' });
      expect(resultExclude).toEqual({});
    });

    it('should handle keys with special characters and unicode', () => {
      const obj = {
        'emoji😀': 'smile',
        'unicode_ñ': 'spanish',
        '中文': 'chinese',
        '🚀rocket': 'space'
      };
      
      const result = filterKeys(obj, key => key.includes('😀') || key.includes('中'));
      
      expect(result).toEqual({
        'emoji😀': 'smile',
        '中文': 'chinese'
      });
    });

    it('should preserve property order', () => {
      const obj = { z: 3, a: 1, m: 2 };
      const result = filterKeys(obj, () => true);
      
      expect(Object.keys(result)).toEqual(Object.keys(obj));
    });
  });

  describe('predicate variations', () => {
    it('should work with arrow functions', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = filterKeys(obj, key => ['a', 'c'].includes(key));
      
      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should work with regular functions', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = filterKeys(obj, function(key) {
        return key !== 'b';
      });
      
      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should work with bound functions', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const context = { excluded: 'b' };
      const predicate = function(this: typeof context, key: string) {
        return key !== this.excluded;
      };
      
      const result = filterKeys(obj, predicate.bind(context));
      
      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should handle predicates that throw errors', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const predicate = (key: string) => {
        if (key === 'b') {
          throw new Error('Predicate error');
        }
        return true;
      };
      
      expect(() => filterKeys(obj, predicate)).toThrow('Predicate error');
    });
  });

  describe('immutability', () => {
    it('should not modify the source object', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const original = { ...obj };
      
      const result = filterKeys(obj, key => key !== 'b');
      
      expect(obj).toEqual(original);
      expect(result).not.toBe(obj);
    });

    it('should create a new object reference', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = filterKeys(obj, () => true);
      
      expect(result).toEqual(obj);
      expect(result).not.toBe(obj);
    });

    it('should preserve nested object references', () => {
      const nestedObj = { nested: 'value' };
      const obj = { a: nestedObj, b: 'simple' };
      
      const result = filterKeys(obj, () => true);
      
      expect(result.a).toBe(nestedObj); // Same reference
      expect(result).not.toBe(obj); // Different reference for container
    });
  });

  describe('property enumeration', () => {
    it('should only process enumerable properties', () => {
      const obj = { a: 1, b: 2 };
      Object.defineProperty(obj, 'nonEnum', {
        value: 'hidden',
        enumerable: false
      });
      
      const result = filterKeys(obj, () => true);
      
      expect(result).toEqual({ a: 1, b: 2 });
      expect(result).not.toHaveProperty('nonEnum');
    });

    it('should not process inherited properties', () => {
      const parent = { inherited: 'value' };
      const obj = Object.create(parent);
      obj.own = 'property';
      
      const result = filterKeys(obj, () => true);
      
      expect(result).toEqual({ own: 'property' });
      expect(result).not.toHaveProperty('inherited');
    });

    it('should handle objects with overridden hasOwnProperty', () => {
      const obj = { a: 1, hasOwnProperty: 'overridden' };
      const result = filterKeys(obj, key => key === 'a');
      
      expect(result).toEqual({ a: 1 });
    });
  });

  describe('error handling', () => {
    it('should throw ValidationError for non-object source', () => {
      expect(() => filterKeys(null as any, () => true)).toThrow(ValidationError);
      expect(() => filterKeys(undefined as any, () => true)).toThrow(ValidationError);
      expect(() => filterKeys('string' as any, () => true)).toThrow(ValidationError);
      expect(() => filterKeys(123 as any, () => true)).toThrow(ValidationError);
      expect(() => filterKeys(true as any, () => true)).toThrow(ValidationError);
      expect(() => filterKeys([] as any, () => true)).toThrow(ValidationError);
    });

    it('should throw ValidationError for non-function predicate', () => {
      const obj = { a: 1 };
      
      expect(() => filterKeys(obj, null as any)).toThrow(ValidationError);
      expect(() => filterKeys(obj, undefined as any)).toThrow(ValidationError);
      expect(() => filterKeys(obj, 'string' as any)).toThrow(ValidationError);
      expect(() => filterKeys(obj, 123 as any)).toThrow(ValidationError);
      expect(() => filterKeys(obj, true as any)).toThrow(ValidationError);
      expect(() => filterKeys(obj, {} as any)).toThrow(ValidationError);
    });

    it('should provide meaningful error messages', () => {
      expect(() => filterKeys(null as any, () => true)).toThrow('Expected source to be an object, got object');
      expect(() => filterKeys({}, null as any)).toThrow('Expected predicate to be a function, got object');
    });
  });

  describe('performance', () => {
    it('should handle large objects efficiently', () => {
      const largeObj: Record<string, number> = {};
      for (let i = 0; i < 1000; i++) {
        largeObj[`key${i}`] = i;
      }
      
      const start = performance.now();
      const result = filterKeys(largeObj, key => parseInt(key.slice(3)) % 2 === 0);
      const end = performance.now();
      
      expect(end - start).toBeLessThan(50); // Should complete in under 50ms
      expect(Object.keys(result)).toHaveLength(500); // Half the keys
    });

    it('should maintain performance with complex predicates', () => {
      const obj: Record<string, number> = {};
      for (let i = 0; i < 1000; i++) {
        obj[`item_${i}_data`] = i;
      }
      
      const start = performance.now();
      filterKeys(obj, key => {
        // Complex predicate with regex and string operations
        return /item_\d+_data/.test(key) && key.length > 10;
      });
      const end = performance.now();
      
      expect(end - start).toBeLessThan(100); // Should complete in under 100ms
    });
  });

  describe('real-world scenarios', () => {
    it('should filter configuration keys', () => {
      const config = {
        'api.baseUrl': 'https://api.example.com',
        'api.timeout': 5000,
        'db.host': 'localhost',
        'db.port': 5432,
        'cache.enabled': true,
        'cache.ttl': 3600
      };
      
      const apiConfig = filterKeys(config, key => key.startsWith('api.'));
      const dbConfig = filterKeys(config, key => key.startsWith('db.'));
      
      expect(apiConfig).toEqual({
        'api.baseUrl': 'https://api.example.com',
        'api.timeout': 5000
      });
      
      expect(dbConfig).toEqual({
        'db.host': 'localhost',
        'db.port': 5432
      });
    });

    it('should filter out sensitive keys', () => {
      const userData = {
        id: 123,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'secret123',
        token: 'abc123',
        preferences: { theme: 'dark' }
      };
      
      const sensitiveKeys = ['password', 'token'];
      const publicData = filterKeys(userData, key => !sensitiveKeys.includes(key));
      
      expect(publicData).toEqual({
        id: 123,
        name: 'John Doe',
        email: 'john@example.com',
        preferences: { theme: 'dark' }
      });
    });

    it('should filter data attributes', () => {
      const htmlAttributes = {
        id: 'element-id',
        class: 'my-class',
        'data-id': '123',
        'data-type': 'button',
        'data-action': 'click',
        style: 'color: red',
        onclick: 'handleClick()'
      };
      
      const dataAttrs = filterKeys(htmlAttributes, key => key.startsWith('data-'));
      
      expect(dataAttrs).toEqual({
        'data-id': '123',
        'data-type': 'button',
        'data-action': 'click'
      });
    });
  });

  describe('type safety', () => {
    it('should maintain type information', () => {
      const obj = {
        name: 'John',
        age: 30,
        active: true
      };
      
      const result = filterKeys(obj, key => key !== 'age');
      
      // TypeScript should infer Partial<typeof obj>
      expect(result['name']).toBe('John');
      expect(result['active']).toBe(true);
      expect(result).not.toHaveProperty('age');
    });
  });
});