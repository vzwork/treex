import './Guest.css'
import React, { useState } from 'react'

import app from '../../../data/firebaseApp';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

import Login from './Login/Login';
import Register from './Register/Register';
import ResetPassword from './ResetPassword/ResetPassword';

const Guest = () => {
    const auth = getAuth(app)
    const [user] = useAuthState(auth)

    const [login, setLogin] = useState(false)
    const showLogin = () => { setLogin(true) }
    const [register, setRegister] = useState(false)
    const showRegister = () => { setRegister(true) }
    const [resetPassword, setResetPassword] = useState(false)
    const showResetPassword = () => { setResetPassword(true) }

    return (
        <div className='guest'>
            <div className='navigation'>
                <div className='heading'>
                    Looks like you're a guest!
                </div>
                <button className='userStatusButton' onClick={showLogin}>login</button>
                <button className='userStatusButton' onClick={showRegister}>register</button>
                <button className='userStatusButton' onClick={showResetPassword}>reset password</button>
            </div>

            {login ? <Login setLogin={setLogin}/> : null }
            {register ? <Register setRegister={setRegister}/> : null }
            {resetPassword ? <ResetPassword setResetPassword={setResetPassword}/> : null}
        </div>
    )
}

export default Guest