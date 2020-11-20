import Axios from 'axios'
import { encryptingFunctions } from '../../assets/js/Cryptor'
// import auth from './auth'
// import router from '../../router/index.js'

export default {
  namespaced: true,
  state: {
    cards: []
  },
  mutations: {
    setCards (state, cards) {
      cards.forEach(card => {
        Object.keys(card).map(function (key, index) {
          if (key !== 'id') {
            card[key] = encryptingFunctions.decrypt(card[key])
          }
        })
      })

      state.cards = cards
    }
  },
  actions: {
    getCards (context) {
      const config = {
        headers: { Authorization: context.rootState.auth.tokenApi }
      }
      return new Promise((resolve, reject) => {
        Axios.get('https://guessmypass.herokuapp.com/data', config)
          .then(response => {
            if (response.status === 200) {
              context.commit('setCards', response.data)
              resolve(response.data)
            } else {
              reject(response)
            }
          })
          .catch(error => {
            reject(error.response)
          })
      })
    },
    addCard (context, params) {
      const config = {
        headers: { Authorization: context.rootState.auth.tokenApi }
      }
      return new Promise((resolve, reject) => {
        Axios.post('https://guessmypass.herokuapp.com/data', params, config)
          .then(response => {
            if (response.status === 200) {
              resolve(response.data)
            } else {
              reject(response)
            }
          })
          .catch(error => {
            reject(error.response)
          })
      })
      },
    updateCard (context, params) {
      const config = {
        headers: { Authorization: context.rootState.auth.tokenApi }
      }
      return new Promise((resolve, reject) => {
        Axios.put('https://guessmypass.herokuapp.com/data', params, config)
          .then(response => {
            if (response.status === 200) {
              resolve(response.data)
            } else {
              reject(response)
            }
          })
          .catch(error => {
            reject(error.response)
          })
      })
    },
    deleteCard (context, id) {
      const config = {
        headers: { Authorization: context.rootState.auth.tokenApi }
      }
      return new Promise((resolve, reject) => {
        Axios.delete(`https://guessmypass.herokuapp.com/data/${id}`, config)
          .then(response => {
            if (response.status === 200) {
              resolve(response.data)
            } else {
              reject(response)
            }
          })
          .catch(error => {
            reject(error.response)
          })
      })
    }
    },
  getters: {
    getCards (state) {
      return state.cards
    },
    getIds (state) {
      return state.cards.map(card => card.id)
    },
    getViews (state) {
      return state.cards.map(card => {
        const id = card.id
        const name = card.id
        return {
          id, name
        }
      })
    }
  }
}
