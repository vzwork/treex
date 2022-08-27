import './Navbar.css';
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar () {

  return (
    <div className='navbar'>
      <div className='container'>
        <div className='navbarContent'>
          <Link to='/profile' >profile</Link>
          <Link to='/' >guide</Link>
          <Link to='/tree' >tree</Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;