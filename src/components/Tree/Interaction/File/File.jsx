import './File.css'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { FileManager } from '../../../../data/FileManager'

const File = () => {
  const file = useSelector(state => state.treeReducer.file)
  const [currentFile, setCurrentFile] = useState(file)

  return (
    <div className='file'>
      <textarea type="text"
        className='fileTextInput'
        value={currentFile}
        onChange={(event) => setCurrentFile(event.target.value)}
      />
      <div className='fileSaveButton'
        onClick={()=>{
          const fileManager = FileManager.getInstance()
          fileManager.updateFile(currentFile)
        }}>
        save
      </div>
    </div>
  )
}

export default File