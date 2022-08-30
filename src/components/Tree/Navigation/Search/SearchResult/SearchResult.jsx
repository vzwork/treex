import './SearchResult.css'
import React from 'react'
import { TreeManager } from '../../../../../data/TreeManager'

const SearchResult = (props) => {
  const treeManager = TreeManager.getInstance()
  const usefulIds = props.ids.slice(0, 3)
  const parentIds = usefulIds.slice(1)

  return (
    <div className='searchResult'>
      <div className='focusNode searchNode' onClick={() => {
        treeManager.setBase(usefulIds[0])
        props.closeSearch()
      }}>
        {treeManager.searchNames.get(usefulIds[0])}
      </div>
      <div className='parentNodes'>
        {
          parentIds.map((id, key) => {
            return <div key={key} className='searchNode' onClick={()=>{
              treeManager.setBase(id)
              props.closeSearch()
            }}>{treeManager.searchNames.get(id)}</div>
          })
        }
      </div>
    </div>
  )
}

export default SearchResult