import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// Firebase project settings for the external login service.
const firebaseConfig = {
  apiKey: 'AIzaSyCRJBAmZFSNdY75m6wZurDYuNdpJe8HQ94',
  authDomain: 'zzha-902bd.firebaseapp.com',
  projectId: 'zzha-902bd',
  storageBucket: 'zzha-902bd.firebasestorage.app',
  messagingSenderId: '33280294562',
  appId: '1:33280294562:web:979a3ef925de460a49e1fb'
}

// Reuse the app if this file is loaded more than once.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
const auth = getAuth(app)

export { auth }
