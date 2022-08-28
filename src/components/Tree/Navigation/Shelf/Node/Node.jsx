import './Node.css';
import React from 'react';
import { TreeManager } from '../../../../../data/TreeManager';
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from 'firebase/auth';
import app from '../../../../../data/firebaseApp';

const treeManager = TreeManager.getInstance()

const Node = (props) => {
  const auth = getAuth(app)
  const [user, loading, error] = useAuthState(auth);
  
  const id = props.id;

  async function select(){
    const treeManager = TreeManager.getInstance();
    if (!user) {
      // TODO: prevent spam
    }
    treeManager.setBase(id);
  }

  return (
    <button className={'node ' + (treeManager.recentNodes[0] == id ? 'base' : '')}
      onClick={select}>
      {treeManager.getName(id)}
    </button>
  );
}

export default Node;