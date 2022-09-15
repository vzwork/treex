import './Shelf.css';
import React from 'react';
import Node from './Node/Node';

const Shelf = (props) => {
  const nodeRefs = props.nodeRefs;
  return (
    <div className='shelf'>
      {nodeRefs.map((item, index)=>{
          return <Node nodeRef={item} key={index} />
      })}
    </div>
  );
}

export default Shelf;