import './Navigation.css'
import React, { useRef, useEffect, useState } from 'react'
import Shelf from './Shelf/Shelf'
import EditTree from './EditTree/EditTree'
import AddNode from './AddNode/AddNode'
import DeleteNode from './DeleteNode/DeleteNode'
import { useSelector } from 'react-redux'
import Search from './Search/Search'

const Navigation = () => {
    const [addNode, setAddNode] = useState(false)
    const [deleteNode, setDeleteNode] = useState(false)
    const [search, setSearch] = useState(false)
    const shelves = useSelector((state) => state.treeReducer.shelves)

    return (
        <div className='navigation'>
            <div className='navigation-shelves'>
                {shelves.map((item, index)=>{
                    return <Shelf ids={item} key={index} />
                })}
            </div>
            <div className='navigation-editTree'>
                <EditTree setAddNode={setAddNode} 
                          setDeleteNode={setDeleteNode} 
                          setSearch={setSearch} />
            </div>
            {addNode ? <AddNode setAddNode={setAddNode}/> : null}
            {deleteNode ? <DeleteNode setDeleteNode={setDeleteNode}/> : null}
            {search ? <Search setSearch={setSearch}/> : null}
        </div>
    )
}

export default Navigation