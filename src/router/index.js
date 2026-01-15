import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // --- Public / Auth Routes ---
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: { guestOnly: true, layout: 'auth' }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue'),
      meta: { guestOnly: true, layout: 'auth' }
    },
    {
      path: '/auth/reset-password',
      name: 'reset-password',
      component: () => import('../views/auth/ResetPasswordView.vue'),
      meta: { guestOnly: true, layout: 'auth' }
    },
    {
      path: '/auth/join-tenant',
      name: 'join-tenant',
      component: () => import('../views/auth/JoinTenantView.vue'),
      meta: { requiresAuth: true, layout: 'auth' }
    },

    // --- Onboarding ---
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('../views/OnboardingView.vue'),
      meta: { requiresAuth: true }
    },

    // --- Protected Routes ---
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/OrdersView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/form-showcase',
      name: 'form-showcase',
      component: () => import('../views/FormShowcase.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: { requiresAuth: true }
    },

    // --- Error Routes ---
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

// --- Navigation Guard ---
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Note: We removed the manual localStorage re-hydration block here.
  // The Auth Store now initializes its state automatically from AuthStorage.

  const isAuthenticated = authStore.isAuthenticated

  // 1. Check for protected routes
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  // 2. Check for guest-only routes (like login/register)
  if (to.meta.guestOnly && isAuthenticated) {
    return next({ name: 'home' })
  }

  // 3. Tenant & Onboarding Check
  if (isAuthenticated) {
    const hasTenants = authStore.availableTenants && authStore.availableTenants.length > 0;

    // If user has no tenants, force them to onboarding (unless they are already there or joining one)
    if (!hasTenants) {
      if (to.name !== 'onboarding' && to.name !== 'profile' && to.name !== 'join-tenant') {
        return next({ name: 'onboarding' });
      }
    } else {
      // If user has tenants but tries to access onboarding, redirect to home
      if (to.name === 'onboarding') {
        return next({ name: 'home' });
      }
    }
  }

  next()
})

export default router