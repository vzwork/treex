import './Navbar.css';
import React from 'react';
import { Link } from 'react-router-dom';
import { ImInfo } from 'react-icons/im';
import { BsPersonCircle, BsFilterCircle } from 'react-icons/bs';

function Navbar () {

  return (
    <div className='navbar'>
        <Link to='/' >Guide</Link>
        <Link to='/profile/dashboard' >Profile</Link>
        <Link to='/tree' >Tree</Link>
    </div>
  );
};

export default Navbar;