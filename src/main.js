import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router/index'
import store from './store/index'
import vuetify from './plugins/vuetify';
import firebase from "firebase";

Vue.config.productionTip = false

const configOptions = {
  apiKey: "AIzaSyDv1bnbHiOrMnNz8GAVv9J0sswmVHpWuTo",
  authDomain: "sofiaforseniors-ohwbgj.firebaseapp.com",
  databaseURL: "https://sofiaforseniors-ohwbgj.firebaseio.com",
  projectId: "sofiaforseniors-ohwbgj",
  storageBucket: "sofiaforseniors-ohwbgj.appspot.com",
  messagingSenderId: "163858115357",
  appId: "1:163858115357:web:dd0cc7a9467748b9768ff4"
};

firebase.initializeApp(configOptions);


const messaging = firebase.messaging();

messaging.usePublicVapidKey("BHPlzuG9D3SHe7nv2xB2tDGtqgBVxuHhqTGYN84WcSAhcOr6EOlk0VW_d1kfWcJiQxeDbpjC21NWaJ1EiPCpY3U");

messaging.requestPermission().then(()=>{
  console.log('Notification permission granted.');

  messaging.getToken().then((token) => {
    console.log("from main: ", token);
  })
}).catch((err)=>{
  console.log('unable to get permission to notify.', err);
});

// messaging.onMessage((payload) => {
//   console.log('Message received. ', payload);
// });

// messaging.onTokenRefresh(()=>{
//   messaging.getToken().then((newToken) => {
//     console.log(newToken);
//   })
//   .catch((error) => {
//     console.log(error);
//   });
// });


let app = '';
firebase.auth().onAuthStateChanged(() => {
  if (!app){
    new Vue({
      router,
      store,
      vuetify,
      render: (h) => h(App),
    }).$mount("#app");
  }
});
