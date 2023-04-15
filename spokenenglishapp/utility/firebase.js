import firebase from '@react-native-firebase/app';

// Import the Firebase services you want to use
import '@react-native-firebase/auth';
import '@react-native-firebase/database';

// Initialize Firebase with your Firebase project's configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCJIQyIRVqHhAkVZP6vejpsckJZFmmijKg',
  databaseURL: 'https://spokenenglishapp-default-rtdb.firebaseio.com',
  projectId: 'spokenenglishapp',
  storageBucket: 'spokenenglishapp.appspot.com',
  appId: '1:571629450425:android:16d979589951fb9ed09768',
};

firebase.initializeApp(firebaseConfig);
