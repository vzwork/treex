import './ResetPassword.css';
import React, { useState, useEffect } from 'react';
import { UserAuth } from '../../../../DataClasses/UserAuth/UserAuth';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import app from '../../../../data/firebaseApp';

const auth = getAuth(app);

const ResetPassword = (props) => {
    const closeResetPassword = () => {
        props.setResetPassword(false)
    }

    const [email, setEmail] = useState('')
    const [emailMessage, setEmailMessage] = useState('')
    const [emailBorder, setEmailBorder] = useState('')

    useEffect(() => {
        if (email.length == 0) {
            setEmailMessage('email')
            setEmailBorder('')
        } else if (!UserAuth.isValidEmail(email)) {
            setEmailMessage('not proper email format')
            setEmailBorder('solid red 2px')
        } else {
            setEmailMessage('ok')
            setEmailBorder('solid green 2px')
        }
    })

    const resetPassword = () => {
        sendPasswordResetEmail(auth, email)
            .then((res) => {
                closeResetPassword()
            }).catch((err) => {
                console.log(err)
                alert(err.message)
            })
    }

    return (
        <div className='resetPassword'>
            <button className='closeResetPasswordButton' onClick={closeResetPassword}></button>
            <div className='resetPasswordContent'>
                <div className='header'>
                    Reset password
                </div>
                {emailMessage}
                <input type='email' placeholder='example@treex.ai'
                    style={{border:emailBorder}}
                    onChange={event => setEmail(event.target.value)}/>
                <button className='resetPasswordButton' onClick={resetPassword}>Send reset password link</button>
            </div>
        </div>
    );
}

export default ResetPassword;