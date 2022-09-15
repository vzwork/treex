import './Navbar.css';
import React from 'react';
import { Link } from 'react-router-dom';
import { HistoryManager } from '../../HistoryManager/HistoryManager';

function Navbar () {
  const historyManager = HistoryManager.getInstance()
  const currentNodeId = historyManager.getNodeId()

  return (
    <div className='navbar'>
      <div className='container'>
        <div className='navbarContent'>
          <Link to='/profile' >profile</Link>
          <Link to='/' >guide</Link>
          <Link to={'/tree/' + currentNodeId}>tree</Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;