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
