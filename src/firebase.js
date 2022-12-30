// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcSCkyahA0Y4WOPHxipy0LDlKE6NzDNJo",
  authDomain: "milo-259f7.firebaseapp.com",
  projectId: "milo-259f7",
  storageBucket: "milo-259f7.appspot.com",
  messagingSenderId: "391501099473",
  appId: "1:391501099473:web:4307e952204430336970f0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
