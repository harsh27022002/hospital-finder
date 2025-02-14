import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD4SleZbXMwmBKj7x1mPWxhIHGA_n3rpZs",
    authDomain: "hospital-finder-17044.firebaseapp.com",
    projectId: "hospital-finder-17044",
    storageBucket: "hospital-finder-17044.firebasestorage.app",
    messagingSenderId: "894955091163",
    appId: "1:894955091163:web:c4727f63bfc3ed060a08fe",
    measurementId: "G-BKFM1BMPJV"
  };
  

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = () => signInWithPopup(auth, provider);
const logout = () => signOut(auth);

export { auth, signInWithGoogle, logout };
