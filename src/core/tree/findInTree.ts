import { TreeNode } from './TreeNode';
import { validateFunction } from '../../utils/validators';

/**
 * Finds a node in a tree that matches a predicate.
 * Handles circular references by tracking visited nodes.
 *
 * @param root - Root node to start search from
 * @param predicate - Function to test each node
 * @returns First matching node or undefined
 * @throws {ValidationError} When predicate is not a function
 *
 * @example
 * ```typescript
 * const tree = createTreeNode('root', [
 *   createTreeNode('child1'),
 *   createTreeNode('target')
 * ]);
 * findInTree(tree, node => node.data === 'target'); // Returns: node with 'target'
 * ```
 *
 * @complexity O(n) - Where n is the number of nodes (worst case)
 * @since 1.0.0
 */
export function findInTree<T>(
  root: TreeNode<T> | null | undefined,
  predicate: (node: TreeNode<T>) => boolean
): TreeNode<T> | undefined {
  validateFunction(predicate, 'predicate');

  if (!root) {
    return undefined;
  }

  const queue: TreeNode<T>[] = [root];
  let queueIndex = 0;
  // Track visited nodes to prevent infinite loops from circular references
  const visited = new WeakSet<TreeNode<T>>();

  // Use index-based iteration instead of shift() for O(n) performance
  while (queueIndex < queue.length) {
    const node = queue[queueIndex++]!;

    // Skip already-visited nodes (circular reference protection)
    if (visited.has(node)) {
      continue;
    }
    visited.add(node);

    if (predicate(node)) {
      return node;
    }

    if (node.children) {
      queue.push(...node.children);
    }
  }

  return undefined;
}