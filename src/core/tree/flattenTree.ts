import { TreeNode } from './TreeNode';

/**
 * Flattens a tree into an array of values.
 * 
 * @param root - Root node to flatten
 * @returns Array of all node data in depth-first order
 * 
 * @example
 * ```typescript
 * const tree = createTreeNode('root', [
 *   createTreeNode('child1'),
 *   createTreeNode('child2')
 * ]);
 * flattenTree(tree); // Returns: ['root', 'child1', 'child2']
 * ```
 * 
 * @complexity O(n) - Where n is the number of nodes
 * @since 1.0.0
 */
export function flattenTree<T>(root: TreeNode<T> | null | undefined): T[] {
  if (!root) {
    return [];
  }

  const result: T[] = [root.data];

  if (root.children) {
    for (const child of root.children) {
      result.push(...flattenTree(child));
    }
  }

  return result;
}