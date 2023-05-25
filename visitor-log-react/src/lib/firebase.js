// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import { getFirestore } from 'firebase/firestore';
import 'firebase/compat/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyByxdtQH0B6gv6JeRPukjhsaeTuvQJZcJ4",
  authDomain: "visitor-log-d8b6c.firebaseapp.com",
  projectId: "visitor-log-d8b6c",
  storageBucket: "visitor-log-d8b6c.appspot.com",
  messagingSenderId: "557864423616",
  appId: "1:557864423616:web:b83c7a34f15fc91a74dd25",
  measurementId: "G-8RRJWNTKMX"
};
const app = firebase.initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = firebase.auth()

// Initialize Firebase

//const analytics = getAnalytics(app);

export function handleFirebaseError(err) {
  switch (err){
    case "Firebase: Error (auth/network-request-failed).": return "Check your internet connection and try again!";
    case "Firebase: Error (auth/user-not-found).": return "A user with this email is not registered!";
    case "Firebase: Error (auth/wrong-password).": return "Invalid password!";
    default: return err
  }
}