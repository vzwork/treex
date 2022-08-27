import './EditDashboard.css';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setFirstName, setLastName, setUserName } from '../../../../store/actions/index';
import { ProfileManager } from '../../../../data/ProfileManager';


const EditDashboard = (props) => {
    const dispatch = useDispatch();
    const closeEditDashboard = () => {
        props.setEditDashboard(false)
    }
    const saveChanges = () => {
        const profileManager = ProfileManager.getInstance()
        profileManager.upload(editFirstName, editLastName, editUserName)
        closeEditDashboard();
    }

    const [editFirstName, setEditFirstName] = useState(useSelector((state) => state.profileReducer.firstName));
    const [editLastName, setEditLastName] = useState(useSelector((state) => state.profileReducer.lastName));
    const [editUserName, setEditUserName] = useState(useSelector((state) => state.profileReducer.userName));
    
    return (
        <div className='editDashboard'>
            <button className='closeEditDashboardButton' onClick={closeEditDashboard}></button>
            <div className='editDashboardContent'>
                <div className='header'>
                    Edit Profile
                </div>
                <input type='text' placeholder={editFirstName}
                    onChange={event => setEditFirstName(event.target.value)}/>
                <input type='text' placeholder={editLastName}
                    onChange={event => setEditLastName(event.target.value)}/>
                <input type='text' placeholder={editUserName}
                    onChange={event => setEditUserName(event.target.value)}/>
                <button className='saveChangesButton' onClick={saveChanges}>save</button>
            </div>
        </div>
    );
}

export default EditDashboard;