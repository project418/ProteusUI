<template>
  <div class="space-y-1.5 w-full relative">
    <label v-if="label" class="text-[10px] font-bold text-txt-muted uppercase tracking-widest ml-1">
      {{ label }}
    </label>
    <div class="relative">
      <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)" :disabled="disabled" class="w-full bg-card border rounded-lg pl-3 pr-10 py-2 text-[13px] text-txt-main focus:outline-none transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" :class="[error ? 'border-rose-500' : 'border-line focus:border-txt-main/30']">
        <option value="" disabled selected hidden v-if="placeholder">{{ placeholder }}</option>
        <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </select>
      <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-txt-muted pointer-events-none" />
    </div>
    <p v-if="error" class="text-[10px] text-rose-500 font-bold ml-1 uppercase">{{ error }}</p>
  </div>
</template>

<script setup>
import { ChevronDown } from 'lucide-vue-next';
defineProps(['modelValue', 'label', 'options', 'error', 'disabled', 'placeholder']);
defineEmits(['update:modelValue']);
</script>