import './Node.css';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increaseRequestCount, setBaseNode } from '../../../../../store/actions';
import { TreeManager } from '../../../../../data/TreeManager';
import { auth } from '../../../../../data/firebaseAuth';
import { useAuthState } from "react-firebase-hooks/auth";

const Node = (props) => {
  const node = props.node;
  const baseNodeId = useSelector((state: any) => state.baseNodeId);
  const baseNodeName = useSelector((state: any) => state.baseNodeName);
  let baseNode = {id:baseNodeId, name:baseNodeName};
  const dispatch = useDispatch();
  const [user, loading, error] = useAuthState(auth);
  async function select(){
    const treeManager = TreeManager.getInstance();
    if (!user) {
      if (!treeManager.hasTreeNode(node)){
        dispatch(increaseRequestCount());
      }
    }
    await treeManager.setBaseNode(node);
    dispatch(setBaseNode(node));
  }
  return (
    <button onClick={select} className={'btn node ' + (baseNode.id == node.id ? 'base' : '')}>
      {node.name}
    </button>
  );
}

export default Node;