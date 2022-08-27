import './Shelf.css';
import React from 'react';
import Node from './Node/Node';

const Shelf = (props) => {
  const ids = props.ids;
  return (
    <div className='shelf'>
      {ids.map((item, index)=>{
          return <Node id={item} key={index} />
      })}
    </div>
  );
}

export default Shelf;