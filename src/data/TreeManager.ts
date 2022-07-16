import app from './firebaseApp';
import { ITreeNode } from './TreeNode';
import { INode, Node } from './Node';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, setDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { TreeNode, treeNodeConverter } from './TreeNode';

export class TreeManager {
  // vvv fields vvv
  app:FirebaseApp;
  db; 
  nodes:Map<string, ITreeNode>;
  topShelf:INode[];
  midShelf:INode[];
  botShelf:INode[];
  // ^^^ fields ^^^

  // vvv Singleton vvv
  private static instance: TreeManager;

  public static getInstance(): TreeManager {
    if (!TreeManager.instance) {
      TreeManager.instance = new TreeManager();
    }
    return TreeManager.instance;
  }

  private constructor() {
    this.app = app;
    this.db = getFirestore(app);
    this.nodes = new Map<string, ITreeNode>;
    this.topShelf = [];
    this.midShelf = [];
    this.botShelf = [];
  }
  // ^^^ Singleton ^^^

  private isRootNode(node:Node, treeNode:TreeNode):boolean {
    if (node.id == treeNode.parent.id){
      return true;
    }
    return false;
  }

  public hasTreeNode(node:Node) {
    return this.nodes.has(node.id);
  }

  public async downloadNode(base:INode) {
    const ref = doc(this.db, 'nodes', base.id).withConverter(treeNodeConverter);
    const docSnap = await getDoc(ref);
    if (!docSnap.exists()) {
      console.log('TreeManager.downloadNode(): docSnap not exists');
      return false;
    } else {
      const treeNode = docSnap.data();
      if (!treeNode) {
        console.log('TreeManager.downloadNode(): treeNode is null');
        return false;
      } else {
        const newTreeNode = {
          parent: treeNode.parent,
          children: treeNode.children
        }
        this.nodes.set(base.id, newTreeNode);
        return true;
      }
    }
  }

  public async setBaseNode(node:INode) {
    const nodeExistsLocally = this.nodes.has(node.id);
    if (!nodeExistsLocally) {
      const existsOnWeb = await this.downloadNode(node);
      if (!existsOnWeb) {
        console.log('TreeManager.setBaseNode(): node has no web data!');
        return false;
      }
    }
    // populate top shelf
    const treeNode = this.nodes.get(node.id);
    if (!treeNode) {
      console.log('TreeManager.setBaseNode(): after download node doesn\'t exist locally. Unexpected!');
      return false;
    } else {
      const topShelf = treeNode.children;
      if (!topShelf) {
        console.log('TreeManager.setBaseNode(): topShelf is null. Unexpected!');
        return false;
      } else {
        this.topShelf = topShelf;

        // populate mid shelf
        if (this.isRootNode(node, treeNode)){
          this.midShelf = [node];
          this.botShelf = [];
          return true;
        }
        const parentNode = treeNode.parent;
        if (!parentNode) {
          console.log('TreeManager.setBaseNode(): parentNode is null. Unexpected!');
          return false;
        } else {
          const parentNodeExistsLocally = this.nodes.has(parentNode.id);
          if (!parentNodeExistsLocally) {
            const parentExistsOnWeb = await this.downloadNode(parentNode);
            if (!parentExistsOnWeb) {
              console.log('TreeManager.setBaseNode(): parentNode has no web data!');
              return false;
            }
          }
          const parentTreeNode = this.nodes.get(parentNode.id);
          if (!parentTreeNode) {
            console.log('TreeManager.setBaseNode(): parentTreeNode is null. Unexpected!');
            return false;
          } else {
            const midShelf = parentTreeNode.children;
            if (!midShelf) {
              console.log('TreeManager.setBaseNode(): midShelf is null. Unexpected!');
              return false;
            } else {
              this.midShelf = midShelf;

              // populate bot shelf
              if (this.isRootNode(parentNode, parentTreeNode)) {
                this.botShelf = [parentNode];
                return true;
              }
              const parentParentNode = parentTreeNode.parent;
              if (!parentParentNode) {
                console.log('TreeManager.setBaseNode(): parentParentNode is null. Unexpected!');
                return false;
              } else {
                const parentParentNodeExistsLocally = this.nodes.has(parentParentNode.id);
                if (!parentParentNodeExistsLocally){
                  const parentParentExistsOnWeb = await this.downloadNode(parentParentNode);
                  if (!parentParentExistsOnWeb) {
                    console.log('TreeManager.setBaseNode(): parentParentNode has no web data!');
                    return false;
                  }
                }
                const parentParentTreeNode = this.nodes.get(parentParentNode.id);
                if (!parentParentTreeNode) {
                  console.log('TreeManager.setBaseNode: parentParentTreeNode is null. Unexpected!');
                  return false;
                } else {
                  const botShelf = parentParentTreeNode.children;
                  if (!botShelf) {
                    console.log('TreeManager.setBaseNode(): botShelf is null. Unexpected!');
                    return false;
                  } else {
                    this.botShelf = botShelf;
                    return true;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  public async updateNode(id:string) {
    const ref = doc(this.db, 'nodes', id).withConverter(treeNodeConverter);
    const node = this.nodes.get(id);
    if (!!node) {
      const parent = node.parent;
      const children = node.children;
      if (!!children) {
        await setDoc(ref, new TreeNode(parent, children));
      }
    }
  }

  public async uploadNode(base:INode, name:string) {
    // load new node -> get back id
    const ref = collection(this.db, 'nodes').withConverter(treeNodeConverter);
    const docRef = await addDoc(ref, new TreeNode(base, []));
    if (!!docRef) {
      // update local TreeNode with new child
      const newChild = new Node(docRef.id, name);
      const treeNode = this.nodes.get(base.id);
      if (!!treeNode) {
        treeNode.children.push(newChild);
        this.nodes.set(base.id, treeNode);
      } else {
        console.log('Base reference doesn\'t exist!')
      }
      // add new TreeNode for that child
      const newTreeNode:ITreeNode = {
        parent: base,
        children: []
      }
      this.nodes.set(docRef.id, newTreeNode);
      // update base node on firebase
      this.updateNode(base.id);
    }
  }

  public getParent(node:INode):INode {
    const treeNode = this.nodes.get(node.id);
    if (!treeNode) {
      console.log('TreeManager.getParent(): treeNode is null.');
      return node;
    } else {
      return treeNode.parent;
    }
  }

  public async deleteNode(node:INode) {
    if (this.nodes.has(node.id)) {
      const treeNode = this.nodes.get(node.id);
      if (!!treeNode) {
        // if treeNode has children abort (not supported funcitonality yet)
        if (treeNode.children.length > 0) {
          console.log('Cannot delete node that has children!');
          console.log('Functionality is not yet supported!');
          return;
        }

        // if TreeNode exists delete it
        this.nodes.delete(node.id);
        // remove reference from the parent node
        const parentNode = treeNode.parent;
        if (!!parentNode) {
          const parentTreeNode = this.nodes.get(parentNode.id);
          if (!!parentTreeNode) {
            const parentChildren = parentTreeNode.children;
            let newParentChildren:INode[] = [];
            parentChildren.forEach((child) => {
              if (child.id != node.id) {
                newParentChildren.push(child);
              }
            });
            parentTreeNode.children = newParentChildren;
            this.nodes.set(parentNode.id, parentTreeNode);

            // update parent node with no reference
            await this.updateNode(parentNode.id);

            // delete TreeNode from the firebase
            await deleteDoc(doc(this.db, 'nodes', node.id));
          }
        }
      }
    }
  }
}