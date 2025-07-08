import { initializeApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const env = Constants.expoConfig?.extra;

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
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { app, auth, getAuth };
