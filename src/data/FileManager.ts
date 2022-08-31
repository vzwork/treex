import app from './firebaseApp';
import { Database, getDatabase, onValue, push, ref, remove, set } from 'firebase/database';
import store from '../store'
import { setComments, setFile } from '../store/actions';
import { TreeManager } from './TreeManager';

export class FileManager {
  // vvv fields vvv
  db:Database; 
  // ^^^ fields ^^^

  // vvv Singleton vvv
  private static instance: FileManager;
  private constructor() {
    this.db = getDatabase(app);
  }
  public static getInstance(): FileManager {
    if (!FileManager.instance) {
      FileManager.instance = new FileManager();
    }
    return FileManager.instance;
  }
  // ^^^ Singleton ^^^

  public deleteNode(id:string) {
    const fileRef = ref(this.db, 'nodes/' + id)
    remove(fileRef)
  }

  public setBase(id:string) {
    const fileRef = ref(this.db, 'nodes/' + id + '/file/')
    onValue(fileRef, (snapshot) => {
      if (!snapshot.exists()) {
        set(fileRef, 'Permanent storage')
      } else {
        let file:string = snapshot.val()
        store.dispatch(setFile(file))
      }
    })
  }

  public updateFile(text:string) {
    const treeManager = TreeManager.getInstance()
    const nodeId = treeManager.recentNodes[0]
    const fileRef = ref(this.db, 'nodes/' + nodeId + '/file/')
    set(fileRef, text)
      .then((res) => {
        // chilling
      }).catch((err) => {
        console.log(err)
      })
  }
}