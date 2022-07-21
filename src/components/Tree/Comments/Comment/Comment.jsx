import './Comment.css';
import React from 'react';

const Comment = (props) => {
    let date = props.date;
    date = parseInt(date)
    date = new Date(date);
    const strDate = date.getHours() + ':' + date.getMinutes();
    return (
        <div className='comment'>
            <div className='date'>{strDate}</div>
            <div className='username'>{props.uName}:</div>
            {props.text}
        </div>
    );
}

export default Comment;