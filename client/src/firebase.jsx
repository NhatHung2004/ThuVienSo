// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCF753jfYMUhmDxonLMj1pmurPjc_hyYIg",
  authDomain: "library-70759.firebaseapp.com",
  projectId: "library-70759",
  storageBucket: "library-70759.firebasestorage.app",
  messagingSenderId: "1032124671914",
  appId: "1:1032124671914:web:7f3667713e3e6ceb90edd3",
  measurementId: "G-YX8CDB456X",
};

// Init once
const app = initializeApp(firebaseConfig);

// Export services
export const db = getDatabase(app);
export const messaging = getMessaging(app);
