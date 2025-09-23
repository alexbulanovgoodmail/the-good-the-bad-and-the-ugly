import { createRouter, createMemoryHistory } from 'vue-router'

import HomeScreen from '@/views/HomeScreen.vue'

const router = createRouter({
  history: createMemoryHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeScreen,
    },
    {
      path: '/saloon',
      components: {
        default: () => import('@/views/SaloonScreen.vue'),
        dashboard: () => import('@/components/GameDashboard.vue'),
      },
    },
    {
      path: '/final',
      components: {
        default: () => import('@/views/FinalScreen.vue'),
        dashboard: () => import('@/components/GameDashboard.vue'),
      },
    },
  ],
})

export default router
