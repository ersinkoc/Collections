/**
 * Predicate function for filtering operations
 */
export type Predicate<T> = (value: T, index: number, array: T[]) => boolean;

/**
 * Async predicate function for async filtering operations
 */
export type AsyncPredicate<T> = (value: T, index: number, array: T[]) => Promise<boolean>;

/**
 * Selector function for transforming values
 * K defaults to any type, but can be constrained (e.g., PropertyKey for groupBy)
 */
export type Selector<T, K = any> = (value: T, index: number, array: T[]) => K;

/**
 * Async selector function for async transforming operations
 */
export type AsyncSelector<T, K> = (value: T, index: number, array: T[]) => Promise<K>;

/**
 * Comparator function for sorting operations
 */
export type Comparator<T> = (a: T, b: T) => number;

/**
 * Reducer function for reduction operations
 */
export type Reducer<T, R> = (accumulator: R, current: T, index: number, array: T[]) => R;

/**
 * Async reducer function for async reduction operations
 */
export type AsyncReducer<T, R> = (
  accumulator: R,
  current: T,
  index: number,
  array: T[]
) => Promise<R>;

/**
 * Deep partial type for nested optional properties
 */
export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

/**
 * Require at least one property from type
 */
export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

/**
 * Nullable type
 */
export type Nullable<T> = T | null | undefined;

/**
 * Non-nullable type
 */
export type NonNullable<T> = T extends null | undefined ? never : T;

/**
 * Tree node structure
 */
export interface TreeNode<T> {
  value: T;
  children?: TreeNode<T>[];
}

/**
 * Tree traversal order
 */
export type TraversalOrder = 'pre' | 'post' | 'level';

/**
 * Key value pair
 */
export type Entry<K, V> = [K, V];

/**
 * Object with string keys
 */
export type StringRecord<T> = Record<string, T>;

/**
 * Object with number keys
 */
export type NumberRecord<T> = Record<number, T>;

/**
 * Extract keys of specific value type
 */
export type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

/**
 * Make specific keys optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make specific keys required
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;