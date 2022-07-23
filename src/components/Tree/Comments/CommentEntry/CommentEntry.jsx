import './CommentEntry.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../../data/firebaseAuth';
import { CommentsManager } from '../../../../data/CommentsManager';

const CommentEntry = (props) => {
  const [user, loading, error] = useAuthState(auth);
  const [commentEntry, setCommentEntry] = useState('');

  const navigate = useNavigate();

  return (
    <div className='commentEntry'>
      <input className='btn commentEntryInput' type='text' value={commentEntry} onChange={
        (event) => {
          setCommentEntry(event.target.value);
        }
      } />
      <button onClick={() => {
        if (!user) {
          navigate('/profile/guest');
        } else {
          const commentsManager = CommentsManager.getInstance();
          if (commentEntry == '') {
            console.log('empty comment!');
          } else {
            commentsManager.addComment(props.nodeId, user.uid, 'test', commentEntry);
            setCommentEntry('');
          }
        }
      }} className='btn'>send</button>
    </div>
  );
}

export default CommentEntry;