import './DeleteNode.css'
import React, { useState } from 'react'
import { TreeManager } from '../../../../data/TreeManager'

const DeleteNode = (props) => {
  const [deleteName, setDeleteName] = useState('')
  const treeManager = TreeManager.getInstance()
  const baseName = treeManager.getName(treeManager.recentNodes[0])

  const deleteCurrentBaseNode = () => {
    if (deleteName == baseName) {
      treeManager.deleteBase()
      props.setDeleteNode(false)
    }
  }

  return (
    <div className='deleteNode'>
      <div className='deleteNodeCloseButton' onClick={()=>{props.setDeleteNode(false)}}/>
      <div className='deleteNodeWindow'>
        <div className='deleteNodeWindowExplanation'>
          To delete type name [{baseName}]
        </div>
        <input type='text' placeholder='name'
          onChange={event => setDeleteName(event.target.value)}/>
        <div className='deleteNodeControlButtons'>
          <div className='deleteNodeCancelButton deleteNodeControlButton'
            onClick={()=>{props.setDeleteNode(false)}}>
            cancel
          </div>
          <div className='deleteNodeDeleteButton deleteNodeControlButton'
            onClick={()=>{deleteCurrentBaseNode()}}>
            delete
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteNode