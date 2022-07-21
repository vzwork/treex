import './Tree.css';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TreeManager } from '../../data/TreeManager';
import Navigation from './Navigation/Navigation';
import { setBaseNode } from '../../store/actions';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../data/firebaseAuth';
import Comments from './Comments/Comments';

const Tree = () => {
  const baseNodeId = useSelector((state: any) => state.baseNodeId);
  const baseNodeName = useSelector((state: any) => state.baseNodeName);
  let baseNode = {id:baseNodeId, name:baseNodeName};
  const treeManager = TreeManager.getInstance();
  
  // vvv tree set base node vvv
  const [initialRender, setInitialRender] = useState(false);
  useEffect(() => {
    if (!initialRender) {
      setTreeBaseNode();
    }
  })
  const setTreeBaseNode = async() => {
    const successful = await treeManager.setBaseNode(baseNode);
    if (!successful) {
      console.log('initial state | deleted node');
      dispatch(setBaseNode({id:'WUdK1a6fVuO5LjG1KouS', name:'root'}));
    }
    console.log()
    setInitialRender(true);
  }
  // vvv tree set base node vvv
  
  // vvv guest request limit vvv
  const count = useSelector((state: any) => state.requestCount);
  if (count >= 100) {
    const navigate = useNavigate();
    navigate('/profile/guest');
  }
  // ^^^ guest request limit ^^^

  // vvv edit tree vvv
  const [user, loading, error] = useAuthState(auth);
  const [newNodeName, setNewNodeName] = useState('');
  const navigate = useNavigate();
  const clickedAddNode = async() => {
    if (!user) {
      navigate('/profile/guest');
    } else {
      if (baseNodeId != ''){
        if (newNodeName != ''){
          await treeManager.uploadNode(baseNode, newNodeName);
          setNewNodeName('');
        }
      }
    }
  }
  // ^^^ edit tree ^^^

  const dispatch = useDispatch();
  
  return (
    <div className='tree'>
      <Comments nodeId={baseNodeId}/>
        <div className='editTree'>
            <div className='editTreeButtons'>
              <input className='inputNewNodeName ebtn' type='text' value={newNodeName} onChange={
                (event) => {
                  setNewNodeName(event.target.value);
                }
              }/>
              <button onClick={clickedAddNode} className='btn ebtn'>add</button>
              <button onClick={async () => {
                if (!user) {
                  navigate('/profile/guest');
                } else {
                  const parent = treeManager.getParent(baseNode);
                  await treeManager.deleteNode(baseNode); 
                  await treeManager.setBaseNode(parent);
                  dispatch(setBaseNode(parent));
                }
              }} className='btn ebtn'>delete</button>
          </div>
          <Navigation />
        </div>
    </div>
  );
}

export default Tree;