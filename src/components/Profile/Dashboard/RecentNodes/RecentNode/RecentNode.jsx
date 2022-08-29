import './RecentNode.css'
import React, { useEffect, useState } from 'react'
import { ProfileManager } from '../../../../../data/ProfileManager'
import { useNavigate } from 'react-router-dom'
import { TreeManager } from '../../../../../data/TreeManager'


const RecentNode = (props) => {
  const profileManager = ProfileManager.getInstance()
  const [name, setName] = useState('')
  const getName = async () => {
    const _name = await profileManager.getName(props.id)
    if (_name == 'error') {
      return (
        <div></div>
      )
    }
    setName(_name)
  }

  useEffect(() => {
    getName()
  }, [])

  const navigate = useNavigate()

  const clicked = () => {
    const treeManager = TreeManager.getInstance()
    treeManager.setBase(props.id)
    navigate('/tree')
  }
  return (
    <div className='recentNode'
      onClick={clicked}>
      {name}
    </div>
  )
}

export default RecentNode