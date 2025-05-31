import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyAVOqm2RjCokn1aAgXs85hxupmyVWNA-cQ',
    authDomain: 'imageupdatedb.firebaseapp.com',
    projectId: 'imageupdatedb',
    storageBucket: 'imageupdatedb.appspot.com',
    messagingSenderId: '640036381047',
    appId: '1:640036381047:web:13ba29c6b5c7ba260b8172',
};

const app = initializeApp(firebaseConfig);
export const imageDB = getStorage(app);
