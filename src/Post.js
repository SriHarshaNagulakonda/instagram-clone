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
            setTimeout(function(){ 
              // setLiked(likes.map((like) => like.email).indexOf("sriharshanagulakonda@gmail.com"));
              setLiked(likes.length);
            }, 8000);
            

            // setLiked("false");
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
        
        if(likes.map((like) => like.email).indexOf(email)==-1){
          db.collection("posts").doc(postId).collection("likes").add({
            email: email,
          });
        }
      };
      
        
          // const likes=db.collection("posts").doc(postId).collection("likes").get({
          //   email:email
          // });
          
        
      
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
              { user && (
                likes.map((like) => like.email).indexOf(email)==-1 ?
                <Button className="like_btn" onClick={updateLike}>Like 👍</Button>
                  :<Button onClick={updateLike} className="like_btn active" > LIKED </Button>
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
                    className="post__input"
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
