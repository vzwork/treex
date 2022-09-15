import './Navigation.css'
import React, { useState } from 'react'
import { TreeManager } from '../../../TreeManager/TreeManager'
import { NavigationManager } from './NavigationManager'
import Shelf from './Shelf/Shelf'
import EditTree from './EditTree/EditTree'
import AddNode from './AddNode/AddNode'
import DeleteNode from './DeleteNode/DeleteNode'
import Search from './Search/Search'

const Navigation = () => {
  const [shelves, setShelves] = useState([])
  const navigationManager = NavigationManager.getInstance(setShelves)
  if (shelves.length == 0) {
    navigationManager.update()
  }

  const [addNode, setAddNode] = useState(false)
  const [deleteNode, setDeleteNode] = useState(false)
  const [search, setSearch] = useState(false)

  return (
    <div className='navigation'>
    <div className='navigation-shelves'>
        {shelves.map((item, index)=>{
            return <Shelf nodeRefs={item} key={index} />
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