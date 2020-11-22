import firebase from 'firebase';

const firebaseApp =  firebase.initializeApp({
  apiKey: "AIzaSyB1QYXYZ0seJB9W8PRtRS5C42Wt4M-FFXk",
  authDomain: "instagram-clone-react-7f521.firebaseapp.com",
  databaseURL: "https://instagram-clone-react-7f521.firebaseio.com",
  projectId: "instagram-clone-react-7f521",
  storageBucket: "instagram-clone-react-7f521.appspot.com",
  messagingSenderId: "949348654552",
  appId: "1:949348654552:web:a1bef5610a13f1b064a6ad",
  measurementId: "G-9RNY4LD4M3"
});

const db=firebaseApp.firestore();
const auth=firebase.auth();
const storage=firebase.storage();

export {db,auth,storage};

// export default db;
