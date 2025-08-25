import { omit } from '../../../src/core/object/omit';
import { ValidationError } from '../../../src/utils/errors';

describe('omit', () => {
  describe('normal cases', () => {
    it('should omit specified keys from object', () => {
      const result = omit({ a: 1, b: 2, c: 3 }, ['b']);
      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should omit multiple keys', () => {
      const result = omit({ a: 1, b: 2, c: 3, d: 4 }, ['b', 'd']);
      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should work with different value types', () => {
      const obj = {
        str: 'string',
        num: 123,
        bool: true,
        arr: [1, 2, 3],
        obj: { nested: true },
        nil: null,
        undef: undefined,
      };
      const result = omit(obj, ['bool', 'obj', 'undef']);
      expect(result).toEqual({
        str: 'string',
        num: 123,
        arr: [1, 2, 3],
        nil: null,
      });
    });

    it('should preserve undefined values not being omitted', () => {
      const result = omit({ a: undefined, b: 2, c: 3 }, ['b']);
      expect(result).toEqual({ a: undefined, c: 3 });
      expect('a' in result).toBe(true);
    });

    it('should work with symbol keys', () => {
      const sym1 = Symbol('sym1');
      const sym2 = Symbol('sym2');
      const obj = { [sym1]: 1, [sym2]: 2, a: 3 };
      const result = omit(obj, [sym2] as any);
      expect(result).toEqual({ [sym1]: 1, a: 3 });
    });

    it('should maintain type safety', () => {
      interface User {
        id: number;
        name: string;
        email: string;
        password: string;
      }
      
      const user: User = {
        id: 1,
        name: 'Alice',
        email: 'alice@example.com',
        password: 'secret',
      };
      
      const publicUser = omit(user as unknown as Record<string, unknown>, ['password']);
      expect(publicUser).toEqual({
        id: 1,
        name: 'Alice',
        email: 'alice@example.com',
      });
      expect('password' in publicUser).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should return full object when omitting no keys', () => {
      const obj = { a: 1, b: 2 };
      const result = omit(obj, []);
      expect(result).toEqual({ a: 1, b: 2 });
      expect(result).not.toBe(obj); // Should be a new object
    });

    it('should ignore non-existent keys', () => {
      const result = omit({ a: 1, b: 2 }, ['c', 'd'] as any);
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should handle empty source object', () => {
      const result = omit({}, ['a', 'b'] as any);
      expect(result).toEqual({});
    });

    it('should handle duplicate keys in array', () => {
      const result = omit({ a: 1, b: 2, c: 3 }, ['b', 'b', 'c', 'c']);
      expect(result).toEqual({ a: 1 });
    });

    it('should maintain immutability', () => {
      const source = { a: { nested: 1 }, b: 2, c: 3 };
      const result = omit(source, ['b']);
      
      expect(result.a).toBe(source.a); // Should share reference
      source.a.nested = 2;
      expect(result.a.nested).toBe(2); // Changes reflect
      
      const keys = ['b'];
      omit(source, keys as any);
      expect(keys).toEqual(['b']); // Keys array unchanged
    });

    it('should only omit own properties', () => {
      const parent = { inherited: 1 };
      const child = Object.create(parent);
      child.own = 2;
      child.another = 3;
      
      const result = omit(child, ['another'] as any);
      expect(result).toEqual({ own: 2 }); // Only own properties, inherited not included
      expect('inherited' in result).toBe(false);
    });

    it('should handle null prototype objects', () => {
      const obj = Object.create(null);
      obj.a = 1;
      obj.b = 2;
      obj.c = 3;
      
      const result = omit(obj, ['b']);
      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should handle omitting all keys', () => {
      const result = omit({ a: 1, b: 2 }, ['a', 'b']);
      expect(result).toEqual({});
    });
  });

  describe('error cases', () => {
    it('should throw ValidationError for non-object source', () => {
      expect(() => omit(null as any, [])).toThrow(ValidationError);
      expect(() => omit(undefined as any, [])).toThrow(ValidationError);
      expect(() => omit('string' as any, [])).toThrow(ValidationError);
      expect(() => omit(123 as any, [])).toThrow(ValidationError);
      expect(() => omit([] as any, [])).toThrow(ValidationError);
    });

    it('should throw ValidationError for non-array keys', () => {
      expect(() => omit({ a: 1 }, null as any)).toThrow(ValidationError);
      expect(() => omit({ a: 1 }, undefined as any)).toThrow(ValidationError);
      expect(() => omit({ a: 1 }, 'string' as any)).toThrow(ValidationError);
      expect(() => omit({ a: 1 }, 123 as any)).toThrow(ValidationError);
      expect(() => omit({ a: 1 }, {} as any)).toThrow(ValidationError);
    });

    it('should throw ValidationError with meaningful message', () => {
      try {
        omit(null as any, []);
      } catch (error: any) {
        expect(error.message).toContain('object');
        expect(error.code).toBe('VALIDATION_ERROR');
      }

      try {
        omit({ a: 1 }, null as any);
      } catch (error: any) {
        expect(error.message).toContain('array');
        expect(error.code).toBe('VALIDATION_ERROR');
      }
    });
  });

  describe('performance', () => {
    it('should handle large objects efficiently', () => {
      const largeObj: any = {};
      const keysToOmit: string[] = [];
      
      for (let i = 0; i < 10000; i++) {
        largeObj[`key${i}`] = i;
        if (i % 2 === 0) {
          keysToOmit.push(`key${i}`);
        }
      }
      
      const start = performance.now();
      const result = omit(largeObj, keysToOmit);
      const end = performance.now();
      
      expect(Object.keys(result).length).toBe(5000);
      expect(end - start).toBeLessThan(100); // Should complete within 100ms
    });

    it.skip('should have O(n) complexity where n is object size', () => {
      const sizes = [100, 1000, 10000];
      const times: number[] = [];
      
      for (const size of sizes) {
        const obj: any = {};
        for (let i = 0; i < size; i++) {
          obj[`key${i}`] = i;
        }
        
        const start = performance.now();
        omit(obj, ['key0', 'key1']);
        const end = performance.now();
        times.push(end - start);
      }
      
      // Verify roughly linear growth with object size
      const ratio1 = times[1]! / times[0]!;
      const ratio2 = times[2]! / times[1]!;
      expect(ratio2).toBeLessThan(ratio1 * 5);
    });

    it('should use Set for efficient key lookup', () => {
      const obj: any = {};
      for (let i = 0; i < 1000; i++) {
        obj[`key${i}`] = i;
      }
      
      // Many keys to omit - Set lookup should be O(1)
      const keysToOmit = Array.from({ length: 500 }, (_, i) => `key${i * 2}`);
      
      const start = performance.now();
      const result = omit(obj, keysToOmit);
      const end = performance.now();
      
      expect(Object.keys(result).length).toBe(500);
      expect(end - start).toBeLessThan(50);
    });
  });
});