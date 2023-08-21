// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBoBrICvM-s3x-xcAnA66H-OMeSHpdKSs",
  authDomain: "bussiness-tour.firebaseapp.com",
  databaseURL: "https://bussiness-tour-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bussiness-tour",
  storageBucket: "bussiness-tour.appspot.com",
  messagingSenderId: "804257970364",
  appId: "1:804257970364:web:294920122f7afc73ff78b9"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

export default firebase
