import { NodeReference } from "./Node";

export interface INameAndParents {
  version: string,
  name: string,
  parents: NodeReference[]
}

export class NameAndParents implements INameAndParents {
  version:string = '1.0.1'
  name: string
  parents: NodeReference[]

  constructor (name:string, parents:NodeReference[]) {
    this.name = name
    this.parents = parents
  }
}

export const nameAndParentsConverter = {
  toFirestore: (nap:NameAndParents) => {
    let parentReferencesObject: any = []
    nap.parents.forEach((reference) => {
      parentReferencesObject.push({
        id: reference.id,
        name: reference.name
      })
    })
    return {
      version: nap.version,
      name: nap.name,
      parents: parentReferencesObject
    }
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options)
    let parents:any[] = []
    data.parents.forEach((reference) => {
      parents.push(new NodeReference(reference.id, reference.name))
    })
    return new NameAndParents (data.name, parents)
  }
}