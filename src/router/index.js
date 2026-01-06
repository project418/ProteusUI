import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: { layout: 'auth' }
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/OrdersView.vue'),
    },
    {
      path: '/form-showcase',
      name: 'form-showcase',
      component: () => import('../views/FormShowcase.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
    },
    {
      path: '/error/:code',
      name: 'error',
      component: () => import('../views/ErrorView.vue'),
      props: true
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/ErrorView.vue'),
      props: { code: '404' }
    }
  ],
})

export default router
