import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC1audfCZHw5OZg0QFT-RkCfYt12Xq3qEw",
  authDomain: "react-native-mobile-class.firebaseapp.com",
  databaseURL: "https://react-native-mobile-class-default-rtdb.firebaseio.com",
  projectId: "react-native-mobile-class",
  storageBucket: "react-native-mobile-class.appspot.com",
  messagingSenderId: "10924546893",
  appId: "1:10924546893:web:42a6af4e1e286d64053504",
  measurementId: "G-2Y8K367YV8",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export default db;
