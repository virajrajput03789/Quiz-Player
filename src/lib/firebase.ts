import { getApp, getApps, initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const hasConfig = Object.values(firebaseConfig).every(Boolean)
let firebaseInitError: string | null = null
let db: ReturnType<typeof getFirestore> | null = null

if (hasConfig) {
  try {
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
    db = getFirestore(app)
  } catch {
    firebaseInitError = 'Leaderboard unavailable right now.'
  }
} else {
  firebaseInitError = 'Missing Firebase environment variables.'
}

export { db, hasConfig as isFirebaseConfigured, firebaseInitError }
