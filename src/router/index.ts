import { createRouter, createMemoryHistory } from 'vue-router'

import HomeScreen from '@/views/HomeScreen.vue'

const router = createRouter({
  history: createMemoryHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeScreen,
    },
  ],
})

export default router
