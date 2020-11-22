import React, {useState} from 'react'
import { Button } from '@material-ui/core'
import {db,auth, storage} from './firebase';
import firebase from "firebase";
import "./ImageUpload.css";


function ImageUpload({username}) {
    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState();

    const handleChange = (e) => {
        if(e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // progress function ...
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress);
          },
          (error) => {
            // Error function ...
            console.log(error);
          },
          () => {
            // complete function ...
            storage
              .ref("images")
              .child(image.name)
              .getDownloadURL()
              .then((url) => {
                // setUrl(url);
    
                // post image inside db
                db.collection("posts").add({
                  imageUrl: url,
                  caption: caption,
                  username: username,
                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                })
                .catch((error) => alert(error));
    
                setProgress(0);
                setCaption("");
                setImage(null);
              });
          }
        );
      };
    
    return (
        <div className="imageUpload">
            <progress className="imageUpload__progress" value={progress} max="100" />
            <input className="input__caption" type="text" placeholder="Enter a Caption" value={caption} onChange={(e)=> setCaption(e.target.value)} />
            <input type="file" onChange={handleChange} />
            <button className="post__button" onClick={handleUpload} >
                Upload Post
            </button>  
        </div>
    )
}

export default ImageUpload
