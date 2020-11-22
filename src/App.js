import logo from './logo.svg';
import './App.css';
import Post from './Post';
import React,{ useState,useEffect } from 'react';
import {db} from './firebase';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal';

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

  useEffect(() => {
  db.collection('posts').onSnapshot(snapshot => {
    setPosts(snapshot.docs.map(doc =>({
      id: doc.id,
      post: doc.data()
    })))
  })
}, [posts])

  const signup= (event) => {

  }

  return (
    <div className="app">

      <Modal
        open={open}
        onClose={()=> setOpen(false)}
        >
        <div style={modalStyle} className={classes.paper}>
          <h2>Text in a modal</h2>
        </div>
      </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
          alt="instagram"
       />
      </div>

      <Button onclick={() => setOpen(true)}>Sign Up</Button>

      <h1>Helloooooo, Im creating instagram clone with react</h1>
      {
        posts.map(({id,post}) => {
       return   <Post key={id} username={post.username} imageUrl={post.imageUrl} caption={post.caption} />
        })
      }

    </div>
  );
}

export default App;
