import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDBlQf7m7OBThZgZoDoQJUUIMFS2ecPraw",
  authDomain: "yombal-964c8.firebaseapp.com",
  projectId: "yombal-964c8",
  storageBucket: "yombal-964c8.firebasestorage.app",
  messagingSenderId: "322157989573",
  appId: "1:322157989573:web:0d02e8b2845199b35baaac",
  measurementId: "G-NN6DFRJE6R",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
