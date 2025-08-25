import { TreeNode } from './TreeNode';

/**
 * Gets the maximum depth of a tree.
 * 
 * @param root - Root node to measure
 * @returns Maximum depth (root has depth 1)
 * 
 * @example
 * ```typescript
 * const tree = createTreeNode('root', [
 *   createTreeNode('child', [
 *     createTreeNode('grandchild')
 *   ])
 * ]);
 * getTreeDepth(tree); // Returns: 3
 * ```
 * 
 * @complexity O(n) - Where n is the number of nodes
 * @since 1.0.0
 */
export function getTreeDepth<T>(root: TreeNode<T> | null | undefined): number {
  if (!root) {
    return 0;
  }

  if (!root.children || root.children.length === 0) {
    return 1;
  }

  let maxChildDepth = 0;
  for (const child of root.children) {
    const childDepth = getTreeDepth(child);
    maxChildDepth = Math.max(maxChildDepth, childDepth);
  }

  return 1 + maxChildDepth;
}