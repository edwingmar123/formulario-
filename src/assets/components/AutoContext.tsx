import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth, db } from "./Credenciales";
import { doc, setDoc, getDoc, collection } from "firebase/firestore"; // Añadí collection aquí

interface AuthContextType {
  user: User | null;
  loading: boolean;
  googleSignIn: () => Promise<void>;
  logOut: () => Promise<void>;
  saveCV: (cvData: any) => Promise<string>; // Especificamos que retorna una Promise<string>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const syncUserData = async (currentUser: User) => {
    const userRef = doc(db, "informacion", currentUser.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      await setDoc(userRef, {
        email: currentUser.email,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        createdAt: new Date(),
      });
    }
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await syncUserData(result.user);
      setUser(result.user);
      return; // Añadí return explícito
    } catch (error) {
      console.error("Error en Google Sign-In:", error);
      throw error; // Propaga el error
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw error;
    }
  };

  const saveCV = async (cvData: any): Promise<string> => {
    if (!user) throw new Error("Usuario no autenticado");

    try {
      const cvRef = doc(collection(db, "intinerario"));
      await setDoc(cvRef, {
        ...cvData,
        userId: user.uid,
        createdAt: new Date(),
      });
      return cvRef.id;
    } catch (error) {
      console.error("Error al guardar CV:", error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) await syncUserData(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, googleSignIn, logOut, saveCV }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};
