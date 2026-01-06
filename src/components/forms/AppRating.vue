<template>
  <div class="space-y-1.5">
    <label v-if="label" class="text-[10px] font-bold text-txt-muted uppercase tracking-widest ml-1">{{ label }}</label>
    <div class="flex items-center gap-1 bg-card border border-line w-fit px-3 py-2 rounded-lg">
      <button v-for="i in 5" :key="i" type="button" @click="$emit('update:modelValue', i)" class="transition-transform active:scale-125">
        <Star 
          class="w-4 h-4 transition-colors" 
          :class="i <= modelValue ? 'text-amber-400 fill-amber-400' : 'text-txt-muted/20'" 
        />
      </button>
      <span class="text-[11px] font-bold text-txt-muted ml-2 tabular-nums">{{ modelValue }}/5</span>
    </div>
  </div>
</template>

<script setup>
import { Star } from 'lucide-vue-next';
defineProps(['modelValue', 'label']);
defineEmits(['update:modelValue']);
</script>