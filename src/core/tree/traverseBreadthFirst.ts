import { TreeNode } from './TreeNode';
import { validateFunction } from '../../utils/validators';

/**
 * Traverses a tree in breadth-first order.
 * Handles circular references safely.
 *
 * @param root - Root node to start traversal from
 * @param callback - Function called for each node
 * @returns Array of values returned by callback
 * @throws {ValidationError} When callback is not a function
 *
 * @example
 * ```typescript
 * const tree = createTreeNode('root', [
 *   createTreeNode('child1'),
 *   createTreeNode('child2')
 * ]);
 * traverseBreadthFirst(tree, node => node.data); // Returns: ['root', 'child1', 'child2']
 * ```
 *
 * @note Handles circular references safely - cycles are detected and skipped
 * @complexity O(n) - Where n is the number of nodes
 * @since 1.0.0
 */
export function traverseBreadthFirst<T, U>(
  root: TreeNode<T> | null | undefined,
  callback: (node: TreeNode<T>) => U
): U[] {
  validateFunction(callback, 'callback');

  if (!root) {
    return [];
  }

  const result: U[] = [];
  const queue: TreeNode<T>[] = [root];
  const visited = new WeakSet<TreeNode<T>>();
  let queueIndex = 0;

  // Use index-based iteration instead of shift() for O(n) performance
  // shift() is O(n) operation making overall complexity O(n²)
  while (queueIndex < queue.length) {
    const node = queue[queueIndex++]!;

    // Skip if we've already visited this node (circular reference)
    if (visited.has(node)) {
      continue;
    }
    visited.add(node);

    result.push(callback(node));

    if (node.children) {
      queue.push(...node.children);
    }
  }

  return result;
}