export interface INodeReference {
  version: string
  id: string,
  name: string
}

export class NodeReference implements INodeReference {
  version: '1.0.1'
  id: string
  name: string

  constructor (id:string, name:string) {
    this.id = id
    this.name = name
  }
}

export interface INode {
  version: string,
  creationDateTime: number,
  creatorIds: string[],
  creatorId: string,
  creatorUserName: string
  parentReferences: NodeReference[],
  childrenReferences: NodeReference[],
  selfReference: NodeReference
}

export class Node implements INode {
  version:string = '1.0.1'
  creationDateTime: number
  creatorIds: string[]
  creatorId: string
  creatorUserName: string
  parentReferences: NodeReference[]
  childrenReferences: NodeReference[]
  selfReference: NodeReference

  constructor (
    creationDateTime: number,
    creatorIds: string[],
    creatorId: string,
    creatorUserName: string,
    parentReferences: NodeReference[],
    childrenRefernces: NodeReference[],
    selfReference: NodeReference
  ) {
    this.creationDateTime = creationDateTime
    this.creatorIds = creatorIds
    this.creatorId = creatorId
    this.creatorUserName = creatorUserName
    this.parentReferences = parentReferences
    this.childrenReferences = childrenRefernces
    this.selfReference = selfReference
  }
}

export const nodeConverter = {
  toFirestore: (node:Node) => {
    let parentReferencesObject:any = []
    node.parentReferences.forEach((reference) => {
      parentReferencesObject.push({
        id: reference.id,
        name: reference.name
      })
    })
    let childrenReferencesObject:any = []
    node.childrenReferences.forEach((reference) => {
      childrenReferencesObject.push({
        id: reference.id,
        name: reference.name
      })
    })
    let selfReferenceObject = {
      id: node.selfReference.id,
      name: node.selfReference.name
    }
    return {
      version: node.version,
      creationDateTime: node.creationDateTime,
      creatorIds: node.creatorIds,
      creatorId: node.creatorId,
      creatorUserName: node.creatorUserName,
      parentReferences: parentReferencesObject,
      childrenReferences: childrenReferencesObject,
      selfReference: selfReferenceObject
    }
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options)
    let parentReferencesArray:any = []
    data.parentReferences.forEach((reference) => {
      parentReferencesArray.push(new NodeReference(reference.id, reference.name))})
    let childrenReferencesArray:any = []
    data.childrenReferences.forEach((reference) => {
      childrenReferencesArray.push(new NodeReference(reference.id, reference.name))})
    let selfReferenceInstance = new NodeReference(
      data.selfReference.id,
      data.selfReference.name
    )
    return new Node(
      data.creationDateTime,
      data.creatorIds,
      data.creatorId,
      data.creatorUserName,
      parentReferencesArray,
      childrenReferencesArray,
      selfReferenceInstance
    )
  }  
}