import { doc, Firestore, getDoc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import app from "./firebaseApp";
import store from '../store'
import { Unsubscribe } from "firebase/app-check";
import { setFirstName, setLastName, setUserId, setUserName } from "../store/actions";
import { nameAndParentsConverter } from "./NameAndParents";
import { TreeManager } from "./TreeManager";


export class ProfileManager {
  // vvv fields vvv
  db:Firestore
  lastUnsub:Unsubscribe
  // ^^^ fields ^^^

  // vvv singleton vvv
  private static instance:ProfileManager
  private constructor () {
    this.db = getFirestore(app)
  }
  public static getInstance() {
    if (!ProfileManager.instance) {
      ProfileManager.instance = new ProfileManager()
    }
    return ProfileManager.instance
  }
  // ^^^ singleton ^^^

  public async getName(id:string) {
    const treeManager = TreeManager.getInstance()
    if (treeManager.names.has(id)) {
      return treeManager.names.get(id)
    } else {
      return await this.getNameWeb(id)
    }
  }
  
  private async getNameWeb(id:string) {
    const docRef = doc(this.db, 'nameAndParents', id).withConverter(nameAndParentsConverter)
    return await getDoc(docRef)
      .then((res) => {
        const nap = res.data()
        if (!nap) {
          console.log('id', id)
          console.log(nap)
          console.log('ProfileManager.getNameWeb(): error while downloading name')
          return 'error'
        }
        return nap.name
      }).catch((err) => {
        console.log(err)
        return 'error'
      })
  }

  public generate() {
    // stop updating previous profile
    if (!this.lastUnsub) {
      // chilling
    } else {
      this.lastUnsub()
    }
    const currentId = store.getState().profileReducer.currentId;
    const docRef = doc(this.db, 'usersProfile', currentId)
    this.lastUnsub = onSnapshot(docRef, (doc) => {
      const data = doc.data()
      if (!data) {
        // update firestore
        // const firstName = store.getState().profileReducer.firstName
        // const lastName = store.getState().profileReducer.lastName
        // const userName = store.getState().profileReducer.userName
        // this.upload(firstName, lastName, userName)
        return
      }
      store.dispatch(setFirstName(data.firstName))
      store.dispatch(setLastName(data.lastName))
      store.dispatch(setUserName(data.userName))
    })
  }

  public upload(firstName:string, lastName:string, userName:string) {
    const userId = store.getState().profileReducer.userId
    const docRef = doc(this.db, 'usersProfile', userId)
    const docData = {
      firstName:firstName,
      lastName:lastName,
      userName:userName
    }
    store.dispatch(setFirstName(firstName))
    store.dispatch(setLastName(lastName))
    store.dispatch(setUserName(userName))
    setDoc(docRef, docData)
      .then((res) => {
        // great success
      }).catch((err) => {
        console.log(err)
        alert(err.message)
      })
  }
}