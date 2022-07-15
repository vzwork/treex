export interface INode {
  id: string,
  name: string
}

export class Node implements INode {
  id:string;
  name:string;
  constructor (id:string, name:string) {
    this.id = id;
    this.name = name
  }
}

export const nodeConverter = {
  toFirestore: (node:Node) => {
    return {
      id: node.id,
      name: node.name
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Node(data.id, data.name);
  }
}