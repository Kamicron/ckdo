import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.css'

import './assets/main.css'

  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyC9gmGp33BZuLL2q4Br8iGsi07bFAPFGlA",
    authDomain: "ckdo-cdd75.firebaseapp.com",
    projectId: "ckdo-cdd75",
    storageBucket: "ckdo-cdd75.appspot.com",
    messagingSenderId: "799915130246",
    appId: "1:799915130246:web:8563fa802020b6422c4007",
    measurementId: "G-59R5YE5SL7"
  };

  // Initialize Firebase
  const appFirebase = initializeApp(firebaseConfig);



const app = createApp(App)

app.use(router)

app.mount('#app')


