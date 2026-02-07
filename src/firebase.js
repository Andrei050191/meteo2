import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Importăm baza de date

const firebaseConfig = {
  apiKey: "AIzaSyCSNlyWWVvQc-Za79i7MaEJABOn_xsI1N4",
  authDomain: "weather2-c2b31.firebaseapp.com",
  projectId: "weather2-c2b31",
  storageBucket: "weather2-c2b31.firebasestorage.app",
  messagingSenderId: "152076307224",
  appId: "1:152076307224:web:41bd60c287a6455c83ec6d"
};

// Inițializăm Firebase
const app = initializeApp(firebaseConfig);

// Inițializăm Firestore și îl exportăm ca să-l folosim în Home.jsx
export const db = getFirestore(app);