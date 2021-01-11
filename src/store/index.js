import Vue from 'vue'
import Vuex from 'vuex'
// import VuexPersist from 'vuex-persist';

Vue.use(Vuex)

// const vuexCookie = new VuexPersist({
//   key: "cookieStore", // The key to store the state on in the storage provider
//   restoreState: (key, storage) => Cookies.getJSON(key),
//   saveState: (key, state, storage) =>
//     Cookies.set(key,state, {
//       expires: 30, //expires in 30 days
//     }),
//   modules: ["authentication"], //only save user.auth module
// });

// plugins: [vuexCookie.plugin];

export default new Vuex.Store({
  state: {
    user: {
      loggedIn: false,
      data: null
    }
  },
  getters: {
    user(state){
      return state.user
    },
    isLoggedIn: state => !!state.token
  },
  mutations: {
    SET_LOGGED_IN(state, value){
      state.user.loggedIn = value;
    },
    SET_USER(state, data){
      state.user.data = data;
    }
  },
  actions: {
    fetchUser({commit}, user){
      commit("SET_LOGGED_IN", user !== null);
      if (user) {
        commit("SET_USER", {
          displayName: user.displayName,
          email: user.email
        });
      } else {
        commit("SET_USER", null);
      }
    }
  }
});

