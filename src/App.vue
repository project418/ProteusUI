<template>
  <component :is="layoutComponent">
    <router-view />
  </component>

  <AppToast />
  <TenantCreateModal />
  <AppCommandPalette v-model:open="isPaletteOpen" />
</template>

<script setup>
import { computed, onMounted, defineComponent, h } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { isPaletteOpen } from '@/stores/commandPalette'

import AppLayout from '@/components/layout/AppLayout.vue'
import OnboardingLayout from '@/components/layout/OnboardingLayout.vue'

import TenantCreateModal from '@/components/tenant/TenantCreateModal.vue'
import AppToast from '@/components/ui/AppToast.vue'
import AppCommandPalette from '@/components/ui/AppCommandPalette.vue'

const SimpleAuthLayout = defineComponent({
  render() { return h(RouterView) }
})

const route = useRoute()
const authStore = useAuthStore()

const layoutComponent = computed(() => {
  if (route.meta.layout === 'auth') return SimpleAuthLayout
  if (authStore.isAuthenticated && !authStore.hasTenant) return OnboardingLayout

  return AppLayout
})

onMounted(() => {
  authStore.initAuth()
})
</script>