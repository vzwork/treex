import './Navigation.css';
import React from 'react';
import Shelf from './Shelf/Shelf';
import { TreeManager } from '../../../data/TreeManager';

const Navigation = (props) => {
  const treeManager = TreeManager.getInstance();

  return (
    <div className='navigation'>
      <Shelf nodes={treeManager.topShelf} />
      <Shelf nodes={treeManager.midShelf} />
      <Shelf nodes={treeManager.botShelf} />
    </div>
  );
}

export default Navigation