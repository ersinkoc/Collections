import { ValidationError, RangeError, ArgumentError } from './errors';

/**
 * Validates that a value is an array
 */
export function validateArray<T>(value: unknown, paramName: string): T[] {
  if (!Array.isArray(value)) {
    throw new ValidationError(
      `Expected ${paramName} to be an array, got ${typeof value}`,
      { paramName, value }
    );
  }
  return value as T[];
}

/**
 * Validates that a value is a non-empty array
 */
export function validateNonEmptyArray<T>(value: unknown, paramName: string): T[] {
  const arr = validateArray<T>(value, paramName);
  if (arr.length === 0) {
    throw new ValidationError(
      `Expected ${paramName} to be a non-empty array`,
      { paramName, value }
    );
  }
  return arr;
}

/**
 * Validates that a value is an object
 */
export function validateObject<T extends object>(value: unknown, paramName: string): T {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new ValidationError(
      `Expected ${paramName} to be an object, got ${typeof value}`,
      { paramName, value }
    );
  }
  return value as T;
}

/**
 * Validates that a value is a function
 */
export function validateFunction<T extends (...args: never[]) => unknown>(
  value: unknown,
  paramName: string
): T {
  if (typeof value !== 'function') {
    throw new ValidationError(
      `Expected ${paramName} to be a function, got ${typeof value}`,
      { paramName, value }
    );
  }
  return value as T;
}

/**
 * Validates that a value is a positive integer
 */
export function validatePositiveInteger(value: unknown, paramName: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    throw new RangeError(
      `Expected ${paramName} to be a positive integer, got ${String(value)}`,
      { paramName, value }
    );
  }
  return value;
}

/**
 * Validates that a value is a non-negative integer
 */
export function validateNonNegativeInteger(value: unknown, paramName: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    throw new RangeError(
      `Expected ${paramName} to be a non-negative integer, got ${String(value)}`,
      { paramName, value }
    );
  }
  return value;
}

/**
 * Validates that a value is within a specified range
 */
export function validateRange(
  value: unknown,
  min: number,
  max: number,
  paramName: string
): number {
  if (typeof value !== 'number') {
    throw new ValidationError(
      `Expected ${paramName} to be a number, got ${typeof value}`,
      { paramName, value }
    );
  }
  if (value < min || value > max) {
    throw new RangeError(
      `Expected ${paramName} to be between ${min} and ${max}, got ${value}`,
      { paramName, value, min, max }
    );
  }
  return value;
}

/**
 * Validates that a value is a Set
 */
export function validateSet<T>(value: unknown, paramName: string): Set<T> {
  if (!(value instanceof Set)) {
    throw new ValidationError(
      `Expected ${paramName} to be a Set, got ${typeof value}`,
      { paramName, value }
    );
  }
  return value;
}

/**
 * Validates that a value is a Map
 */
export function validateMap<K, V>(value: unknown, paramName: string): Map<K, V> {
  if (!(value instanceof Map)) {
    throw new ValidationError(
      `Expected ${paramName} to be a Map, got ${typeof value}`,
      { paramName, value }
    );
  }
  return value;
}

/**
 * Validates that a value is a string
 */
export function validateString(value: unknown, paramName: string): string {
  if (typeof value !== 'string') {
    throw new ValidationError(
      `Expected ${paramName} to be a string, got ${typeof value}`,
      { paramName, value }
    );
  }
  return value;
}

/**
 * Validates that a value is a non-empty string
 */
export function validateNonEmptyString(value: unknown, paramName: string): string {
  const str = validateString(value, paramName);
  if (str.length === 0) {
    throw new ValidationError(
      `Expected ${paramName} to be a non-empty string`,
      { paramName, value }
    );
  }
  return str;
}

/**
 * Validates that a value is defined (not null or undefined)
 */
export function validateDefined<T>(value: T | null | undefined, paramName: string): T {
  if (value === null || value === undefined) {
    throw new ArgumentError(
      `Expected ${paramName} to be defined, got ${String(value)}`,
      { paramName, value }
    );
  }
  return value;
}

/**
 * Validates that a value is a boolean
 */
export function validateBoolean(value: unknown, paramName: string): boolean {
  if (typeof value !== 'boolean') {
    throw new ValidationError(
      `Expected ${paramName} to be a boolean, got ${typeof value}`,
      { paramName, value }
    );
  }
  return value;
}