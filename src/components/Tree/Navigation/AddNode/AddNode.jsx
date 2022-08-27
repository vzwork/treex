import './AddNode.css'
import React from 'react'
import { useState } from 'react'
import { TreeManager } from '../../../../data/TreeManager'
import { useSelector } from 'react-redux'
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth'

const AddNode = (props) => {
  const [newName, setNewName] = useState('')
  const treeManager = TreeManager.getInstance()
  const baseNodeId = treeManager.recentNodes[0]
  const baseName = treeManager.getName(baseNodeId)
  const creatorUserName = useSelector((state) => state.profileReducer.userName)
  const auth = getAuth()
  const [user] = useAuthState(auth)

  const saveNode = () => {
    if (newName.length == 0) {
      // do nothing
      return
    }
    treeManager.newChild(user.uid, creatorUserName, newName)
    props.setAddNode(false)
  }

  return (
    <div className='addNode'>
      <div className='addNodeCloseButton' 
        onClick={()=>{props.setAddNode(false)}} />
      <div className='addNodeWindow'>
        <div className='addNodeWindowExplanation'>
          Add a child node to [{baseName}]
        </div>
        <input type='text' placeholder='new name'
          onChange={event => setNewName(event.target.value)}/>
        <div className='addNodeControlButtons'>
          <div className='addNodeCancelButton addNodeControlButton' 
            onClick={()=>{props.setAddNode(false)}}>
            cancel
          </div>
          <div className='addNodeSaveButton addNodeControlButton'
            onClick={()=>{saveNode()}}>
            save
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddNode