import './Tree.css'
import React from 'react'
import Navigation from './Navigation/Navigation'
import Interaction from './Interaction/Interaction'
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex'
import 'react-reflex/styles.css'
import { TreeManager } from '../../data/TreeManager'

const Tree = () => {
    const treeManager = TreeManager.getInstance()
    if (treeManager.recentNodes.length == 0) {
        treeManager.setBase('history')
    }
    // const dispatch = useDispatch()
    // dispatch(clearProfileData())
    // dispatch(clearTreeData())

    return (
        <div className='tree'>
            <ReflexContainer orientation='horizontal'>
                <ReflexElement >
                    <Interaction />
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