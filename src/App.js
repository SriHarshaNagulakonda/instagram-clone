import logo from './logo.svg';
import './App.css';
import Post from './Post';
import React,{ useState,useEffect } from 'react';
import {db,auth} from './firebase';
import { Button, Input } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal';
import ImageUpload from './ImageUpload';
import InstagramEmbed from "react-instagram-embed";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  }
}));


function App() {
  const classes=useStyles();
  const [modalStyle]=useState(getModalStyle);
  const [posts,setPosts]=useState([]);
  const [open, setOpen]=useState(false);
  const [openSignIn, setOpenSign]=useState(false);
  const [username, setUsername]=useState('');
  const [password, setPassword]=useState('');
  const [email, setEmail]=useState('');
  const [user, setUser]=useState();

  useEffect(() => {
  db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
    setPosts(snapshot.docs.map(doc =>({
      id: doc.id,
      post: doc.data()
    })))
  })
}, [posts])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        console.log(authUser);
        setUser(authUser);
      }
      else{
        setUser(null);
      }
    })

    return () =>{
      unsubscribe();
    }
  }, [user,username])

  const signup= (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));
    setOpen(false);
  }

  const signin = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email,password)
      .then((authUser) => {
        setOpenSign(false);
      })
      .catch((error) => alert(error.message))
  }

  return (
    <div className="app">

      <Modal
        open={open}
        onClose={()=> setOpen(false)}
        >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImageModal"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                alt="instagram"
              />
              <Input 
                placeholder="username"
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input 
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input 
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <br/>
              <Button type="submit" onClick={signup}>Sign Up</Button>
            </center>

          </form>

        </div>
      </Modal>

      <Modal 
        open={openSignIn}
        onClose={() => setOpenSign(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImageModal"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                alt="instagram"
              />
              <Input 
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input 
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <br/>
              <Button type="submit" onClick={signin}>Sign In</Button>
            </center>
          </form>
        </div>
      </Modal>
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/ico/favicon-192.png/68d99ba29cc8.png"
          alt="instagram"
       />

        {user ?(
          <div className="app_loginContainer">
            {user.displayName}
            <Button onClick={() => auth.signOut()}>Logout</Button>   
          </div>
        ):(
          <div className="app_loginContainer">
            <Button onClick={() => {setOpenSign(true)}}>Sign In</Button>
            <Button onClick={() => {setOpen(true)}}>Sign Up</Button>
          </div>
        )}

      </div>


      {/* <h1>Helloooooo, Im creating instagram clone with react</h1> */}
      {user?.displayName ? (
        <ImageUpload username={user.displayName}/>
      ):(
        <h3 className="login__text">Login to upload Posts</h3>
      )}
      
      <div className="app__posts">
        <div className="app__postsLeft">
          {/* <FlipMove> */}
            {posts.map(({ id, post }) => (
              <Post
                user={user}
                key={id}
                postId={id}
                username={post.username}
                caption={post.caption}
                imageUrl={post.imageUrl}
                email={email}
              />
            ))}
          {/* </FlipMove> */}
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
            url="https://www.instagram.com/p/B_uf9dmAGPw/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>


    </div>
  );
}

export default App;
