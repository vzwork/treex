import './Comments.css';
import React, { useState } from 'react';
import CommentEntry from './CommentEntry/CommentEntry';
import { CommentsManager } from '../../../data/CommentsManager';
import Comment from './Comment/Comment';

const Comments = (props) => {
  const [comments, setComments] = useState({});
  const [currentBaseNode, setCurrentBaseNode] = useState('');

  if (props.nodeId != currentBaseNode) {
    const commentsManager = CommentsManager.getInstance();
    commentsManager.updatesForNode(props.nodeId, setComments);
    setCurrentBaseNode(props.nodeId);
  }

  return (
    <div className='comments'>
      <CommentEntry nodeId={props.nodeId}/>
      <div className='commentsHistory'>
        {Object.keys(comments).map((key) => {
          return (
            <Comment key={key} date={comments[key].date} uName={comments[key].uName} text={comments[key].text} />
          );
        })}
      </div>
    </div>
  );
}

export default Comments;