// arquivo de configuração do firebase
import { initializeApp } from "firebase/app";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getAuth, connectAuthEmulator } from "firebase/auth";

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

// conecta no emulador
if (process.env.NEXT_PUBLIC_IS_DEV) {
  connectDatabaseEmulator(database, '127.0.0.1', 9000);
  connectStorageEmulator(storage, '127.0.0.1', 9199);
  connectAuthEmulator(auth, 'http://127.0.0.1:9099/');
}


export { database, storage, auth }