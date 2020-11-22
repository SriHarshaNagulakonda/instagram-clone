import React,{ useState } from 'react';
import './Post.css';
import Avatar from '@material-ui/core/Avatar';

function Post({username,caption,imageUrl}) {
    return (
        <div className="post">
            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    src="https://cdn3.vectorstock.com/i/1000x1000/16/87/man-character-face-avatar-portrait-vector-15281687.jpg"
                    alt="username"
                />
                <h3>{username}</h3>

            </div>

            <img className="post__image"
             src={imageUrl}
                alt="image"
            />

            <h4 className="post__text">
                <strong> {username} </strong>
                {caption}
            </h4>
        </div>
    )
}

export default Post
