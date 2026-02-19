import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyBk_2XgpDZWG5Xr5P68CPHs8WXD_lYbeOw',
  authDomain: 'aivo-rqaqj7hmac05-5261.firebaseapp.com',
  projectId: 'aivo-rqaqj7hmac05-5261',
  storageBucket: 'aivo-rqaqj7hmac05-5261.firebasestorage.app',
  messagingSenderId: '864959664713',
  appId: '1:864959664713:web:3ed330c16a1a55d2dde598',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
