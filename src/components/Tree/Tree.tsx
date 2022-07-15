import './Tree.css';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TreeManager } from '../../data/TreeManager';
import Navigation from './Navigation/Navigation';
import { setBaseNode } from '../../store/actions';
import { useNavigate } from 'react-router-dom';

const Tree = () => {
  const count = useSelector((state: any) => state.requestCount);
  if (count >= 100) {
    const navigate = useNavigate();
    navigate('/profile/guest');
  }

  const treeManager = TreeManager.getInstance();
  const dispatch = useDispatch();
  
  const baseNodeId = useSelector((state: any) => state.baseNodeId);
  const baseNodeName = useSelector((state: any) => state.baseNodeName);
  const baseNode = {id:baseNodeId, name:baseNodeName};

  const [newNodeName, setNewNodeName] = useState('');
  const clickedAddNode = async() => {
    if (baseNodeId != ''){
      if (newNodeName != ''){
        await treeManager.uploadNode(baseNode, newNodeName);
        setNewNodeName('');
      }
    }
  }

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