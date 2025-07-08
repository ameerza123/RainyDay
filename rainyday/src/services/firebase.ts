import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import Constants from 'expo-constants';

const env = Constants.expoConfig?.extra;
console.log('🔥 Firebase ENV:', env);


const firebaseConfig = {
  apiKey: env?.FIREBASE_API_KEY,
  authDomain: env?.FIREBASE_AUTH_DOMAIN,
  projectId: env?.FIREBASE_PROJECT_ID,
  storageBucket: env?.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env?.FIREBASE_MESSAGING_SENDER_ID,
  appId: env?.FIREBASE_APP_ID,
  measurementId: env?.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };

