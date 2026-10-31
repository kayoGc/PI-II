// arquivo de configuração do firebase
import { initializeApp } from "firebase/app";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2pG-xdgtHNtUxKETz0t4lnlndmnsgWYw",
  authDomain: "teste-2d485.firebaseapp.com",
  databaseURL: "https://teste-2d485-default-rtdb.firebaseio.com",
  projectId: "teste-2d485",
  storageBucket: "teste-2d485.firebasestorage.app",
  messagingSenderId: "1011801519406",
  appId: "1:1011801519406:web:14905cab2209f72c0136bf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app);
const functions = getFunctions(app);

// 🛠️ Alterado para usar NODE_ENV do Next.js e removida a barra do Auth
if (process.env.NODE_ENV === 'development') {
  console.log("🛠️ Conectando aos emuladores locais do Firebase...");
  
  // Um bloco try/catch para evitar erros se o app tentar reconectar quente (Fast Refresh)
  try {
    connectDatabaseEmulator(database, '127.0.0.1', 9000);
    connectStorageEmulator(storage, '127.0.0.1', 9199);
    connectFunctionsEmulator(functions, '127.0.0.1', 5001);
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  } catch (error) {
    console.log("Emuladores já estavam conectados:", error);
  }
}

export { database, storage, auth, functions };