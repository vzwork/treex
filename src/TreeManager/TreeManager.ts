// + getInstance()
//
// + addObserver(callback: () => void)
// + removeObserver(callback: () => void)
// - notifyObservers()
//
// + setBaseId(id: string = DEFAULT_NODE_ID)
// + getBaseId(): string
//
// + getNode(id: string): Node
// + updateNodeWeb(node: Node)
// + updateNode(node: Node)
// + deleteNodeWeb(id: string)
// + deleteNode(id: string)
// - watchNode(id: string)
// - stopWatchingNode(id: string)

import { Node } from '../data/Node'
import { TreeComFirebase } from './TreeComFirebase'

const DEFAULT_NODE_ID = 'KSLC3E9YXXNJNKx23LqV'

export class TreeManager {
  // vvv fields vvv
  observers: Set<(()=>void)>
  nodes: Map<string, Node>
  baseId: string
  firebaseCom: TreeComFirebase
  // ^^^ fields ^^^

  // vvv Singleton vvv
  private constructor() {
    this.observers = new Set()
    this.nodes = new Map()
    this.baseId = DEFAULT_NODE_ID
    this.firebaseCom = TreeComFirebase.getInstance(this)
  }
  private static instance: TreeManager
  public static getInstance(): TreeManager {
    if (!TreeManager.instance) {
      TreeManager.instance = new TreeManager()
    }
    return TreeManager.instance;
  }
  // ^^^ Singleton ^^^

  // vvv public methods vvv
  public addObserver(callback: (()=>void)) { this.observers.add(callback) }
  public removeObserver(callback: (()=>void)) { this.observers.delete(callback) }
  public notifyObservers () {
    this.observers.forEach((observer)=>{
      observer()
    })
  }

  public setBaseId(id: string) { 
    this.baseId = id 
    this.notifyObservers()
  }
  public getBaseId() { return this.baseId }

  public getNode(id: string) {
    const local = this.nodes.get(id)
    if (!local) { this.watchNode(id) }
    return local
  }
  public updateNodeWeb(node: Node) {
    this.firebaseCom.updateNode(node)
  }
  public updateNode(node: Node) {
    this.nodes.set(node.selfReference.id, node)
    this.notifyObservers()
  }
  public deleteNodeWeb(id: string) {
    this.firebaseCom.deleteNode(id)
  }
  public deleteNode(id: string) {
    this.nodes.delete(id)
    this.notifyObservers()
  }
  // ^^^ public methods ^^^

  // vvv private methods vvv
  private watchNode(id: string) {
    this.firebaseCom.watchNode(id)
  }
  private stopWatchingNode(id: string) {
    this.firebaseCom.stopWatchingNode(id)
  } 
  // ^^^ private methods ^^^
}