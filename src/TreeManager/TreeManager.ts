// + getInstance()
//
// + attach()
// + detach()
// - notify()
//
// + setBaseId(id: string = DEFAULT_NODE_ID)
// + getBaseId(): string
//
// + hasNode(id: string): Boolean
// + getNode(id: string): Node
// + updateNodeWeb(node: Node)
// + updateNode(node: Node)
// + deleteNodeWeb(id: string)
// + deleteNode(id: string)
// - watchNode(id: string)
// - stopWatchingNode(id: string)

import { Subject } from '../Observer/Observer'
import { Observer } from '../Observer/Observer'

import { Node } from '../data/Node'
import { TreeComFirebase } from './TreeComFirebase'

export class TreeManager implements Subject {
  // vvv fields vvv
  observers: Set<Observer>
  nodes: Map<string, Node>
  badIds: Set<String>
  recentNodes: string[]
  baseId: string
  treeComFirebase: TreeComFirebase
  // ^^^ fields ^^^

  // vvv Singleton vvv
  private constructor() {
    this.observers = new Set()
    this.nodes = new Map()
    this.badIds = new Set()
    this.recentNodes = []
    this.treeComFirebase = TreeComFirebase.getInstance(this)
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
  public attach(observer: Observer) { this.observers.add(observer) }
  public detach(observer: Observer) { this.observers.delete(observer) }
  public notify() {
    console.log(this.nodes.size)
    this.observers.forEach((observer) => {
      observer.update(this)
    })
  }

  public setBaseId(id: string) {
    if (this.badIds.has(id)) {
      console.log('bruburuburuu')
      return
    }
    this.baseId = id
    this.treeComFirebase.watchNode(id)
    this.notify()
  }
  public getBaseId() { return this.baseId }
  public hasNode(id: string) {
    return this.nodes.has(id)
  }
  public getNode(id: string) {
    if (!this.hasNode(id)) { 
      this.recentNodes.unshift(id)
      if (this.nodes.size >= 10) {
        let lastId = this.recentNodes.pop()
        if (!lastId) { return }
        while(!this.nodes.has(lastId)) {
          lastId = this.recentNodes.pop()
          if (!lastId) { return }
        }
        this.stopWatchingNode(lastId)
      }
    }
    if (this.badIds.has(id)) {
      return
    }
    const local = this.nodes.get(id)
    if (!local) { this.watchNode(id); return }
    return local
  }

  public updateNodeWeb(node: Node) {
    this.treeComFirebase.updateNode(node)
    this.updateNode(node)
  }
  public updateNode(node: Node) {
    this.nodes.set(node.selfReference.id, node)
    this.notify()
  }

  public deleteNodeWeb(id: string) {
    this.treeComFirebase.deleteNode(id)
    this.deleteNode(id)
  }
  public deleteNode(id: string) {
    this.badIds.add(id)
    this.nodes.delete(id)
    this.stopWatchingNode(id)
    this.notify()
  }
  // ^^^ public methods ^^^

  // vvv private methods vvv
  private watchNode(id: string) {
    this.treeComFirebase.watchNode(id)
  }
  private stopWatchingNode(id: string) {
    this.nodes.delete(id)
    this.treeComFirebase.stopWatchingNode(id)
  } 
  // ^^^ private methods ^^^
}