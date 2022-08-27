import './EditTree.css'
import React, { useState } from 'react'
import { MdAddCircleOutline } from 'react-icons/md'
import { TiDeleteOutline } from 'react-icons/ti'

const EditTree = (props) => {
  return (
    <div className='editTree'>
      <div className='editTree-button' onClick={()=>{props.setAddNode(true)}}>
        <MdAddCircleOutline />
      </div>
      <div className='editTree-button' onClick={()=>{props.setDeleteNode(true)}}>
        <TiDeleteOutline />
      </div>
    </div>
  )
}

export default EditTree