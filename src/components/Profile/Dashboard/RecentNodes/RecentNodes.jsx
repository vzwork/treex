import './RecentNodes.css';
import React from 'react';
import { useSelector } from 'react-redux';
import RecentNode from './RecentNode/RecentNode';

const RecentNodes = () => {
    let recentNodes = useSelector((state) => state.treeReducer.history)
    let uniququeRecentNodes = [...new Set(recentNodes)]
    return (
        <div className='recentNodes'>
            recent nodes
            <div className='recentNodes-Nodes'>
                {uniququeRecentNodes.map((id, index)=>{
                    return <RecentNode id={id} key={index}/>
                })}
            </div>
        </div>
    );
}

export default RecentNodes;