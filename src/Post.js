import React,{ useState,useEffect } from 'react';
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import {db,auth, storage} from './firebase';
import firebase from "firebase";
import {Button} from "@material-ui/core";

function Post({email,user,username,caption,imageUrl,postId}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    const [likes, setlikes] = useState([]);
    const [liked,setLiked] = useState("false");



    useEffect(() => {
        let unsubscribe;
        if (postId) {
          unsubscribe = db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp','desc')
            .onSnapshot((snapshot) => {
              setComments(snapshot.docs.map((doc) => doc.data()));
            });
        }
  
        return () => {
          unsubscribe();
        };
      }, [postId]);

      useEffect(() => {
        let unsubscribe;
        if (postId) {
          unsubscribe = db
            .collection("posts")
            .doc(postId)
            .collection("likes")
            .onSnapshot((snapshot) => {
              setlikes(snapshot.docs.map((doc) => doc.data()))
              // console.log(likes);
            });
          }
  
        return () => {
          unsubscribe()
        };
      }, [postId]);

  
      const postComment = (e) => {
        e.preventDefault();
  
        db.collection("posts").doc(postId).collection("comments").add({
          text: comment,
          username: user.displayName,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setComment("");
      };
      
      const updateLike = (e) => {
        e.preventDefault();
        
        if(user&&likes.map((like) => like.username).indexOf(user.displayName)==-1){
          db.collection("posts").doc(postId).collection("likes").add({
            username: user.displayName,
          });
        }
      };
      
          
        
      
    return (
        <div className="post">
            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    src="https://st2.depositphotos.com/3369547/11372/v/950/depositphotos_113724550-stock-illustration-businessman-concept-avatar-male-person.jpg"
                    alt="username"
                />
                <h3>{username}</h3>

            </div>

            <img className="post__image"
             src={imageUrl}
                alt="image"
                onDoubleClick={updateLike}
            />
            
            <h4 className="post__text">
              { user && (
                likes.map((like) => like.username).indexOf(user.displayName)==-1 ?
                <div className="like_btn" onClick={updateLike}>♡</div>
                  :<div className="like_btn active" onClick={updateLike} color="red"  >♥</div>
                )}
                {likes.length} Likes
            </h4>
            <h4 className="post__text">
              
               
                <strong> {username} </strong>
                {caption}
            </h4>

            <div className="post__comments">
                {comments.map((comment) => (
                    <p>
                    <b>{comment.username}</b> {comment.text}
                    </p>
                ))}
            </div>

            {/* <div className="post__comments">
                {likes.map((like) => (
                    <p>
                      <b>{like.email}</b> 
                    </p>
                ))}
            </div> */}

            { user && (
                <form className="post__commentBox">
                    <input
                    className="post__input input"
                    type="text"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                    disabled={!comment}
                    className="post__button"
                    type="submit"
                    onClick={postComment}
                    >
                    Post
                    </button>
                </form>
            )}
        </div>
    )
}

export default Post
