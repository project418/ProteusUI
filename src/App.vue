<template>
  <router-view v-if="isAuthPage" />
  <AppLayout v-else />
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/layout/AppLayout.vue'

const route = useRoute()
const authStore = useAuthStore()

const isAuthPage = computed(() => route.meta.layout === 'auth')

onMounted(() => {
  authStore.initAuth()
})
</script>