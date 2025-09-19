import { createRouter, createMemoryHistory } from 'vue-router'

import HomeScreen from '@/views/HomeScreen.vue'
import FinalScreen from '@/views/FinalScreen.vue'

const router = createRouter({
  history: createMemoryHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeScreen,
    },
    {
      path: '/final',
      component: FinalScreen,
    },
  ],
})

export default router
