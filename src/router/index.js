import Vue from 'vue'
import VueRouter from 'vue-router'
import Register from '../components/Register.vue'
import Chatbot from '../components/Chatbot.vue'
import firebase from 'firebase'
// import store from '../store/index.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/',
    name: 'Chatbot',
    component: Chatbot,
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to,from, next) => {
  // const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  // const loggedIn = store.getters.user.loggedIn;
  const loggedIn = firebase.auth().currentUser;
  console.log('store', loggedIn);
  console.log('auth', requiresAuth);
  if (requiresAuth && !loggedIn){
    next('/register');
  } else {
    next();
  }
});

export default router
