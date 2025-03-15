import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyC-J9B4bndHpKt1JKQJnFM4jSgmIYvjPx0",
    authDomain: "mindful-map-mobile.firebaseapp.com",
    projectId: "mindful-map-mobile",
    storageBucket: "mindful-map-mobile.firebasestorage.app",
    messagingSenderId: "790657022736",
    appId: "1:790657022736:web:d41447e8893439e75a8395",
    measurementId: "G-XZBPFBQNBC"
  };

  const app = initializeApp(firebaseConfig);
  const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  
  export { auth };