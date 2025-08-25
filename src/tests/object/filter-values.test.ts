import { filterValues } from '../../core/object/filter-values';
import { ValidationError } from '../../utils/errors';

describe('filterValues', () => {
  describe('basic functionality', () => {
    it('should filter object by value predicate', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const result = filterValues(obj, value => value !== 2);
      
      expect(result).toEqual({ a: 1, c: 3, d: 4 });
      expect(result).not.toBe(obj);
    });

    it('should include values that match the predicate', () => {
      const obj = { a: 10, b: 25, c: 5, d: 30 };
      const result = filterValues(obj, value => value > 20);
      
      expect(result).toEqual({ b: 25, d: 30 });
    });

    it('should exclude values that do not match the predicate', () => {
      const obj = { x: 'apple', y: 'banana', z: 'cherry' };
      const result = filterValues(obj, value => value === 'banana');
      
      expect(result).toEqual({ y: 'banana' });
    });

    it('should return empty object when no values match', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = filterValues(obj, value => value > 10);
      
      expect(result).toEqual({});
    });

    it('should return all properties when all values match predicate', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = filterValues(obj, () => true);
      
      expect(result).toEqual(obj);
      expect(result).not.toBe(obj);
    });
  });

  describe('predicate with index parameter', () => {
    it('should provide index to predicate function', () => {
      const obj = { first: 'a', second: 'b', third: 'c', fourth: 'd' };
      const result = filterValues(obj, (_value, index) => index % 2 === 0);
      
      // Should include values at even indices (0, 2)
      expect(result).toEqual({ first: 'a', third: 'c' });
    });

    it('should handle index parameter with different object sizes', () => {
      const indices: number[] = [];
      const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 };
      
      filterValues(obj, (_value, index) => {
        indices.push(index);
        return true;
      });
      
      expect(indices).toEqual([0, 1, 2, 3, 4]);
    });

    it('should use index for complex filtering logic', () => {
      const obj = { item0: 10, item1: 20, item2: 30, item3: 40, item4: 50 };
      const result = filterValues(obj, (value, index) => {
        return (value as number) > 15 && index < 3;
      });
      
      expect(result).toEqual({ item1: 20, item2: 30 });
    });

    it('should maintain correct index order regardless of property names', () => {
      const obj = { z: 'first', a: 'second', m: 'third' };
      const capturedIndices: number[] = [];
      
      filterValues(obj, (_value, index) => {
        capturedIndices.push(index);
        return true;
      });
      
      expect(capturedIndices).toEqual([0, 1, 2]);
    });
  });

  describe('different value types', () => {
    it('should handle string values', () => {
      const obj = { a: 'apple', b: 'banana', c: 'cherry', d: 'date' };
      const result = filterValues(obj, value => (value as string).length > 5);
      
      expect(result).toEqual({ b: 'banana', c: 'cherry' });
    });

    it('should handle number values', () => {
      const obj = { a: 10, b: -5, c: 0, d: 100, e: 3.14 };
      const result = filterValues(obj, value => (value as number) > 0 && (value as number) < 50);
      
      expect(result).toEqual({ a: 10, e: 3.14 });
    });

    it('should handle boolean values', () => {
      const obj = { a: true, b: false, c: true, d: false };
      const result = filterValues(obj, value => value === true);
      
      expect(result).toEqual({ a: true, c: true });
    });

    it('should handle null and undefined values', () => {
      const obj = { a: null, b: undefined, c: 'value', d: null };
      const result = filterValues(obj, value => value != null);
      
      expect(result).toEqual({ c: 'value' });
    });

    it('should handle mixed value types', () => {
      const obj = {
        string: 'text',
        number: 42,
        boolean: true,
        nullValue: null,
        undefinedValue: undefined,
        array: [1, 2, 3],
        object: { nested: 'value' }
      };
      
      const result = filterValues(obj, value => typeof value === 'object' && value !== null);
      
      expect(result).toEqual({
        array: [1, 2, 3],
        object: { nested: 'value' }
      });
    });

    it('should handle complex object values', () => {
      const date = new Date('2023-01-01');
      const regex = /test/g;
      const obj = {
        date: date,
        regex: regex,
        array: [1, 2, 3],
        function: () => 'test',
        object: { key: 'value' }
      };
      
      const result = filterValues(obj, value => value instanceof Date || value instanceof RegExp);
      
      expect(result).toEqual({
        date: date,
        regex: regex
      });
    });

    it('should handle array values', () => {
      const obj = {
        empty: [],
        small: [1, 2],
        large: [1, 2, 3, 4, 5],
        nested: [[1, 2], [3, 4]]
      };
      
      const result = filterValues(obj, value => Array.isArray(value) && (value as unknown[]).length > 2);
      
      expect(result).toEqual({
        large: [1, 2, 3, 4, 5]
      });
    });

    it('should handle function values', () => {
      const obj = {
        arrow: () => 'arrow',
        regular: function() { return 'regular'; },
        async: async () => 'async',
        generator: function*() { yield 'generator'; },
        notFunction: 'string'
      };
      
      const result = filterValues(obj, value => typeof value === 'function');
      
      expect(Object.keys(result)).toEqual(['arrow', 'regular', 'async', 'generator']);
      expect(typeof result.arrow).toBe('function');
      expect(typeof result.regular).toBe('function');
    });
  });

  describe('special number values', () => {
    it('should handle NaN values', () => {
      const obj = { a: NaN, b: 5, c: NaN, d: 10 };
      const result = filterValues(obj, value => Number.isNaN(value as number));
      
      expect(result).toEqual({ a: NaN, c: NaN });
    });

    it('should handle Infinity values', () => {
      const obj = { a: Infinity, b: -Infinity, c: 42, d: Infinity };
      const result = filterValues(obj, value => Number.isFinite(value as number));
      
      expect(result).toEqual({ c: 42 });
    });

    it('should handle zero values', () => {
      const obj = { a: 0, b: -0, c: 1, d: 0 };
      const result = filterValues(obj, value => Object.is(value, 0) || Object.is(value, -0));
      
      expect(result).toEqual({ a: 0, b: -0, d: 0 });
    });
  });

  describe('edge cases', () => {
    it('should handle empty objects', () => {
      const obj = {};
      const result = filterValues(obj, () => true);
      
      expect(result).toEqual({});
      expect(result).not.toBe(obj);
    });

    it('should handle objects with one property', () => {
      const obj = { single: 'value' };
      const resultInclude = filterValues(obj, () => true);
      const resultExclude = filterValues(obj, () => false);
      
      expect(resultInclude).toEqual({ single: 'value' });
      expect(resultExclude).toEqual({});
    });

    it('should preserve key names when filtering by values', () => {
      const obj = { 'complex-key': 1, 'another_key': 2, 'key.with.dots': 1 };
      const result = filterValues(obj, value => value === 1);
      
      expect(result).toEqual({ 'complex-key': 1, 'key.with.dots': 1 });
      expect(Object.keys(result)).toContain('complex-key');
      expect(Object.keys(result)).toContain('key.with.dots');
    });

    it('should maintain property order', () => {
      const obj = { z: 1, a: 2, m: 3 };
      const result = filterValues(obj, () => true);
      
      expect(Object.keys(result)).toEqual(Object.keys(obj));
    });

    it('should handle duplicate values', () => {
      const obj = { a: 'duplicate', b: 'unique', c: 'duplicate', d: 'duplicate' };
      const result = filterValues(obj, value => value === 'duplicate');
      
      expect(result).toEqual({ a: 'duplicate', c: 'duplicate', d: 'duplicate' });
    });
  });

  describe('predicate variations', () => {
    it('should work with arrow functions', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = filterValues(obj, value => [1, 3].includes(value as number));
      
      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should work with regular functions', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = filterValues(obj, function(value) {
        return (value as number) % 2 === 1;
      });
      
      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should work with bound functions', () => {
      const obj = { a: 5, b: 10, c: 15 };
      const context = { threshold: 10 };
      const predicate = function(this: typeof context, value: number) {
        return value >= this.threshold;
      };
      
      const result = filterValues(obj, predicate.bind(context));
      
      expect(result).toEqual({ b: 10, c: 15 });
    });

    it('should handle predicates that throw errors', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const predicate = (value: number) => {
        if (value === 2) {
          throw new Error('Predicate error');
        }
        return true;
      };
      
      expect(() => filterValues(obj, predicate)).toThrow('Predicate error');
    });

    it('should handle predicates with type checking', () => {
      const obj = { a: 'string', b: 123, c: true, d: null };
      const result = filterValues(obj, value => typeof value === 'string' || typeof value === 'number');
      
      expect(result).toEqual({ a: 'string', b: 123 });
    });
  });

  describe('immutability', () => {
    it('should not modify the source object', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const original = { ...obj };
      
      const result = filterValues(obj, value => value !== 2);
      
      expect(obj).toEqual(original);
      expect(result).not.toBe(obj);
    });

    it('should create a new object reference', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = filterValues(obj, () => true);
      
      expect(result).toEqual(obj);
      expect(result).not.toBe(obj);
    });

    it('should preserve nested object references', () => {
      const nestedObj = { nested: 'value' };
      const obj = { a: nestedObj, b: 'simple' };
      
      const result = filterValues(obj, () => true);
      
      expect(result.a).toBe(nestedObj); // Same reference
      expect(result).not.toBe(obj); // Different reference for container
    });

    it('should not affect filtered out objects', () => {
      const objToFilter = { modify: 'me' };
      const objToKeep = { keep: 'me' };
      const obj = { filter: objToFilter, keep: objToKeep };
      
      const result = filterValues(obj, value => value !== objToFilter);
      
      expect(result).toEqual({ keep: objToKeep });
      expect(objToFilter.modify).toBe('me'); // Unchanged
    });
  });

  describe('property enumeration', () => {
    it('should only process enumerable properties', () => {
      const obj = { a: 1, b: 2 };
      Object.defineProperty(obj, 'nonEnum', {
        value: 999,
        enumerable: false
      });
      
      const result = filterValues(obj, () => true);
      
      expect(result).toEqual({ a: 1, b: 2 });
      expect(result).not.toHaveProperty('nonEnum');
    });

    it('should not process inherited properties', () => {
      const parent = { inherited: 'value' };
      const obj = Object.create(parent);
      obj.own = 'property';
      
      const result = filterValues(obj, () => true);
      
      expect(result).toEqual({ own: 'property' });
      expect(result).not.toHaveProperty('inherited');
    });

    it('should handle objects with overridden methods', () => {
      const obj = { 
        a: 1, 
        hasOwnProperty: 'overridden',
        valueOf: 'also overridden'
      };
      const result = filterValues(obj, value => typeof value === 'string');
      
      expect(result).toEqual({ 
        hasOwnProperty: 'overridden',
        valueOf: 'also overridden'
      });
    });
  });

  describe('error handling', () => {
    it('should throw ValidationError for non-object source', () => {
      expect(() => filterValues(null as any, () => true)).toThrow(ValidationError);
      expect(() => filterValues(undefined as any, () => true)).toThrow(ValidationError);
      expect(() => filterValues('string' as any, () => true)).toThrow(ValidationError);
      expect(() => filterValues(123 as any, () => true)).toThrow(ValidationError);
      expect(() => filterValues(true as any, () => true)).toThrow(ValidationError);
      expect(() => filterValues([] as any, () => true)).toThrow(ValidationError);
    });

    it('should throw ValidationError for non-function predicate', () => {
      const obj = { a: 1 };
      
      expect(() => filterValues(obj, null as any)).toThrow(ValidationError);
      expect(() => filterValues(obj, undefined as any)).toThrow(ValidationError);
      expect(() => filterValues(obj, 'string' as any)).toThrow(ValidationError);
      expect(() => filterValues(obj, 123 as any)).toThrow(ValidationError);
      expect(() => filterValues(obj, true as any)).toThrow(ValidationError);
      expect(() => filterValues(obj, {} as any)).toThrow(ValidationError);
    });

    it('should provide meaningful error messages', () => {
      expect(() => filterValues(null as any, () => true)).toThrow('Expected source to be an object, got object');
      expect(() => filterValues({}, null as any)).toThrow('Expected predicate to be a function, got object');
    });
  });

  describe('performance', () => {
    it('should handle large objects efficiently', () => {
      const largeObj: Record<string, number> = {};
      for (let i = 0; i < 1000; i++) {
        largeObj[`key${i}`] = i;
      }
      
      const start = performance.now();
      const result = filterValues(largeObj, value => (value as number) % 2 === 0);
      const end = performance.now();
      
      expect(end - start).toBeLessThan(50); // Should complete in under 50ms
      expect(Object.keys(result)).toHaveLength(500); // Half the values
    });

    it('should maintain performance with complex predicates', () => {
      const obj: Record<string, string> = {};
      for (let i = 0; i < 1000; i++) {
        obj[`key${i}`] = `value_${i}_data`;
      }
      
      const start = performance.now();
      filterValues(obj, value => {
        // Complex predicate with regex and string operations
        return typeof value === 'string' && 
               (value as string).includes('_') && 
               (value as string).length > 8;
      });
      const end = performance.now();
      
      expect(end - start).toBeLessThan(100); // Should complete in under 100ms
    });

    it('should handle objects with complex values efficiently', () => {
      const complexObj: Record<string, any> = {};
      for (let i = 0; i < 500; i++) {
        complexObj[`key${i}`] = {
          id: i,
          data: `item_${i}`,
          nested: { value: i * 2 }
        };
      }
      
      const start = performance.now();
      const result = filterValues(complexObj, value => 
        typeof value === 'object' && 
        value !== null && 
        (value as any).id % 10 === 0
      );
      const end = performance.now();
      
      expect(end - start).toBeLessThan(100);
      expect(Object.keys(result)).toHaveLength(50);
    });
  });

  describe('real-world scenarios', () => {
    it('should filter user data by status', () => {
      const users = {
        'user1': { name: 'John', status: 'active' },
        'user2': { name: 'Jane', status: 'inactive' },
        'user3': { name: 'Bob', status: 'active' },
        'user4': { name: 'Alice', status: 'pending' }
      };
      
      const activeUsers = filterValues(users, user => 
        (user as any).status === 'active'
      );
      
      expect(activeUsers).toEqual({
        'user1': { name: 'John', status: 'active' },
        'user3': { name: 'Bob', status: 'active' }
      });
    });

    it('should filter configuration by enabled state', () => {
      const features = {
        'feature-a': { enabled: true, version: '1.0' },
        'feature-b': { enabled: false, version: '2.0' },
        'feature-c': { enabled: true, version: '1.5' },
        'feature-d': { enabled: false, version: '3.0' }
      };
      
      const enabledFeatures = filterValues(features, feature => 
        (feature as any).enabled
      );
      
      expect(enabledFeatures).toEqual({
        'feature-a': { enabled: true, version: '1.0' },
        'feature-c': { enabled: true, version: '1.5' }
      });
    });

    it('should filter products by price range', () => {
      const products = {
        'laptop': 999.99,
        'mouse': 25.50,
        'keyboard': 75.00,
        'monitor': 299.99,
        'headphones': 150.00
      };
      
      const affordableProducts = filterValues(products, price => 
        (price as number) <= 200
      );
      
      expect(affordableProducts).toEqual({
        'mouse': 25.50,
        'keyboard': 75.00,
        'headphones': 150.00
      });
    });

    it('should filter API responses by validity', () => {
      const responses = {
        'endpoint1': { data: { users: [] }, error: null },
        'endpoint2': { data: null, error: 'Not found' },
        'endpoint3': { data: { posts: [1, 2, 3] }, error: null },
        'endpoint4': { data: null, error: 'Unauthorized' }
      };
      
      const successfulResponses = filterValues(responses, response => 
        (response as any).error === null && (response as any).data !== null
      );
      
      expect(successfulResponses).toEqual({
        'endpoint1': { data: { users: [] }, error: null },
        'endpoint3': { data: { posts: [1, 2, 3] }, error: null }
      });
    });

    it('should filter form validation results', () => {
      const validationResults = {
        'name': { isValid: true, message: '' },
        'email': { isValid: false, message: 'Invalid email format' },
        'password': { isValid: true, message: '' },
        'confirmPassword': { isValid: false, message: 'Passwords do not match' }
      };
      
      const invalidFields = filterValues(validationResults, result => 
        !(result as any).isValid
      );
      
      expect(invalidFields).toEqual({
        'email': { isValid: false, message: 'Invalid email format' },
        'confirmPassword': { isValid: false, message: 'Passwords do not match' }
      });
    });
  });

  describe('type safety', () => {
    it('should maintain type information for known value types', () => {
      interface Product {
        name: string;
        price: number;
        inStock: boolean;
      }
      
      const products: Record<string, Product> = {
        'item1': { name: 'Laptop', price: 999, inStock: true },
        'item2': { name: 'Mouse', price: 25, inStock: false },
        'item3': { name: 'Keyboard', price: 75, inStock: true }
      };
      
      const inStockProducts = filterValues(products, product => product.inStock);
      
      // TypeScript should maintain the Product type
      expect(Object.values(inStockProducts).every(product => 
        product != null &&
        typeof product.name === 'string' &&
        typeof product.price === 'number' &&
        typeof product.inStock === 'boolean'
      )).toBe(true);
    });

    it('should work with union types', () => {
      const mixedData: Record<string, string | number | boolean> = {
        'text': 'hello',
        'count': 42,
        'flag': true,
        'another': 'world'
      };
      
      const stringValues = filterValues(mixedData, value => typeof value === 'string');
      
      expect(stringValues).toEqual({
        'text': 'hello',
        'another': 'world'
      });
    });
  });
});