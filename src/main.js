import Vue from 'vue'
import Axios from './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { VueMaskDirective } from 'v-mask'
import VuetifyConfirm from 'vuetify-confirm'
import VueClipboard from 'vue-clipboard2'
Vue.directive('mask', VueMaskDirective)
Vue.config.productionTip = false
Vue.use(VuetifyConfirm, {
  vuetify,
  buttonTrueText: 'Так',
  buttonFalseText: 'Ні',
  width: 350,
  property: '$confirm'
})

Vue.use(VueClipboard)

new Vue({
  router,
  store,
  vuetify,
  Axios,
  render: h => h(App)
}).$mount('#app')
