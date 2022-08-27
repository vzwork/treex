import app from './firebaseApp'
import { INode, Node, nodeConverter, NodeReference } from './Node'
import { getFirestore, doc, onSnapshot, collection, setDoc, deleteDoc, Firestore, Unsubscribe } from 'firebase/firestore'
import { useDispatch } from 'react-redux'
import { setShelves, setBaseNode } from '../store/actions'
import store from '../store'
import { map } from '@firebase/util'

export class TreeManager {
  // vvv fields vvv
  numberOfNodesToWatch = 10
  defaultNodeId = 'KSLC3E9YXXNJNKx23LqV'
  db:Firestore
  nodes:Map<string, Node>
  names:Map<string, string>
  recentNodes:string[]
  updates:Map<string, Unsubscribe>
  // ^^^ fields ^^^

  // vvv Singleton vvv
  private static instance: TreeManager
  public static getInstance(): TreeManager {
    if (!TreeManager.instance) {
      TreeManager.instance = new TreeManager()
    }
    return TreeManager.instance;
  }
  private constructor() {
    this.db = getFirestore(app);
    this.nodes = new Map<string, Node>();
    this.names = new Map<string, string>();
    this.recentNodes = []; // [recent -> leastRecent]
    this.updates = new Map<string, Unsubscribe>();
  }
  // ^^^ Singleton ^^^

  public getName(id:string) {
    if (this.names.has(id)) { return this.names.get(id); }
    return '-----'; 
  }

  // redux taxes serializable forms of data, not NodeReference, we convert to array of ids
  private getIdFromReference(references:NodeReference[]) {
    const out:string[] = []
    references.forEach((reference) => {
      out.push(reference.id)
      this.names.set(reference.id, reference.name)
    })
    return out
  }

  public setBase(id:string) {
    // update history
    this.recentNodes.unshift(id)

    // make sure we have node data
    const nodeExistsLocally = this.nodes.has(id)
    if (!nodeExistsLocally) {
      // we leave the process to the download node
      // that is because we want updates to regenerate the tree
      // meaning on each update -downloadNode()- the tree will call -setBase()-
      this.downloadNode(id)
      return
    }

    const shelves:string[][] = []
    // build top shelf
    const base = this.nodes.get(id)
    if (!base) {
      console.log(`TreeManager.setBaseNode(): map has no data for id ${id}, unexpected!!!`)
      return
    }
    shelves.push(this.getIdFromReference(base.childrenReferences))
    // build mid shelf
    if (this.isRootNode(base)) {
      shelves.push([base.selfReference.id])
      this.names.set(base.selfReference.id, base.selfReference.name)
    } else {
      let parentNodeReferecne = base.parentReferences[0]
      let parentNodeId = parentNodeReferecne.id
      let parentNodeExistsLocally = this.nodes.has(parentNodeId)
      if (!parentNodeExistsLocally) {
        this.downloadNode(parentNodeId)
        return
      }
      let parentNode = this.nodes.get(parentNodeId)
      if (!parentNode) {
        console.log(`TreeManager.setBaseNode(): map has no data for id ${parentNodeId}, unexpected!!!`)
        return
      }

      // build the rest of bottom shelves
      // stop at root node or if reference is not downloaded
      while (parentNodeExistsLocally) {
        parentNode = this.nodes.get(parentNodeId)
        if (!parentNode) {
          console.log(`TreeManager.setBaseNode(): map has no data for id ${parentNodeId}, unexpected!!!`)
          return
        }
        if (this.isRootNode(parentNode)) {
          shelves.push(this.getIdFromReference(parentNode.childrenReferences))
          shelves.push([parentNode.selfReference.id])
          this.names.set(parentNode.selfReference.id, parentNode.selfReference.name)
          break
        } else {
          shelves.push(this.getIdFromReference(parentNode.childrenReferences))
        }
        // update while condiditon
        parentNodeId = parentNode.parentReferences[0].id // older parent
        parentNodeExistsLocally = this.nodes.has(parentNodeId) // older parent
        if (!parentNodeExistsLocally) { // same old parent
          shelves.push([parentNode.selfReference.id]) // one last push XD
        }
      }
    }
  
    store.dispatch(setShelves(shelves))
  }

  private stopUpdatingOneNode() {
    for (let i = this.recentNodes.length - 1; i >= 0; i--) {
      let currentId = this.recentNodes[i]
      this.recentNodes.pop()
      if (this.nodes.has(currentId)) {
        this.nodes.delete(currentId)
        const unsub = this.updates.get(currentId)
        this.updates.delete(currentId)
        if (!unsub) {
          console.log(`TreeManager.stopUpdatingOneNode(): unsub was none for id ${currentId}, unexpected!!!`)
        } else {
          unsub()
        }
        break
      }
    }
  }

