import './Register.css';
import React, { useState, useEffect } from 'react';
import { UserAuth, userAuthConverter } from '../../../../DataClasses/UserAuth/UserAuth';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import app from '../../../../data/firebaseApp';
import { getFirestore, query, collection, where, addDoc, getDocs} from 'firebase/firestore';

const auth = getAuth(app);
const db = getFirestore(app);

const Register = (props) => {
    const closeRegister = () => {
        props.setRegister(false);
    }

    const [usedEmails, setUsedEmails] = useState(new Set())
    const [emailMessage, setEmailMessage] = useState('')
    const [email, setEmail] = useState('')
    const [emailBorder, setEmailBorder] = useState('')
    const [phoneMessage, setPhoneMessage] = useState('')
    const [phone, setPhone] = useState('')
    const [phoneBorder, setPhoneBorder] = useState('')
    const [passwordMessage, setPasswordMessage] = useState('')
    const [passwordOne, setPasswordOne] = useState('')
    const [passwordTwo, setPasswordtwo] = useState('')
    const [passwordBorder, setPasswordBorder] = useState('')

    useEffect(() => {
        if (email.length == 0) {
            setEmailMessage('email')
            setEmailBorder('')
        } else if (!UserAuth.isValidEmail(email)) {
            setEmailMessage('not proper email format')
            setEmailBorder('solid red 2px')
        } else {
            if (usedEmails.has(email)) {
                setEmailMessage('email is already in use')
                setEmailBorder('solid orange 2px')
            } else {
                setEmailBorder('solid green 2px')
                setEmailMessage('excellent email')
            }
        }
    })

    useEffect(() => {
        if (passwordOne.length == 0 || passwordTwo.length == 0) {
            setPasswordMessage('repeat password')
        } else if (passwordOne.length < 6 || passwordTwo.length < 6) {
            setPasswordMessage('length at least 6 characters')
            setPasswordBorder('solid red 2px')
        } else if (passwordOne != passwordTwo) {
            setPasswordMessage('passwords don\'t match')
            setPasswordBorder('solid red 2px')
        } else {
            setPasswordMessage('great password')
            setPasswordBorder('solid green 2px')
        }
    })

    useEffect(() => {
        if (phone.length == 0) {
            setPhoneMessage('phone number optional*')
            setPhoneBorder('')
        } else if (!UserAuth.isValidPhone(phone)) {
            setPhoneMessage('improper format 333 333 4444')
            setPhoneBorder('solid red 2px')
        } else {
            setPhoneMessage('perfect')
            setPhoneBorder('solid green 2px')
        }
    })

    const register = () => {
        if (emailMessage != 'excellent email' || 
            passwordMessage != 'great password' || 
            phoneMessage == 'improper format') {
            // do nothing
        } else {
            const now = Date.now()
            createUserWithEmailAndPassword(auth, email, passwordOne)
                .then((userCredential) => {
                    const user = userCredential.user
                    addDoc(collection(db, 'usersAuth'), {
                        dataClassVersion: '1.0.1',
                        active: true,
                        registrationDateTime: now,
                        deactivationDateTime: null,
                        userId: user.uid,
                        email,
                        phone,
                        authProvider: 'password'
                    }).then((res) => {
                        // successful register
                    }).catch((err) => {
                        console.log('error while adding new user', err)
                        alert(err.message)
                    })
                    closeRegister()
                }).catch((err) => {
                    if (err.code === 'auth/email-already-in-use') {
                        setUsedEmails(prev => new Set(prev.add(email)))
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
        <div className='register'>
            <button className='closeRegisterButton' onClick={closeRegister}></button>
            <div className='registerContent'>
                <div className='header'>
                    Register
                </div>
                {emailMessage}
                <input type='email' placeholder='example@treex.ai'
                    style={{border: emailBorder}}
                    onChange={event => setEmail(event.target.value)}/>
                {passwordMessage}
                <input type='password'
                    style = {{border: passwordBorder}}
                    onChange={event => setPasswordOne(event.target.value)}/>
                {passwordMessage}
                <input type='password'
                    style = {{border: passwordBorder}}
                    onChange={event => setPasswordtwo(event.target.value)}/>
                {phoneMessage}
                <input type='phone' placeholder='123-456-7890'
                    style = {{border: phoneBorder}}
                    onChange={event => setPhone(event.target.value)}/>
                <button className='registerButton registerEmail' onClick={register}>Register</button>
                <button className='registerButton registerGoogle' onClick={loginWithGoogle}>Register with Google</button>
            </div>
        </div>
    )
}

export default Register