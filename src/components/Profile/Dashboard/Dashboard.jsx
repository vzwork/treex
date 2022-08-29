import './Dashboard.css';
import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import { getAuth, signOut } from 'firebase/auth';
import DeleteAccount from './DeleteAcccount/DeleteAccount';
import { useDispatch } from 'react-redux';
import { setCurrentId, setUserId } from '../../../store/actions';
import RecentNodes from './Recentnodes/RecentNodes';
import EditDashboard from './EditDashboard/EditDashboard';
import app from '../../../data/firebaseApp';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ProfileManager } from '../../../data/ProfileManager';

function Dashboard() {
  const auth = getAuth(app)
  const [user] = useAuthState(auth)
  const dispatch = useDispatch()
  const userId = useSelector((state) => state.profileReducer.userId)
  const currentId = useSelector((state) => state.profileReducer.currentId)

  const profileManager = ProfileManager.getInstance()
  if (userId != user.uid) {
    dispatch(setUserId(user.uid)) // set default id to the authenticated user
  }
  profileManager.generate()


  // vvv auth windows vvv
  const [deleteAccount, setDeleteAccount] = useState(false)
  const showDeleteAccount = () => { setDeleteAccount(true) }
  const [editDashboard, setEditDashboard] = useState(false);
  const showEditDashboard = () => { setEditDashboard(true) }
  // ^^^ auth windows ^^^

  const firstName = useSelector((state) => state.profileReducer.firstName)
  const lastName = useSelector((state) => state.profileReducer.lastName)
  const userName = useSelector((state) => state.profileReducer.userName)


  return (
    <div className="dashboard">
      <div className='userStatusButtons'>
        {userId == currentId ?  
          <div className='userStatusButton' onClick={()=> {
                  setDeleteAccount(true)
                }}>delete account</div> : null}
        {userId == currentId ? 
          <div className='userStatusButton' onClick={()=>{
                  const auth = getAuth();
                  signOut(auth).then(()=>{}).catch((err)=>{console.log(err.messgae)});
                }}>logout</div> : null}
        {userId == currentId ? null :
          <div className='userStatusButton' onClick={()=>{
            dispatch(setCurrentId(userId))
          }}>my account</div>}
      </div>
      {deleteAccount ? <DeleteAccount setDeleteAccount={setDeleteAccount}/> : null}
      {editDashboard ? <EditDashboard setEditDashboard={setEditDashboard}/> : null}
      <div className='userInfo'>
        <div className='name'>
          {firstName + ' ' + lastName}
          {currentId == userId
            ? <button className='editDashboardButton' onClick={showEditDashboard}>edit</button>
            : null
          }
        </div>
        <div className='userName'>
          {userName + ' '}
        </div>
      </div>
      <div className='activityInfo'>
        <RecentNodes />
      </div>
    </div>
  );
}
export default Dashboard;