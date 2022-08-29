import app from './firebaseApp'
import { Node, nodeConverter, NodeReference } from './Node'
import { getFirestore, doc, onSnapshot, collection, setDoc, deleteDoc, Firestore, Unsubscribe, getDoc } from 'firebase/firestore'
import { useDispatch } from 'react-redux'
import { setShelves, setBaseNode, setHistory } from '../store/actions'
import store from '../store'

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
    })
    return out
  }

  private setNameFromReference(references:NodeReference[]) {
    references.forEach((reference) => {
      this.names.set(reference.id, reference.name)
    })
  }

  public async setBase(id:string) {
    if (!id) { console.log(`TreeManager.setBase(): what is this (${id})`); return }

    if (id === 'history') {
      const history = store.getState().treeReducer.history
      if (!history) {
        console.log('history was not made that day')
        this.setBase(this.defaultNodeId)
        return
      } else {
        if (history.length == 0) {
          console.log('first time history is empty')
          this.setBase(this.defaultNodeId)
          return
        } else {
          this.recentNodes = history
          this.setBase(this.recentNodes[0])
          return
        }
      }
    }

    const nodeExistsLocally = this.nodes.has(id)
    if (!nodeExistsLocally) {
      const goodDownload = await this.downloadNode(id)
      if (!goodDownload) {
        if (this.recentNodes.length > 0) {
          this.setBase(this.recentNodes[0])
          return
        } else {
          this.setBase(this.defaultNodeId)
        }
      }
      this.udpateNode(id)
    }
    const shelves:string[][] = []
    this.names.clear()

    // build top shelf
    const base = this.nodes.get(id)
    if (!base) { console.log(`TreeManager.setBase(): no local instance of ${id}`); return }
    shelves.push(this.getIdFromReference(base.childrenReferences))
    this.setNameFromReference(base.childrenReferences)
    
    // build mid shelf
    const isRoot = this.isRoot(base)
    if (isRoot) {
      shelves.push([base.selfReference.id])
      this.names.set(base.selfReference.id, base.selfReference.name)
    } else {
      let parentId = base.parentReferences[0].id
      let parentNodeExistsLocally = this.nodes.has(parentId)
      if (!parentNodeExistsLocally) {
        const goodDownload = await this.downloadNode(parentId)
        if (!goodDownload) {
          // you should always be able to download parent, if child was downloaded, criticall error
          console.log(`TreeManager.setBase(): criticall error, parent not availbe on web. Id (${parentId})`)
          this.setBase(this.defaultNodeId)
          return
        }
        this.udpateNode(id)
      }
      let parent = this.nodes.get(parentId)
      if (!parent) { console.log(`Treemanager.setBase(): no local isntance of id ${parentId}`); return}

      // build the rest of bottom shelves
      // stop at root node or if reference is not downloaded
      while (parentNodeExistsLocally) {
        parent = this.nodes.get(parentId)
        if (!parent) {
          console.log(`TreeManager.setBaseNode(): map has no data for id ${parentId}, unexpected!!!`)
          return
        }
        if (this.isRoot(parent)) {
          shelves.push(this.getIdFromReference(parent.childrenReferences))
          this.setNameFromReference(parent.childrenReferences)
          shelves.push([parent.selfReference.id])
          this.names.set(parent.selfReference.id, parent.selfReference.name)
          break
        } else {
          shelves.push(this.getIdFromReference(parent.childrenReferences))
          this.setNameFromReference(parent.childrenReferences)
        }
        // update while condiditon
        parentId = parent.parentReferences[0].id // older parent
        parentNodeExistsLocally = this.nodes.has(parentId) // older parent
        if (!parentNodeExistsLocally) { // same old parent
          shelves.push([parent.selfReference.id]) // one last push XD
          this.names.set(parent.selfReference.id, parent.selfReference.name)
        }
      }
    }
    store.dispatch(setShelves(shelves))
    if (this.recentNodes[0] != id) {
      this.recentNodes.unshift(id)
      if (this.recentNodes.length > 20) {
        this.stopUpdatingOneNode()
      }
      store.dispatch(setHistory(this.recentNodes))
    }
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

  private async downloadNode (id:string) {
    if (!id) { console.log(`TreeManager.downloadNode(): what is this id (${id})`); return false }
    const docRef = doc(this.db, 'nodes', id).withConverter(nodeConverter)
    await getDoc(docRef)
      .then((res) => {
        const node = res.data()
        if (!node) { console.log(`TreeManager.downloadNode(): what is this node (${node})`); return false }
        this.nodes.set(id, node)
      }).catch((err) => {
        console.log(err)
        alert(err.message)
      })
    return true
  }

  private async udpateNode (id:string) {
    if (!id) { console.log('TreeManager.updateNode(): id is null!'); return }
    if (this.nodes.size >= this.numberOfNodesToWatch) { this.stopUpdatingOneNode() }
    const unsub = onSnapshot(doc(this.db, 'nodes', id).withConverter(nodeConverter), (docSnap) => {
      const node = docSnap.data()
      // node got deleted
      if (!node) {
        console.log(`TreeManager.updateNode(): node got deleted id (${id})`)
        this.nodes.delete(id)
        if (this.recentNodes.length > 1) {
          this.recentNodes.shift()
          this.setBase(this.recentNodes[0])
        } else {
          this.setBase(this.defaultNodeId)
        }
        unsub()
        return
      }
      const localNode = this.nodes.get(id)
      // node was updated
      if (localNode !== node) {
        this.nodes.set(id, node)
        if (this.recentNodes.length > 0) {
          this.setBase(this.recentNodes[0])
        } else {
          this.setBase(this.defaultNodeId)
        }
      }
    })
    this.updates.set(id, unsub)
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
    console.log(this.recentNodes)
    store.dispatch(setHistory(this.recentNodes))
    if (!node) {
      console.log('TreeManager.deleteCurrentBaseNode(): unexpected error!')
      return
    }
    if (node.childrenReferences.length != 0) {
      alert('node must have no children')
      return
    }
    if (this.isRoot(node)) {
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

  private isRoot (node:Node) {
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