  private async downloadNode (nodeId:string) {
    if (!nodeId) {
      console.log('TreeManager.downloadNode(): nodeId is null!')
      return
    }
    if (this.nodes.size >= this.numberOfNodesToWatch) {
      this.stopUpdatingOneNode()
    }
    const unsub = onSnapshot(doc(this.db, 'nodes', nodeId).withConverter(nodeConverter), (docSnap) => {
      const node = docSnap.data()
      if (!node) {
        console.log('TreeManager.downloadNode(): no data!')
        if (this.recentNodes.length > 1) {
          console.log('TreeManager.downloadNode(): try setting base from history!')
          this.recentNodes.shift()
          this.setBase(this.recentNodes[0])
          return
        } else {
          console.log('TreeManager.dowloadNode(): setting base to the default!')
          this.recentNodes = []
          this.setBase(this.defaultNodeId)
          return
        }
      }
      this.nodes.set(nodeId, node)
      this.setBase(this.recentNodes[0])
    })
    this.updates.set(nodeId, unsub)
  }

  public newChild(creatorId:string, 
                  creatorUserName:string,
                  newNodeName:string) {
    const parentId = this.recentNodes[0]
    const creationDateTime = Date.now()
    const parent = this.nodes.get(parentId)
    if (!parent) {
      console.log('TreeManager.createNewNode(): unexpected error, parent node doesn\'t exists locally')
      return false
    }
    const creatorIds = [...parent.creatorIds]
    creatorIds.unshift(creatorId)
    const parentReferences = [...parent.parentReferences]
    parentReferences.unshift(parent.selfReference)
    const childrenReferences = []
    const newNodeId = this.getNewId()
    const selfReference = new NodeReference(newNodeId, newNodeName)
    const newNode = new Node(creationDateTime,
            creatorIds,
            creatorId,
            creatorUserName,
            parentReferences,
            childrenReferences,
            selfReference)
    this.nodes.set(newNodeId, newNode)
    parent.childrenReferences.push(selfReference)
    this.uploadNode(parent)
    this.uploadNode(newNode)
    this.setBase(parentId)
  }


  public deleteBase() {
    const node = this.nodes.get(this.recentNodes[0])
    this.recentNodes.shift()
    if (!node) {
      console.log('TreeManager.deleteCurrentBaseNode(): unexpected error!')
      return
    }
    if (node.childrenReferences.length != 0) {
      alert('node must have no children')
      return
    }
    if (this.isRootNode(node)) {
      alert('cannot delete root node')
      return
    }
    // remove updates
    const unsub = this.updates.get(node.selfReference.id)
    if (!unsub) {
    } else {
      unsub()
    }
    this.updates.delete(node.selfReference.id)
    // remove locally
    this.nodes.delete(node.selfReference.id)
    // remove web
    deleteDoc(doc(this.db, 'nodes', node.selfReference.id))
      .then((res) => {
        // do nothing, success
      }).catch((err) => {
        console.log(err)
        alert(err.message)
      })
    // remove parent web reference -> updates locally -> rerenders
    const parent = this.nodes.get(node.parentReferences[0].id)
    if (!parent) {
      console.log('TreeManager.deleteCurrentBaseNode(): unexpected error!')
      return
    }
    const badReference = node.selfReference
    let badIndex = -1
    for (let [index, reference] of parent.childrenReferences.entries()) {
      if (reference.id == badReference.id) {
        badIndex = index
        break
      }
    }
    const newChidlrenReferences = [...parent.childrenReferences]
    if (badIndex !== -1) {
      newChidlrenReferences.splice(badIndex, 1)
    } else {
      console.log('TreeManager.deleteCurrentBaseNode(): bad index of to delete child reference!')
    }
    parent.childrenReferences = newChidlrenReferences
    this.nodes.set(parent.selfReference.id, parent)
    this.setBase(parent.selfReference.id)
    const parentRef = doc(this.db, 'nodes', parent.selfReference.id).withConverter(nodeConverter)
    setDoc(parentRef, parent)
      .then((res) => {
        // do nothing success
      }).catch((err) => {
        console.log(err)
        alert(err.message)
      })
    store.dispatch(setBaseNode(parent.selfReference.id))
  }

  private isRootNode (node:Node) {
    if (node.selfReference.id == node.parentReferences[0].id) {
      return true
    }
    return false
  }

  private getNewId () {
    const newNodeRef = doc(collection(this.db, 'nodes'))
    return newNodeRef.id
  }

  private uploadNode (node:Node) {
    const ref = doc(this.db, 'nodes', node.selfReference.id).withConverter(nodeConverter)
    setDoc(ref, node)
      .then((res) => {
        // success, do nothing
      }).catch((err) => {
        console.log(err)
        alert(err.message)
      })
  }
}