import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Añade esto para manejar la foto

const firebaseConfig = {
  apiKey: "AIzaSyAZnWhSwiUS3qI43FKWVkYLtiVZJKF6uGY",
  authDomain: "itinerario-e48ab.firebaseapp.com",
  projectId: "itinerario-e48ab",
  storageBucket: "itinerario-e48ab.firebasestorage.app",
  messagingSenderId: "353766319708",
  appId: "1:353766319708:web:8a7df3d4e1fd7b2d59e899"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Para manejar la imagen