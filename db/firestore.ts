import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  APP_ID,
  AUTH_DOMAIN,
  FIREBASE_DB_URL,
  GOOGLE_API_KEY,
  MEASUREMENT_ID,
  M_SENDER_ID,
  PROJECT_ID,
  STORAGE_BUCKET,
} from "@/services/constants";

// const firebaseConfig = {
//   apiKey: "AIzaSyC1audfCZHw5OZg0QFT-RkCfYt12Xq3qEw",
//   authDomain: "react-native-mobile-class.firebaseapp.com",
//   databaseURL: "https://react-native-mobile-class-default-rtdb.firebaseio.com",
//   projectId: "react-native-mobile-class",
//   storageBucket: "react-native-mobile-class.appspot.com",
//   messagingSenderId: "10924546893",
//   appId: "1:10924546893:web:42a6af4e1e286d64053504",
//   measurementId: "G-2Y8K367YV8",
// };
const firebaseConfig = {
  apiKey: GOOGLE_API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: FIREBASE_DB_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: M_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
};
// ios: 206559309545-vgep72ttudg3nca81gh54hlcoh7vtv95.apps.googleusercontent.com
// android: 206559309545-nf8tlbg7mbmi8c92nudfvgmrf680hs4h.apps.googleusercontent.com

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);

export default db;
