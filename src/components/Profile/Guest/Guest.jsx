import './Guest.css';
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Guest () {
  const counter = useSelector((state) => state.requestCount);

  return (
    <div className='guest'>
      <div className='messageCounter'>
        <div className='message'>
          You are a guest! <br/>
          Please sign in! <br/>
          Remaining requests: {100 - counter}
        </div>
      </div>
      <div className='links'>
        <Link to='/profile/login'>login</Link>
        <Link to='/profile/register'>register</Link>
        <Link to='/profile/reset'>reset</Link>
        {false && (<Navigate to='/dashboard' replace={true} />)}
      </div>
    </div>
  );
}

export default Guest;