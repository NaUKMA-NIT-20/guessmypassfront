import Vue from 'vue'
import VueRouter from 'vue-router'
import Auth from '../views/Auth.vue'
import Home from '../views/Home.vue'
import store from '../store/index'
Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    alias: '/home',
    name: 'Home',
    component: Home,
    meta: { requiredAuth: true }
  },
  {
    path: '/auth',
    name: 'Authentication',
    component: Auth
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
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
