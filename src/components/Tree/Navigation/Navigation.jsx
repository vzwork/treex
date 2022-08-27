import './Navigation.css'
import React, { useRef, useEffect, useState } from 'react'
import { TreeManager } from '../../../data/TreeManager'
import Shelf from './Shelf/Shelf'
import EditTree from './EditTree/EditTree'
import AddNode from './AddNode/AddNode'
import DeleteNode from './DeleteNode/DeleteNode'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { clearTreeData } from '../../../store/actions'

const treeManager = TreeManager.getInstance()
if (treeManager.recentNodes.length == 0) {
    console.log('set tree to default')
    treeManager.setBase('KSLC3E9YXXNJNKx23LqV')
}

const Navigation = () => {
    const [addNode, setAddNode] = useState(false)
    const [deleteNode, setDeleteNode] = useState(false)
    const shelves = useSelector((state) => state.treeReducer.shelves)

    return (
        <div className='navigation'>
            <div className='navigation-shelves'>
                {shelves.map((item, index)=>{
                    return <Shelf ids={item} key={index} />
                })}
            </div>
            <div className='navigation-editTree'>
                <EditTree setAddNode={setAddNode} setDeleteNode={setDeleteNode} />
            </div>
            {addNode ? <AddNode setAddNode={setAddNode}/> : null}
            {deleteNode ? <DeleteNode setDeleteNode={setDeleteNode}/> : null}
        </div>
    )
}

export default Navigation