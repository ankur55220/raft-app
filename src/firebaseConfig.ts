// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqj3EkXGT4rzTPWWg3HgejzZPiJCnj3lk",
  authDomain: "raft-app-ba39a.firebaseapp.com",
  projectId: "raft-app-ba39a",
  storageBucket: "raft-app-ba39a.appspot.com",
  messagingSenderId: "737459318150",
  appId: "1:737459318150:web:1e8941bb3260cc4f829007"
};



// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db=getFirestore(app)


const storage=getStorage(app)