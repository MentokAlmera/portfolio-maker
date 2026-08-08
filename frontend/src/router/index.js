import { createRouter, createWebHistory } from 'vue-router'

import Landing from '../views/Landing.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import VerifyEmail from '../views/VerifyEmail.vue'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Landing,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
  },
  {
    path: '/verify-email',
    name: 'VerifyEmail',
    component: VerifyEmail,
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router