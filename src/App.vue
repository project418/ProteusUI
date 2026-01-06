<template>
  <router-view v-if="isAuthPage" />
  <AppLayout v-else />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

const route = useRoute()
const isAuthPage = computed(() => ['login', 'register'].includes(route.name))
</script>