import app from './firebaseApp';
import { FirebaseApp } from 'firebase/app';
import { getDatabase, onValue, push, ref, set } from 'firebase/database';

export class CommentsManager {
  // vvv fields vvv
  app:FirebaseApp;
  db; 
  // ^^^ fields ^^^

  // vvv Singleton vvv
  private static instance: CommentsManager;
  private constructor() {
    this.app = app;
    this.db = getDatabase(app);
  }
  public static getInstance(): CommentsManager {
    if (!CommentsManager.instance) {
      CommentsManager.instance = new CommentsManager();
    }
    return CommentsManager.instance;
  }
  // ^^^ Singleton ^^^

  public updatesForNode(nodeId, callback) {
    const nodeCommentsRef = ref(this.db, 'nodes/' + nodeId);
    onValue(nodeCommentsRef, (snapshot) => {
      if (!snapshot.exists()) {
        console.log('First person to comment!');
        let date = new Date();
        set(nodeCommentsRef, {
            comments: [
              {
                date: date.getTime().toString(),
                uId: '88888888',
                uName: 'admin',
                text: 'first comment!'
              }
            ]
        });
      } else {
        callback(snapshot.val().comments);
      }
    })
  }

  public addComment(nodeId, uId, uName, text) {
    const nodeCommentsRef = ref(this.db, 'nodes/' + nodeId + '/comments/');
    let date = new Date();
    const comment = {
      date: date.getTime().toString(),
      uId: uId,
      uName: uName,
      text: text
    }
    push(nodeCommentsRef, comment)
    .then(() => {
      console.log('success');
    })
    .catch((err) => {
      console.log(err);
    })
  }
}