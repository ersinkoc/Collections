import { TreeNode } from './TreeNode';
import { deepClone } from '../object/deep-clone';

/**
 * Creates a deep clone of a tree with circular reference detection.
 *
 * @param root - Root node to clone
 * @param seen - WeakMap to track visited nodes (internal use)
 * @returns Deep clone of the tree
 *
 * @example
 * ```typescript
 * const original = createTreeNode('root', [
 *   createTreeNode('child')
 * ]);
 * const clone = cloneTree(original);
 * // clone is a complete copy, modifications won't affect original
 *
 * // Handles circular references
 * const parent = createTreeNode('parent');
 * const child = createTreeNode('child');
 * parent.children = [child];
 * child.parent = parent;
 * child.children = [parent]; // circular reference
 * const cloned = cloneTree(parent); // Works without stack overflow
 * ```
 *
 * @complexity O(n) - Where n is the number of nodes
 * @since 1.0.0
 */
export function cloneTree<T>(
  root: TreeNode<T> | null | undefined,
  seen: WeakMap<TreeNode<T>, TreeNode<T>> = new WeakMap()
): TreeNode<T> | undefined {
  if (!root) {
    return undefined;
  }

  // Check for circular reference
  if (seen.has(root)) {
    return seen.get(root);
  }

  const clonedChildren: TreeNode<T>[] = [];

  // Create the cloned root early and add to seen map
  const clonedRoot: TreeNode<T> = {
    data: deepClone(root.data),
    children: undefined
  };
  seen.set(root, clonedRoot);

  if (root.children) {
    for (const child of root.children) {
      const clonedChild = cloneTree(child, seen);
      if (clonedChild) {
        clonedChildren.push(clonedChild);
      }
    }
  }

  clonedRoot.children = clonedChildren.length > 0 ? clonedChildren : undefined;

  clonedChildren.forEach(child => {
    child.parent = clonedRoot;
  });

  return clonedRoot;
}