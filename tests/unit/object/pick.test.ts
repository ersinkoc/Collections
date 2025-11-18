import { pick } from '../../../src/core/object/pick';
import { ValidationError } from '../../../src/utils/errors';

describe('pick', () => {
  describe('normal cases', () => {
    it('should pick specified keys from object', () => {
      const result = pick({ a: 1, b: 2, c: 3 }, ['a', 'c']);
      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should pick single key', () => {
      const result = pick({ a: 1, b: 2, c: 3 }, ['b']);
      expect(result).toEqual({ b: 2 });
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
      const result = pick(obj, ['str', 'arr', 'nil']);
      expect(result).toEqual({
        str: 'string',
        arr: [1, 2, 3],
        nil: null,
      });
    });

    it('should preserve undefined values', () => {
      const result = pick({ a: undefined, b: 2 }, ['a']);
      expect(result).toEqual({ a: undefined });
      expect('a' in result).toBe(true);
    });

    it('should work with symbol keys', () => {
      const sym1 = Symbol('sym1');
      const sym2 = Symbol('sym2');
      const obj = { [sym1]: 1, [sym2]: 2, a: 3 };
      const result = pick(obj, [sym1] as any);
      expect(result).toEqual({ [sym1]: 1 });
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
      
      const publicUser = pick(user as unknown as Record<string, unknown>, ['id', 'name', 'email']);
      expect(publicUser).toEqual({
        id: 1,
        name: 'Alice',
        email: 'alice@example.com',
      });
      // TypeScript should know publicUser doesn't have password
      expect('password' in publicUser).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should return empty object when picking no keys', () => {
      const result = pick({ a: 1, b: 2 }, []);
      expect(result).toEqual({});
    });

    it('should ignore non-existent keys', () => {
      const result = pick({ a: 1, b: 2 }, ['a', 'c', 'd'] as any);
      expect(result).toEqual({ a: 1 });
    });

    it('should handle empty source object', () => {
      const result = pick({}, ['a', 'b'] as any);
      expect(result).toEqual({});
    });

    it('should handle duplicate keys in array', () => {
      const result = pick({ a: 1, b: 2 }, ['a', 'a', 'b', 'b']);
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should maintain immutability', () => {
      const source = { a: { nested: 1 }, b: 2 };
      const result = pick(source, ['a']);

      // Values are deeply cloned to prevent shared references (since previous sessions)
      expect(result.a).not.toBe(source.a); // Should NOT share reference
      expect(result.a).toStrictEqual({ nested: 1 }); // But values match
      source.a.nested = 2;
      expect(result.a.nested).toBe(1); // Changes do NOT reflect (deep clone)

      const keys = ['a'];
      pick(source, keys as any);
      expect(keys).toEqual(['a']); // Keys array unchanged
    });

    it('should handle inherited properties', () => {
      const parent = { inherited: 1 };
      const child = Object.create(parent);
      child.own = 2;
      
      const result = pick(child, ['own', 'inherited'] as any);
      expect(result).toEqual({ own: 2 }); // Only own properties
    });

    it('should handle null prototype objects', () => {
      const obj = Object.create(null);
      obj.a = 1;
      obj.b = 2;
      
      const result = pick(obj, ['a']);
      expect(result).toEqual({ a: 1 });
    });
  });

  describe('error cases', () => {
    it('should throw ValidationError for non-object source', () => {
      expect(() => pick(null as any, [])).toThrow(ValidationError);
      expect(() => pick(undefined as any, [])).toThrow(ValidationError);
      expect(() => pick('string' as any, [])).toThrow(ValidationError);
      expect(() => pick(123 as any, [])).toThrow(ValidationError);
      expect(() => pick([] as any, [])).toThrow(ValidationError);
    });

    it('should throw ValidationError for non-array keys', () => {
      expect(() => pick({ a: 1 }, null as any)).toThrow(ValidationError);
      expect(() => pick({ a: 1 }, undefined as any)).toThrow(ValidationError);
      expect(() => pick({ a: 1 }, 'string' as any)).toThrow(ValidationError);
      expect(() => pick({ a: 1 }, 123 as any)).toThrow(ValidationError);
      expect(() => pick({ a: 1 }, {} as any)).toThrow(ValidationError);
    });

    it('should throw ValidationError with meaningful message', () => {
      try {
        pick(null as any, []);
      } catch (error: any) {
        expect(error.message).toContain('object');
        expect(error.code).toBe('VALIDATION_ERROR');
      }

      try {
        pick({ a: 1 }, null as any);
      } catch (error: any) {
        expect(error.message).toContain('array');
        expect(error.code).toBe('VALIDATION_ERROR');
      }
    });
  });

  describe('performance', () => {
    it('should handle large objects efficiently', () => {
      const largeObj: any = {};
      const keysToPick: string[] = [];
      
      for (let i = 0; i < 10000; i++) {
        largeObj[`key${i}`] = i;
        if (i % 2 === 0) {
          keysToPick.push(`key${i}`);
        }
      }
      
      const start = performance.now();
      const result = pick(largeObj, keysToPick);
      const end = performance.now();
      
      expect(Object.keys(result).length).toBe(5000);
      expect(end - start).toBeLessThan(100); // Should complete within 100ms
    });

    it('should have O(k) complexity where k is keys length', () => {
      const obj: any = {};
      for (let i = 0; i < 10000; i++) {
        obj[`key${i}`] = i;
      }
      
      const sizes = [10, 100, 1000];
      const times: number[] = [];
      
      for (const size of sizes) {
        const keys = Array.from({ length: size }, (_, i) => `key${i}`);
        const start = performance.now();
        pick(obj, keys);
        const end = performance.now();
        times.push(end - start);
      }
      
      // Verify roughly linear growth with key count
      const ratio1 = times[1]! / times[0]!;
      const ratio2 = times[2]! / times[1]!;
      expect(Math.abs(ratio1 - ratio2)).toBeLessThan(10);
    });
  });
});