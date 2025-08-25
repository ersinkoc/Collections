import { TreeNode } from './TreeNode';
import { validateFunction } from '../../utils/validators';

/**
 * Traverses a tree in depth-first order.
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
 * traverseDepthFirst(tree, node => node.data); // Returns: ['root', 'child1', 'child2']
 * ```
 * 
 * @complexity O(n) - Where n is the number of nodes
 * @since 1.0.0
 */
export function traverseDepthFirst<T, U>(
  root: TreeNode<T> | null | undefined,
  callback: (node: TreeNode<T>) => U
): U[] {
  validateFunction(callback, 'callback');

  if (!root) {
    return [];
  }

  const result: U[] = [];
  const stack: TreeNode<T>[] = [root];

  while (stack.length > 0) {
    const node = stack.pop()!;
    result.push(callback(node));

    if (node.children) {
      for (let i = node.children.length - 1; i >= 0; i--) {
        stack.push(node.children[i]!);
      }
    }
  }

  return result;
}