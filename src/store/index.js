import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import cards from './modules/cards'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  getters: {
  },
  modules: {
    auth: auth,
    cards: cards
  }
})
