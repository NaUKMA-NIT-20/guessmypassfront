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
          if (response.data.status === 200) {
            context.dispatch('toLogin', { email: params.email, password: params.hashedPassword })
          }
      })
      // context.commit();
    },
    async toLogin (context, params) {
      Axios.post('https://guessmypass.herokuapp.com/user/login', params).then(
        response => {
          if (response.status === 200) {
            context.commit('setToken', response.data.dbId.timestamp)
            router.push('/')
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
