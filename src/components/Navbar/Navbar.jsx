import './Navbar.css';
import React from 'react';
import { Link } from 'react-router-dom';
import { ImInfo } from 'react-icons/im';
import { BsPersonCircle, BsFilterCircle } from 'react-icons/bs';

function Navbar () {

  return (
    <div className='navbar'>
        <Link to='/profile/dashboard' >profile</Link>
        <Link to='/' >guide</Link>
        <Link to='/tree' >tree</Link>
    </div>
  );
};

export default Navbar;