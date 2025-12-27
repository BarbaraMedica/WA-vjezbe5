import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    // route-level code-splitting
    // this generates a separate chunk (home.[hash].js) for the route
    component: () => import('../views/Home.vue')
  },
  {
    path: '/pizze/:naziv',
    name: 'PizzaDetalji',
    component: () => import('../views/PizzaDetalji.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
