<template>
  <div class="space-y-1.5 w-full relative">
    <label v-if="label" class="text-[10px] font-bold text-txt-muted uppercase tracking-widest ml-1">
      {{ label }}
    </label>
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      class="w-full bg-card border border-line rounded-lg px-3 py-2 text-[13px] text-txt-main focus:outline-none focus:border-txt-main/30 appearance-none cursor-pointer transition-all"
    >
      <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
    <ChevronDown class="absolute right-3 top-[34px] w-3.5 h-3.5 text-txt-muted pointer-events-none" />
  </div>
</template>

<script setup>
import { ChevronDown } from 'lucide-vue-next';
defineProps(['modelValue', 'label', 'options']);
defineEmits(['update:modelValue']);
</script>