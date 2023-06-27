import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore, setDoc, doc, getDoc, collection,addDoc } from "firebase/firestore";
import {ref, getStorage, uploadBytes, } from "firebase/storage";

// Optionally import the services that you want to use

//import {...} from "firebase/database";
//import {...} from "firebase/functions";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID
};

// Initialize Firebase
export const Firebase = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(Firebase);

export const db = getFirestore(Firebase);