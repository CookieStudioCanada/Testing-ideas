// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signOut } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, getDocs, addDoc, collection, deleteDoc, updateDoc, increment, query, where } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkiGQQwNdhOHY-fPGcfXvH8FdDDqtHt8E",
  authDomain: "emailai-da03d.firebaseapp.com",
  projectId: "emailai-da03d",
  storageBucket: "emailai-da03d.appspot.com",
  messagingSenderId: "856154231175",
  appId: "1:856154231175:web:91794dcd31d8bde1188322",
  measurementId: "G-3Q9ZTTLES1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);