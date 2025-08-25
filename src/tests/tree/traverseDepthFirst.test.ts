import { traverseDepthFirst } from '../../core/tree/traverseDepthFirst';
import { createTreeNode } from '../../core/tree/TreeNode';
import { ValidationError } from '../../utils/errors';

describe('traverseDepthFirst', () => {
  test('should traverse simple tree depth first', () => {
    const tree = createTreeNode('root', [
      createTreeNode('child1'),
      createTreeNode('child2')
    ]);
    
    const result = traverseDepthFirst(tree, node => node.data);
    
    expect(result).toEqual(['root', 'child1', 'child2']);
  });

  test('should traverse nested tree depth first', () => {
    const tree = createTreeNode('root', [
      createTreeNode('child1', [
        createTreeNode('grandchild1'),
        createTreeNode('grandchild2')
      ]),
      createTreeNode('child2', [
        createTreeNode('grandchild3')
      ])
    ]);
    
    const result = traverseDepthFirst(tree, node => node.data);
    
    expect(result).toEqual(['root', 'child1', 'grandchild1', 'grandchild2', 'child2', 'grandchild3']);
  });

  test('should handle single node', () => {
    const tree = createTreeNode('single');
    
    const result = traverseDepthFirst(tree, node => node.data);
    
    expect(result).toEqual(['single']);
  });

  test('should handle null root', () => {
    const result = traverseDepthFirst(null, node => node.data);
    expect(result).toEqual([]);
  });

  test('should handle undefined root', () => {
    const result = traverseDepthFirst(undefined, node => node.data);
    expect(result).toEqual([]);
  });

  test('should transform node data with callback', () => {
    const tree = createTreeNode(1, [
      createTreeNode(2),
      createTreeNode(3)
    ]);
    
    const result = traverseDepthFirst(tree, node => node.data * 2);
    
    expect(result).toEqual([2, 4, 6]);
  });

  test('should pass complete node to callback', () => {
    const tree = createTreeNode('root', [
      createTreeNode('child')
    ]);
    
    const callback = jest.fn().mockReturnValue('test');
    
    traverseDepthFirst(tree, callback);
    
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback.mock.calls[0][0]).toHaveProperty('data', 'root');
    expect(callback.mock.calls[1][0]).toHaveProperty('data', 'child');
  });

  test('should handle complex nested structure', () => {
    const tree = createTreeNode('A', [
      createTreeNode('B', [
        createTreeNode('D'),
        createTreeNode('E', [
          createTreeNode('H'),
          createTreeNode('I')
        ])
      ]),
      createTreeNode('C', [
        createTreeNode('F'),
        createTreeNode('G')
      ])
    ]);
    
    const result = traverseDepthFirst(tree, node => node.data);
    
    expect(result).toEqual(['A', 'B', 'D', 'E', 'H', 'I', 'C', 'F', 'G']);
  });

  test('should validate callback parameter', () => {
    const tree = createTreeNode('test');
    
    expect(() => traverseDepthFirst(tree, null as any)).toThrow(ValidationError);
    expect(() => traverseDepthFirst(tree, undefined as any)).toThrow(ValidationError);
    expect(() => traverseDepthFirst(tree, 'not-function' as any)).toThrow(ValidationError);
  });

  test('should handle tree with no children property', () => {
    const tree = { data: 'root' };
    
    const result = traverseDepthFirst(tree, node => node.data);
    
    expect(result).toEqual(['root']);
  });

  test('should handle tree with empty children array', () => {
    const tree = createTreeNode('root');
    tree.children = [];
    
    const result = traverseDepthFirst(tree, node => node.data);
    
    expect(result).toEqual(['root']);
  });

  test('should handle callback throwing error', () => {
    const tree = createTreeNode('test');
    const error = new Error('Callback failed');
    const failingCallback = () => {
      throw error;
    };
    
    expect(() => traverseDepthFirst(tree, failingCallback)).toThrow('Callback failed');
  });
});