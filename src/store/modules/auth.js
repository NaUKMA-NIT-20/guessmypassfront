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
                reject(response.data)
              }
            } else {
              reject(response.data)
            }
          }).catch(error => {
             reject(error)
        })
      })
    },
    toLogin (context, params) {
      return new Promise((resolve, reject) => {
        Axios.post('https://guessmypass.herokuapp.com/user/login', params).then(
          response => {
            if (response.status === 200) {
              context.commit('setToken', response.data.dbId.timestamp)
              context.commit('setAuthenticated')
              router.push('/')
              resolve(response.data)
            } else {
              reject(response)
            }
          }
        ).catch(error => {
          reject(error)
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
