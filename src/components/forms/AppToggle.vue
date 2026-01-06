<template>
  <div class="flex items-center justify-between">
    <span class="text-[13px] font-bold text-txt-main">{{ label }}</span>
    <button
      @click="$emit('update:modelValue', !modelValue)"
      class="w-8 h-4.5 rounded-full transition-colors relative flex items-center px-0.5"
      :class="modelValue ? 'bg-emerald-500' : 'bg-line'"
    >
      <div 
        class="w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform duration-200"
        :class="modelValue ? 'translate-x-3.5' : 'translate-x-0'"
      ></div>
    </button>
  </div>
</template>

<script setup>
defineProps(['modelValue', 'label']);
defineEmits(['update:modelValue']);
</script>