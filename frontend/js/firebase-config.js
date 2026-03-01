// Firebase configuration for compat SDK
// Using global firebase object loaded from CDN script tags
const firebaseConfig = {
  apiKey: "AIzaSyBI4rGUnnAt6QtXFqmgCVkmRw-Q0Cb9MJE",
  authDomain: "creazoneergclub.firebaseapp.com",
  projectId: "creazoneergclub",
  storageBucket: "creazoneergclub.firebasestorage.app",
  messagingSenderId: "1058283967139",
  appId: "1:1058283967139:web:7f133d9b7540133566e516",
  measurementId: "G-GD4E68WKQM"
};

// Initialize Firebase using the compat SDK global
if (window.firebase) {
  firebase.initializeApp(firebaseConfig);
}