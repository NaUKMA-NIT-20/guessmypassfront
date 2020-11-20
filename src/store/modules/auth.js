import Axios from 'axios'
import router from '../../router/index.js'
export default {
  namespaced: true,
  state: {
    tokenApi: localStorage.getItem('token') || null,
    publicKey: localStorage.getItem('publicKey') || null,
    username: localStorage.getItem('username') || null
  },
  mutations: {
    setUsername (state, params) {
      localStorage.setItem('username', params)
      state.username = localStorage.getItem('username')
    },
    setToken (state, token) {
      localStorage.setItem('token', token)
      state.tokenApi = localStorage.getItem('token')
    },
    setPublicKey (state, key) {
      localStorage.setItem('publicKey', key)
      state.publicKey = localStorage.getItem('publicKey')
    },
    resetUser (state) {
      localStorage.setItem('token', null)
      localStorage.setItem('publicKey', null)
      localStorage.setItem('username', null)
      state.tokenApi = localStorage.getItem('token')
      state.publicKey = localStorage.getItem('publicKey')
      state.username = localStorage.getItem('username')
    }
  },
  actions: {
    toRegister (context, params) {
      return new Promise((resolve, reject) => {
        Axios.post('https://guessmypass.herokuapp.com/user/register', params).then(
          response => {
            if (response.status === 200) {
              if (response.data !== 'Wrong request. User already exists') {
                resolve(response.data)
              } else {
                reject(response)
              }
            } else {
              reject(response)
            }
          }).catch(error => {
          reject(error.response)
        })
      })
    },
    toLogin (context, params) {
      return new Promise((resolve, reject) => {
        Axios.post('https://guessmypass.herokuapp.com/user/login', params).then(
          response => {
            if (response.status === 200) {
              context.commit('setToken', response.data.token)
              context.commit('setUsername', response.data.username)
              router.push({
                name: 'Home'
              })
              resolve(response.data)
            } else {
              reject(response)
            }
          }
        ).catch(error => {
          reject(error.response)
        })
      })
    },
    toLogout (context) {
      context.commit('resetUser')
      router.push({
        name: 'Authentication'
      })
    },
    changePassword (context, params) {
      const config = {
        headers: { Authorization: context.getters.getToken }
      }
      return new Promise((resolve, reject) => {
        Axios.put('https://guessmypass.herokuapp.com/user/options/password', params, config)
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

    changeUsername (context, params) {
      const config = {
        headers: { Authorization: context.getters.getToken }
      }
      return new Promise((resolve, reject) => {
        Axios.put('https://guessmypass.herokuapp.com/user/options/username', params, config)
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
    createPublicKey (context, params) {
      context.commit('setPublicKey', params)
    },
    saveNewUsername (context, params) {
      context.commit('setUsername', params)
    }
  },
  getters: {
    getToken: state => {
      return state.tokenApi
    },
    isAuthenticated: state => {
      return state.tokenApi !== 'null' && state.tokenApi !== null
    },
    getPublicKey: state => {
      return state.publicKey
    },
    getUsername: state => {
      return state.username
    },
    getPassword: state => {
      return state.password
    }
  }
}
