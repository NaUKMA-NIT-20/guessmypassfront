import Axios from 'axios'
import router from '../../router/index.js'
export default {
  namespaced: true,
  state: {
    tokenApi: localStorage.getItem('token') || null,
    authenticated: false
  },
  mutations: {
    setToken (state, token) {
      localStorage.setItem('token', token)
      state.tokenApi = localStorage.getItem('token')
    },
    setAuthenticated (state) {
      state.authenticated = true
    },
    resetUser (state) {
      localStorage.setItem('token', null)
      state.tokenApi = localStorage.getItem('token')
      state.authenticated = false
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
              context.commit('setAuthenticated')
              context.commit('setToken', response.data.token)
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
    }
  },
  getters: {
    getToken: state => {
      return state.tokenApi
    },
    isAuthenticated: state => {
      return state.authenticated
    }
  }
}
