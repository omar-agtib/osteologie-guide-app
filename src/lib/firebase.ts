import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBKd0AYvZcXQwcPfGUKYlxA8AHEoojfTis",
  authDomain: "osteologie-guide.firebaseapp.com",
  projectId: "osteologie-guide",
  storageBucket: "osteologie-guide.firebasestorage.app",
  messagingSenderId: "62353217282",
  appId: "1:62353217282:web:fc76cdea5d376bedfb941b",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
