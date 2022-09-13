// + watchNode(id: string)
// + stopWatchingNode(id: string)
//
// + updateNode(node: Node)
//
// + deleteNode(node: Node)

import { TreeManager } from "./TreeManager";
import { Node } from "../data/Node";

export class TreeComFirebase {
  // vvv fields vvv
  static treeManager: TreeManager
  // ^^^ fields ^^^

  // vvv Singleton vvv
  private constructor() {
  }
  private static instance: TreeComFirebase
  public static getInstance(treeManager: TreeManager): TreeComFirebase {
    if (!TreeComFirebase.instance) {
      TreeComFirebase.instance = new TreeComFirebase()
    }
    this.treeManager = treeManager
    return TreeComFirebase.instance
  }
  // ^^^ Singleton ^^^

  // vvv public methods vvv
  public watchNode(id: string) {

  }
  public stopWatchingNode(id: string) {
    
  }
  public updateNode(node: Node) {

  }
  public deleteNode(id: string) {

  }
  // ^^^ public methods ^^^
}