import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDzLx8UMFPx1MeW2Xf1etYoDZWCQcZBzGU",
  authDomain: "smartcampus-57cfc.firebaseapp.com",
  projectId: "smartcampus-57cfc",
  storageBucket: "smartcampus-57cfc.firebasestorage.app",
  messagingSenderId: "150302562497",
  appId: "1:150302562497:web:8c68a85b2fbfee260dc40",
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

export const auth = getAuth(app)
export const db = getFirestore(app)
