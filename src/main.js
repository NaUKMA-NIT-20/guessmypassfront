import Vue from 'vue'
import Axios from './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { VueMaskDirective } from 'v-mask'
Vue.directive('mask', VueMaskDirective)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  Axios,
  render: h => h(App)
}).$mount('#app')
