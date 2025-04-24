import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Añade esto para manejar la foto

const firebaseConfig = {
  apiKey: "AIzaSyAHGOswa0klrK-1i7MFu-59BhgxM-6jUXc",
  authDomain: "formulario-d49d3.firebaseapp.com",
  projectId: "formulario-d49d3",
  storageBucket: "formulario-d49d3.appspot.com", // Corregí esto
  messagingSenderId: "175358336949",
  appId: "1:175358336949:web:039f464e911846923f03fc",
  measurementId: "G-TRY3TB7WQP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Para manejar la imagen