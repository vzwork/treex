import './Profile.css';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { getAuth } from 'firebase/auth';
import Guest from './Guest/Guest';
import Dashboard from './Dashboard/Dashboard';
import app from '../../data/firebaseApp';

function Profile () {
  const auth = getAuth(app)
  const [user] = useAuthState(auth)

  return (
    <div className='profile'>
      <div className='container'>
        <div className='profileContent'>
          {!user ? <Guest /> : null}
          {!user ? null : <Dashboard />}
        </div>
      </div>
    </div>
  );
};

export default Profile;