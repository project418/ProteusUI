<template>
  <teleport to="body">
    <div class="fixed top-6 right-6 z-[10001] flex flex-col gap-3 w-80 pointer-events-none">
      <transition-group 
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform translate-x-10 opacity-0"
        enter-to-class="transform translate-x-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div 
          v-for="toast in toastStore.toasts" 
          :key="toast.id"
          class="pointer-events-auto flex items-center gap-3 p-4 rounded-xl border border-line bg-card shadow-xl"
        >
          <div :class="typeConfig[toast.type].bg" class="p-1.5 rounded-lg shrink-0">
            <component :is="typeConfig[toast.type].icon" class="w-4 h-4 text-white" />
          </div>

          <p class="text-[13px] font-semibold text-txt-main flex-1">{{ toast.message }}</p>

          <button @click="toastStore.remove(toast.id)" class="text-txt-muted hover:text-txt-main">
            <X class="w-4 h-4" />
          </button>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { useToastStore } from '@/stores/toast'
import { Check, AlertCircle, XCircle, Info, X } from 'lucide-vue-next'

const toastStore = useToastStore()

const typeConfig = {
  success: { icon: Check, bg: 'bg-emerald-500' },
  error: { icon: XCircle, bg: 'bg-rose-500' },
  warning: { icon: AlertCircle, bg: 'bg-amber-500' },
  info: { icon: Info, bg: 'bg-blue-500' }
}
</script>