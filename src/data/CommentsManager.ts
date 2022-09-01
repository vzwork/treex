import app from './firebaseApp';
import { FirebaseApp } from 'firebase/app';
import { Database, get, getDatabase, onValue, push, ref, remove, set } from 'firebase/database';
import store from '../store'
import { setComments } from '../store/actions';
import { TreeManager } from './TreeManager';

const commentsSizeLimit = 30;

export class CommentsManager {
  // vvv fields vvv
  db:Database; 
  // ^^^ fields ^^^

  // vvv Singleton vvv
  private static instance: CommentsManager;
  private constructor() {
    this.db = getDatabase(app);
  }
  public static getInstance(): CommentsManager {
    if (!CommentsManager.instance) {
      CommentsManager.instance = new CommentsManager();
    }
    return CommentsManager.instance;
  }
  // ^^^ Singleton ^^^

  public deleteNode(id:string) {
    const commentsRef = ref(this.db, 'nodes/' + id)
    remove(commentsRef)
  }

  public setBase(id:string) {
    const commentsRef = ref(this.db, 'nodes/' + id + '/comments/')
    const greetingValues = [
      'Free your ideas!',
      'Your ideas... gotta share \'em...',
      'Brilliant, don\'t stop thinking!',
      'This one is it, chief! Exactly it!',
      'There is an idea here, you are the one to write it down though!'
    ]
    onValue(commentsRef, (snapshot) => {
      if (!snapshot.exists()) {
        set(commentsRef, 
          [{
            date: Date.now(),
            uId: 'NqT5XjbHvFVDobcNW9KVhd4Zsgz1',
            uName: 'admin',
            text: greetingValues[(Math.floor(Math.random() * greetingValues.length))]
          }]
        )
      } else {
        let comments:any[] = []
        if (snapshot.size > commentsSizeLimit) {
          let out:any[] = []
          snapshot.forEach((comment) => {
            out.push(comment.val())
          })
          out = out.slice(-commentsSizeLimit)
          set(commentsRef, out)
        }
        snapshot.forEach((comment) => {
          const data = comment.val()
          comments.push(data)
        })
        store.dispatch(setComments(comments))
      }
    })
  }

  public addComment(text:string) {
    const treeManager = TreeManager.getInstance()
    const nodeId = treeManager.recentNodes[0]
    const commentsRef = ref(this.db, 'nodes/' + nodeId + '/comments/')
    const comment = {
      date: Date.now(),
      uId: store.getState().profileReducer.userId,
      uName: store.getState().profileReducer.userName,
      text
    }
    push(commentsRef, comment)
      .then((res) => {
        // chilling
      }).catch((err) => {
        console.log(err)
      })
  }
}