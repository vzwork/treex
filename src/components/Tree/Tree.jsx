import './Tree.css'
import React from 'react'
import Navigation from './Navigation/Navigation'
import Interaction from './Interaction/Interaction'
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex'
import 'react-reflex/styles.css'


const Tree = () => {
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