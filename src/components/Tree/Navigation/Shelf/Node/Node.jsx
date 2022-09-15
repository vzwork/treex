import './Node.css';
import React from 'react';
import { TreeManager } from '../../../../../data/TreeManager';
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from 'firebase/auth';
import app from '../../../../../data/firebaseApp';
import { useNavigate } from 'react-router-dom';

const Node = (props) => {
  const navigate = useNavigate()
  const auth = getAuth(app)
  const [user, loading, error] = useAuthState(auth);
  
  const nodeRef = props.nodeRef;

  function select(){
    navigate(`/tree/${nodeRef.id}`)
  }

  return (
    <button className={'node '}
      onClick={select}>
      {nodeRef.name}
    </button>
  );
}

export default Node;