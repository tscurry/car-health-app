import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD2uZNifE3AH1caovb___yg-92g_dzMouw",
    authDomain: "car-health-mobile-app.firebaseapp.com",
    databaseURL: "https://car-health-mobile-app.firebaseio.com",
    projectId: "car-health-mobile-app",
    storageBucket: "car-health-mobile-app.appspot.com",
    messagingSenderId: "328724028958",
    appId: "1:328724028958:web:c0065c7855c966b87f980f",
    measurementId: "G-W7PM76ZV5B"
};

firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();

export { firebase };