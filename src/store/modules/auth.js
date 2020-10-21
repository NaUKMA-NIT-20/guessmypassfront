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
    async toRegister (context, params) {
      Axios.post('https://guessmypass.herokuapp.com/user/register', params).then(
        response => {
          if (response.status === 200) {
            if (response.data !== 'Wrong request. User already exists') {
              context.dispatch('toLogin', { email: params.email, hashedPassword: params.hashedPassword })
            }
            else {
              console.log(response.data)
              return response.data
            }
          }
          else {
            console.log(response.status)
          }
      }).catch(error => {
        console.log(error)
      })
    },
    async toLogin (context, params) {
      Axios.post('https://guessmypass.herokuapp.com/user/login', params).then(
        response => {
          if (response.status === 200) {
            context.commit('setToken', response.data.dbId.timestamp)
            context.commit('setAuthenticated')
            router.push({
              name: 'Home'
            })
          }
          else {
            console.log(response.status)
          }
        }
      ).catch(error => {
        console.log(error)
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
