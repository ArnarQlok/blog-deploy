
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCuxkWxkNlUp1vUsq12Bpn-H00U1lB_ToU",
  authDomain: "blog-c6102.firebaseapp.com",
  projectId: "blog-c6102",
  storageBucket: "blog-c6102.appspot.com",
  messagingSenderId: "589067309646",
  appId: "1:589067309646:web:296e5b3630f34d4cd9691f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };