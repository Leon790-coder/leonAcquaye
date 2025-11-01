// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

// --- Paste your Firebase config here ---
const firebaseConfig = {
  apiKey: "AIzaSyAkPvSs08icG6iPAie7CI6erbXt7lrmQkk",
    authDomain: "pdf-hub-abe72.firebaseapp.com",
    projectId: "pdf-hub-abe72",
    storageBucket: "pdf-hub-abe72.firebasestorage.app",
    messagingSenderId: "522811029037",
    appId: "1:522811029037:web:0bae02d0780db47db96aa4",
    measurementId: "G-JH8L41HNH7"
};

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// --- Export for other files to use ---
export { app, db, storage, auth };


//firebase test
console.log("✅ Firebase connected successfully!");

