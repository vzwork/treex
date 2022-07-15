import './Profile.css';
import React, { useEffect } from 'react';
import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuthState } from "react-firebase-hooks/auth";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "../../data/firebaseAuth";

function Profile () {
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/profile/guest");
    } else {
      navigate('/profile/dashboard');
    }
  }, [user, loading]);

  return (
    <div className='profile'>
      <Outlet />
    </div>
  );
};

export default Profile;