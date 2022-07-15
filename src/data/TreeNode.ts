import { INode, Node, nodeConverter } from './Node';

export interface ITreeNode {
  children: INode[],
  parent: INode
}

export class TreeNode implements ITreeNode {
  children: INode[];
  parent: INode;

  constructor (parent:INode, children:INode[]) {
    this.children = children;
    this.parent = parent;
  }
}

export const treeNodeConverter = {
  toFirestore: (fireNode:TreeNode) => {
    let children:Object[] = [];
    fireNode.children.forEach((child) => {
      children.push(nodeConverter.toFirestore(child));
    });
    return {
      children: children,
      parent: fireNode.parent
    };
  },
  fromFirestore: (snapshot, options):TreeNode => {
    const data = snapshot.data(options);
    let children:INode[] = [];
    data.children.forEach((child) => {
      children.push(new Node(child.id, child.name));
    });
    const parent:INode = {id:data.parent.id, name:data.parent.name};  
    return new TreeNode(parent, children);
  }
}