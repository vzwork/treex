// + watchNode(id: string)
// + stopWatchingNode(id: string)
//
// + getNewNodeId(): string
// + updateNode(node: Node)
// + deleteNode(node: Node)

import app from "../data/firebaseApp";
import { TreeManager } from "./TreeManager";
import { Node, nodeConverter } from "../data/Node";
import { onSnapshot, Unsubscribe, doc, Firestore, getFirestore, setDoc, collection, deleteDoc } from "firebase/firestore";

export class TreeComFirebase {
  // vvv fields vvv
  static treeManager: TreeManager
  db: Firestore
  updates: Map<string, Unsubscribe>
  // ^^^ fields ^^^

  // vvv Singleton vvv
  private constructor() {
    this.db = getFirestore(app)
    this.updates = new Map()
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
    if (!id) { console.log('TreeComFirebase.watchNode(): id is null!'); return }
    const unsub = onSnapshot(doc(this.db, 'nodes', id).withConverter(nodeConverter), (docSnap) => {
      const node = docSnap.data()
      // node got deleted
      if (!node) {
        TreeComFirebase.treeManager.deleteNode(id)
        unsub()
        return
      }
      TreeComFirebase.treeManager.updateNode(node)
    })
    this.updates.set(id, unsub)
  }
  public stopWatchingNode(id: string) {
    const unsub = this.updates.get(id)
    if (!unsub) { return }
    unsub()
  }
  public getNewNodeId() {
    const newNodeRef = doc(collection(this.db, 'nodes'))
    return newNodeRef.id
  }
  public updateNode(node: Node) {
    const ref = doc(this.db, 'nodes', node.selfReference.id).withConverter(nodeConverter)
    setDoc(ref, node)
      .then((res) => {
        // success
      }).catch((err) => [
        console.log(err)
      ])
  }
  public deleteNode(id: string) {
    deleteDoc(doc(this.db, 'nodes', id))
      .then((res) => {
        // success
      }).catch((err) => {
        console.log(err)
      })
  }
  // ^^^ public methods ^^^
}