import './DeleteAccount.css'
import React, { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import app from '../../../../data/firebaseApp';
import { getAuth, deleteUser } from 'firebase/auth';
import { getFirestore, query, collection, where, getDocs, setDoc, doc } from 'firebase/firestore';

const auth = getAuth(app);
const db = getFirestore(app);

const DeleteAccount = (props) => {
    const [user, loading, error] = useAuthState(auth);

    const closeDeleteAccount = () => {
        props.setDeleteAccount(false);
    }

    const [email, setEmail] = useState('')
    const [emailMessage, setEmailMessage] = useState('')
    const [emailBorder, setEmailBorder] = useState('')

    useEffect(() => {
        if (email.length == 0) {
            setEmailMessage('repeat your email')
            setEmailBorder('')
        } else if (email != user.email) {
            setEmailMessage('wrong email for this account')
            setEmailBorder('solid red 2px')
        } else {
            setEmailMessage('click delete to proceed')
            setEmailBorder('solid green 2px')
        }
    })

    const deleteAccount = () => {
        if (emailMessage != 'click delete to proceed') {
            // do nothing
        } else {
            const q = query(collection(db, 'usersAuth'), 
                where('active', '==', true), 
                where('userId', '==', user.uid))
            getDocs(q).then((res) => {
                if (res.docs.length !== 1) {
                    console.log('should be only one active user')
                } else {
                    res.forEach((file) => {
                        // doc.data() is never undefined for query doc snapshots
                        const now = Date.now()
                        const docRef = doc(db, 'usersAuth', file.id)
                        setDoc(docRef, {
                            ...file.data(),
                            active: false,
                            deactivationDateTime: now
                        })})
                }
            deleteUser(user).then(() => {
                closeDeleteAccount()
                }).catch((err) => {
                    console.log(err)
                    alert(err.message)}) 
            }).catch((err) => {
                console.log(err)
                alert(err.message)})
            closeDeleteAccount()
        }
    }

    return (
        <div className='deleteAccount'>
            <button className='closeDeleteAccountButton' onClick={closeDeleteAccount}></button>
            <div className='deleteAccountContent'>
                <div className='header'>Delete Account</div>
                {emailMessage}
                <input type='email' placeholder='example@treex.ai'
                    style={{border: emailBorder}}
                    onChange={event => setEmail(event.target.value)}/>
                <button className='deleteAccountButton' onClick={deleteAccount}>delete</button>
            </div>
        </div>
    )
}

export default DeleteAccount