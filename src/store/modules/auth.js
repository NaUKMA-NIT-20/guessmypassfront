import Axios from 'axios'
import router from '../../router/index.js'
export default {
  namespaced: true,
  state: {
    tokenApi: localStorage.getItem('token') || null
  },
  mutations: {
    setToken (state, token) {
     localStorage.setItem('token', token)
     state.tokenApi = localStorage.getItem('token')
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
            router.push('/')
          }
          else {
            console.log(response.status)
          }
        }
      ).catch(error => {
        console.log(error)
      })
    }

  },
  getters: {
    getToken: state => {
      return state.tokenApi
    }
  }

}