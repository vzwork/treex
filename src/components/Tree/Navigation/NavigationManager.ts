import { NodeReference } from "../../../data/Node";
import { Observer, Subject } from "../../../Observer/Observer";
import { TreeManager } from "../../../TreeManager/TreeManager";


export class NavigationManager implements Observer {
  // vvv fields vvv
  private static callback: (([])=>void)
  private treeManager: TreeManager
  // ^^^ fields ^^^

  // vvv Singleton vvv
  private constructor() {
    this.treeManager = TreeManager.getInstance()
    this.treeManager.attach(this)
  }
  private static instance: NavigationManager
  public static getInstance(callback: (([])=>void)): NavigationManager {
    if (!NavigationManager.instance) {
      NavigationManager.instance = new NavigationManager()
    }
    this.callback = callback
    return NavigationManager.instance;
  }
  // ^^^ Singleton ^^^

  // vvv public methods vvv
  public update(subject: Subject) {
    const baseId = this.treeManager.getBaseId()
    this.buildShelves(baseId)
  }
  // ^^^ public methods ^^^

  // vvv private methods vvv
  private buildShelves(baseId: string) {
    let out:NodeReference[][] = []
    let base = this.treeManager.getNode(baseId)
    if (!base) return
    // on success use callback to build UI
    out.push(base.childrenReferences)
    NavigationManager.callback(out)
    let parentId = base.parentReferences[0].id
    if (parentId == baseId) { // root node check
      out.push([base.selfReference])
      NavigationManager.callback(out)
    } else {
      let parent = this.treeManager.getNode(parentId)
      if (!parent) return
      out.push(parent.childrenReferences)
      NavigationManager.callback(out)

      // continue 3rd shelf and down
      baseId = parent.selfReference.id
      base = parent
      parentId = base.parentReferences[0].id
      while(true) {
        if (baseId == parentId) { // root check
          out.push([base.selfReference])
          NavigationManager.callback(out)
          break
        }
        if (!this.treeManager.hasNode(parentId)) { // all local nodes have been used
          out.push([base.parentReferences[0]])
          NavigationManager.callback(out)
          break
        }
        parent = this.treeManager.getNode(parentId)
        if (!parent) {
          console.log('NavigationManager.buildShelves(): couldn\'t get node from TreeManager')
          break
        }
        out.push(parent.childrenReferences)
        baseId = parent.selfReference.id
        base = parent
        parentId = base.parentReferences[0].id
      }
    }
  }
  // ^^^ private methods ^^^
}