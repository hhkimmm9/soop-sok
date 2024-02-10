// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdqIiHXy8DMx41SCIMlyFP38oQ2cIHTIc",
  authDomain: "chat-platform-for-introverts.firebaseapp.com",
  projectId: "chat-platform-for-introverts",
  storageBucket: "chat-platform-for-introverts.appspot.com",
  messagingSenderId: "389510886605",
  appId: "1:389510886605:web:423c6956db1b9ecbc56584",
  measurementId: "G-172K4S35K4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);