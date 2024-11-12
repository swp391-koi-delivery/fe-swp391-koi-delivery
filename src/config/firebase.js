// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDBMVKQu70j5z1ZH3TFnBUqmphvoNKwG8",
  authDomain: "koi-fish-delivery.firebaseapp.com",
  projectId: "koi-fish-delivery",
  storageBucket: "koi-fish-delivery.appspot.com",
  messagingSenderId: "84496872349",
  appId: "1:84496872349:web:355ba50631144617f17574",
  measurementId: "G-H9JWMGG6S5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { storage, googleProvider };
