import { TreeNode } from './TreeNode';
import { validateFunction } from '../../utils/validators';

/**
 * Traverses a tree in breadth-first order.
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

  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(callback(node));

    if (node.children) {
      queue.push(...node.children);
    }
  }

  return result;
}