import './Comments.css'
import React from 'react'
import { useSelector } from 'react-redux'
import Comment from './Comment/Comment'
import { useState } from 'react'
import { CommentsManager } from '../../../../data/CommentsManager'

const Comments = () => {
  const comments = useSelector((state) => state.treeReducer.comments)
  const [newComment, setNewComment] = useState('')
  const commentsManager = CommentsManager.getInstance()

  const sendComment = () => {
    setNewComment('')
    commentsManager.addComment(newComment)
  }

  return (
    <div className='comments'>
      <div className='commentsInput'>
        <input type="text"
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              sendComment()
            }
          }}
          onChange={(event) => {
          setNewComment(event.target.value)
        }}/>
        <div className='sendComment'
          onClick={sendComment}>
          send
        </div>
      </div>
      <div className='commentsOutput'>
        {
          comments.map((comment, key) => {
            return <Comment key={key} comment={comment} />
          })
        }
      </div>
    </div>
  )
}

export default Comments