import './Interaction.css'
import React from 'react'

import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex'

import InteractionBar from './InteractionBar/InteractionBar'
import File from './File/File'
import Comments from './Comments/Comments'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

const Interaction = () => {
    
    return (
        <div className='interaction'>
            {/* <InteractionBar /> */}
            <ReflexContainer orientation='horizontal'>
                <ReflexElement size={300} minSize={60}>
                    <File />
                </ReflexElement>
                <ReflexSplitter className='interaction-splitter'/>
                <ReflexElement size={800} minSize={220}>
                    <Comments />
                </ReflexElement>
            </ReflexContainer>
        </div>
    )
}

export default Interaction