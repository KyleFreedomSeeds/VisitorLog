// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import 'firebase/compat/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

const app = firebase.initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = firebase.auth()

// Initialize Firebase

export const analytics = getAnalytics(app);

export function handleFirebaseError(err) {
  switch (err){
    case "Firebase: Error (auth/network-request-failed).": return "Check your internet connection and try again!";
    case "Firebase: There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found).": return "A user with this email is not registered!";
    case "Firebase: The password is invalid or the user does not have a password. (auth/wrong-password).": return "Invalid password!";
    case "Firebase: The email address is already in use by another account. (auth/email-already-in-use).": return "Email is already registered!"
    default: return err
  }
}