<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="show" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
        
        <div 
          class="absolute inset-0 bg-main/40 backdrop-blur-md transition-all duration-500 delay-75 transform-gpu"
          @click="closeOnBackdrop && $emit('close')"
        ></div>

        <Transition
          appear
          enter-active-class="transition duration-300 ease-out delay-100"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div 
            class="relative bg-card border border-line w-full shadow-2xl rounded-2xl overflow-hidden transform-gpu"
            :class="[sizeClass]"
          >
            <header v-if="title" class="px-6 py-4 border-b border-line flex items-center justify-between bg-side/10">
              <h3 class="text-xs font-bold text-txt-main uppercase tracking-widest">{{ title }}</h3>
              <button @click="$emit('close')" class="p-2 hover:bg-side rounded-lg transition-colors text-txt-muted hover:text-txt-main">
                <X class="w-4 h-4" />
              </button>
            </header>

            <div class="p-6 overflow-y-auto max-h-[80vh] custom-scrollbar">
              <slot />
            </div>

            <footer v-if="$slots.footer" class="px-6 py-4 border-t border-line bg-side/5 flex justify-end gap-3">
              <slot name="footer" />
            </footer>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch } from 'vue';
import { X } from 'lucide-vue-next';

const props = defineProps({
  show: Boolean,
  title: String,
  size: { type: String, default: 'md' },
  closeOnBackdrop: { type: Boolean, default: true }
});

defineEmits(['close']);

const sizeClass = computed(() => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };
  return sizes[props.size];
});

watch(() => props.show, (val) => {
  if (val) document.body.style.overflow = 'hidden';
  else document.body.style.overflow = '';
});
</script>