import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBP0tK5ND1tECQ4Md6S-PjAvRc2gBsDlks",
    authDomain: "vue3pinia.firebaseapp.com",
    projectId: "vue3pinia",
    storageBucket: "vue3pinia.appspot.com",
    messagingSenderId: "837445167732",
    appId: "1:837445167732:web:8cbb208b231f614e4e7f21"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth()
const db = getFirestore()
const storage = getStorage(firebaseApp) 

export { auth, db, storage }