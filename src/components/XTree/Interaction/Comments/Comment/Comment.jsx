import './Comment.css'
import React from 'react'

const Comment = (props) => {
  const comment = props.comment
  const date = new Date(comment.date)
  return (
    <div className='comment'>
      <div className='commentDate'>
        {(date.getHours()<10?'0':'') + date.getHours() + ':' + (date.getMinutes()<10?'0':'') + date.getMinutes()}
      </div>
      <div className='commentAuthor'>
        {comment.uName}
      </div>
      <div className='commentText'>
        {comment.text}
      </div>
    </div>
  )
}

export default Comment