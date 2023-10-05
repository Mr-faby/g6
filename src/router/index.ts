import { createRouter, createWebHistory } from 'vue-router'
import Entry from '../views/topologyDesign/entry.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: () => {
        return {
          path: '/designer'
        }
      }
    },
    {
      path: '/designer',
      name: 'designer',
      component: Entry
    }
  ]
})

export default router
