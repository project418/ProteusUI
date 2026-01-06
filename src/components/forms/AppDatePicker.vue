<template>
  <div class="space-y-1.5 w-full">
    <label v-if="label" class="text-[10px] font-bold text-txt-muted uppercase tracking-widest ml-1">
      {{ label }}
    </label>
    <div class="relative group">
      <Calendar class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-txt-muted group-focus-within:text-txt-main transition-colors" />
      <input type="date" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" class="w-full bg-card border border-line rounded-lg py-2 pl-9 pr-4 text-[13px] text-txt-main focus:outline-none focus:border-txt-main/30 transition-all [color-scheme:dark]" />
    </div>
  </div>
</template>

<script setup>
import { Calendar } from 'lucide-vue-next';
defineProps(['modelValue', 'label']);
defineEmits(['update:modelValue']);
</script>