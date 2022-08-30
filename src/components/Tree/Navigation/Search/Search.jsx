import './Search.css'
import React, { useState } from 'react'
import { TreeManager } from '../../../../data/TreeManager'
import { useSelector } from 'react-redux'
import SearchResult from './SearchResult/SearchResult'

const Search = (props) => {
  const [searchName, setSearchName] = useState('')
  const treeManager = TreeManager.getInstance()

  const searchResults = useSelector((state) => state.treeReducer.searchResults)

  const closeSearch = () => {
    props.setSearch(false)
    treeManager.clearSearchNames()
  }

  const search = () => {
    treeManager.setSearchName(searchName)
  }

  return (
    <div className='search'>
      <div className='searchCloseButton' onClick={closeSearch}/>
      <div className='searchWindow'>
        <div className='searchInput'>
          <input type='text' placeholder='name'
            onChange={event => setSearchName(event.target.value)}/>
          <div className='searchControlButton'
            onClick={search}>
            find
          </div>
        </div>
        <div className='searchOutput'>
          {
            searchResults.map((ids, key) => {
              return <SearchResult key={key} ids={ids} closeSearch={closeSearch} />
            })
          }
        </div>
      </div>
    </div>
  )
}

export default Search