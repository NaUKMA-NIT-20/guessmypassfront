import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'
Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    alias: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    meta: { requiredAuth: true }
  },
  {
    path: '/auth',
    name: 'Authentication',
    component: () => import(/* webpackChunkName: "auth" */ '../views/Auth.vue')
  },
  {
    path: '*',
    name: '404',
    component: () => import(/* webpackChunkName: "auth" */ '../views/404.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiredAuth) {
    if (store.getters['auth/isAuthenticated']) {
      next()
    }
    else {
      next({
        name: 'Authentication'
      })
    }
  }
  else if (to.name === 'Authentication') {
    if (store.getters['auth/isAuthenticated']) {
      next({
        name: 'Home'
      })
    }
    else {
      next()
    }
  }
  else {
    next()
  }
})

export default router
