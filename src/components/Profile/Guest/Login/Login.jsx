import './Login.css';
import React, { useEffect, useState } from 'react';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import app from '../../../../data/firebaseApp';
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from  'firebase/auth';
import { UserAuth } from '../../../../DataClasses/UserAuth/UserAuth';

const auth = getAuth(app)
const db = getFirestore(app)

const Login = (props) => {
    const closeLogin = () => {
        props.setLogin(false)
    }

    const [voidEmails, setVoidEmails] = useState(new Set())
    const [wrongPasswords, setWrongPassword] = useState(new Set())
    const [emailMessage, setEmailMessage] = useState('')
    const [email, setEmail] = useState('')
    const [emailBorder, setEmailBorder] = useState('')
    const [passwordMessage, setPasswordMessage] = useState('')
    const [password, setPassword] = useState('')
    const [passwordBorder, setPasswordBorder] = useState('')

    useEffect(() => {
        if (email.length == 0) {
            setEmailMessage('your account email')
        } else if (!UserAuth.isValidEmail(email)) {
            setEmailMessage('not proper email format')
            setEmailBorder('solid red 2px')
        } else {
            if (voidEmails.has(email)) {
                setEmailMessage('no account with that email')
                setEmailBorder('solid orange 2px')
            } else {
                setEmailMessage('excellent email')
                setEmailBorder('solid green 2px')
            }
        }
    })

    useEffect(() => {
        if (password.length == 0) {
            setPasswordMessage('your password')
        } else if (password.length < 6) {
            setPasswordMessage('length at least 6 characters')
            setPasswordBorder('solid red 2px')
        } else {
            if (wrongPasswords.has(password)) {
                setPasswordMessage('wrong password')
                setPasswordBorder('solid orange 2px')
            } else {
                setPasswordMessage('press login')
                setPasswordBorder('solid green 2px')
            }
        }
    })

    const login = () => {
        if (emailMessage != 'excellent email' ||
            passwordMessage != 'press login') {
                // do nothing
        } else {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    closeLogin()
                }).catch((err) => {
                    if (err.code == 'auth/wrong-password') {
                        setWrongPassword(prev => new Set(prev.add(password)))
                    } else if (err.code == 'auth/user-not-found') {
                        setVoidEmails(prev => new Set(prev.add(email)))
                    } else {
                        console.log(err.message)
                    }
                })
        }
    }

    const loginWithGoogle = async () => {
        
        const googleProvider = new GoogleAuthProvider();
        const auth = getAuth(app);
        const db = getFirestore(app);
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        const q = query(collection(db, 'usersAuth'), 
                          where('email', '==', user.email),
                          where('active', '==', true))
        getDocs(q).then((res) => {
          if (res.docs.length > 0) {
              // do nothing
          } else {
              const now = Date.now()
              addDoc(collection(db, "usersAuth"), {
                dataClassVersion: '1.0.1',
                active: true,
                registrationDateTime: now,
                deactivationDateTime: null,
                userId: user.uid,
                email: user.email,
                phone: '',
                authProvider: 'google'
              })
          }
        }).catch((err) => {
          console.log(err)
          alert(err.message)
        })
        
    };

    return (
        <div className='login'>
            <button className='closeLoginButton' onClick={closeLogin}></button>
            <div className='loginContent'>
                <div className='header'>
                    Login
                </div>
                {emailMessage}
                <input type="email" placeholder='email'
                    style={{border: emailBorder}}
                    onChange={event => setEmail(event.target.value)}/>
                {passwordMessage}
                <input type="password" placeholder='password'
                    style={{border: passwordBorder}}
                    onChange={event => setPassword(event.target.value)}/>
                <button className='loginButton loginEmail' onClick={login}>Login</button>
                <button className='loginButton loginGoogle' onClick={loginWithGoogle}>Login with Google</button>
            </div>
        </div>
    );
}

export default Login;