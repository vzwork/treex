import './Tree.css'
import React from 'react'
import { useParams } from 'react-router-dom'

import 'react-reflex/styles.css'
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex'

import { TreeManager } from '../../TreeManager/TreeManager'
import Navigation from './Navigation/Navigation'

const Tree = () => {
  const { id } = useParams()

  const treeManager = TreeManager.getInstance();
  treeManager.setBaseId(id)

  return (
    <div className='tree'>
      <ReflexContainer orientation='horizontal'>
        <ReflexElement >
            
        </ReflexElement>
        <ReflexSplitter className='tree-splitter'/>
        <ReflexElement size={121} minSize={121}>
            <Navigation />
        </ReflexElement>
    </ReflexContainer>
    </div>
  )
}

export default Tree