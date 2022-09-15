import './File.css'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FileManager } from '../../../../data/FileManager'

const File = () => {
  const [userEditing, setUserEditing] = useState(false)
  const [currentFile, setCurrentFile] = useState('')

  const file = useSelector(state => state.treeReducer.file)
  
  if (!userEditing) {
    if (currentFile != file) {  
      setCurrentFile(file)
    }
  }

  return (
    <div className='file'>
      <textarea type="text"
        className='fileTextInput'
        value={currentFile}
        onChange={(event) => {
          setUserEditing(true)
          setCurrentFile(event.target.value)}}
      />
      <div className='fileSaveButton'
        onClick={()=>{
          setUserEditing(false)
          setCurrentFile('')
          const fileManager = FileManager.getInstance()
          fileManager.updateFile(currentFile)
        }}>
        save
      </div>
    </div>
  )
}

export default File