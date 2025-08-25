import { TreeNode } from './TreeNode';

/**
 * Creates a deep clone of a tree.
 * 
 * @param root - Root node to clone
 * @returns Deep clone of the tree
 * 
 * @example
 * ```typescript
 * const original = createTreeNode('root', [
 *   createTreeNode('child')
 * ]);
 * const clone = cloneTree(original);
 * // clone is a complete copy, modifications won't affect original
 * ```
 * 
 * @complexity O(n) - Where n is the number of nodes
 * @since 1.0.0
 */
export function cloneTree<T>(root: TreeNode<T> | null | undefined): TreeNode<T> | undefined {
  if (!root) {
    return undefined;
  }

  const clonedChildren: TreeNode<T>[] = [];

  if (root.children) {
    for (const child of root.children) {
      const clonedChild = cloneTree(child);
      if (clonedChild) {
        clonedChildren.push(clonedChild);
      }
    }
  }

  const clonedRoot: TreeNode<T> = {
    data: root.data,
    children: clonedChildren.length > 0 ? clonedChildren : undefined
  };

  clonedChildren.forEach(child => {
    child.parent = clonedRoot;
  });

  return clonedRoot;
}