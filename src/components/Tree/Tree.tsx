import './Tree.css';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TreeManager } from '../../data/TreeManager';
import Navigation from './Navigation/Navigation';
import { setBaseNode } from '../../store/actions';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../data/firebaseAuth';

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

  // vvv edit tree as a guest vvv
  const [user, loading, error] = useAuthState(auth);
  const [newNodeName, setNewNodeName] = useState('');
  const clickedAddNode = async() => {
    if (!user) {
      const navigate = useNavigate();
      navigate('/profile/guest');
    }
    if (baseNodeId != ''){
      if (newNodeName != ''){
        await treeManager.uploadNode(baseNode, newNodeName);
        setNewNodeName('');
      }
    }
  }
  // ^^^ edit tree as a guest ^^^

  const dispatch = useDispatch();
  
  return (
    <div className='tree'>
      <div className='bottom'>
        <div className='editTree'>
          <div className='editTreeUpsideDown'>
            <div className='editTreeButtons'>
              <input className='inputNewNodeName' type='text' value={newNodeName} onChange={
                (event) => {
                  setNewNodeName(event.target.value);
                }
              }/>
              <button onClick={clickedAddNode}>Add node</button>
              <button onClick={async () => {
                if (!user) {
                  const navigate = useNavigate();
                  navigate('/profile/guest');
                }
                const parent = treeManager.getParent(baseNode);
                await treeManager.deleteNode(baseNode); 
                await treeManager.setBaseNode(parent);
                dispatch(setBaseNode(parent));
              }}>Delete node</button>
          </div>
          </div>
        </div>
        <Navigation />
      </div>
    </div>
  );
}

export default Tree;