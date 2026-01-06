<template>
  <div class="space-y-1.5 w-full">
    <label v-if="label" class="text-[10px] font-bold text-txt-muted uppercase tracking-widest ml-1">{{ label }}</label>
    <div class="flex gap-2">
      <div class="relative shrink-0">
        <select 
          :value="countryCode" 
          @change="$emit('update:countryCode', $event.target.value)"
          class="w-20 bg-card border border-line rounded-lg pl-3 pr-6 py-2 text-[13px] text-txt-main focus:outline-none appearance-none cursor-pointer"
        >
          <option value="+90">TR</option>
          <option value="+1">US</option>
          <option value="+44">UK</option>
        </select>
        <ChevronDown class="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-txt-muted pointer-events-none" />
      </div>
      <input 
        type="tel"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        placeholder="5xx xxx xx xx"
        class="flex-1 bg-card border border-line rounded-lg py-2 px-4 text-[13px] text-txt-main focus:outline-none focus:border-txt-main/30 transition-all"
      />
    </div>
  </div>
</template>

<script setup>
import { ChevronDown } from 'lucide-vue-next';
defineProps(['modelValue', 'countryCode', 'label']);
defineEmits(['update:modelValue', 'update:countryCode']);
</script>