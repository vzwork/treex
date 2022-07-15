import './Shelf.css';
import React from 'react';
import Node from './Node/Node';

const Shelf = (props) => {
  const nodes = props.nodes;
  return (
    <div className='shelf'>
      <p className='node'>|</p>
      {nodes.map((item, index)=>{
          return <Node node={item} key={index} />
      })}
    </div>
  );
}

export default Shelf;