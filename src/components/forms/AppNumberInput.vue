<template>
  <div class="space-y-1.5">
    <label v-if="label" class="text-[10px] font-bold text-txt-muted uppercase tracking-widest ml-1">
      {{ label }}
    </label>
    <div class="flex items-center bg-card border border-line rounded-lg overflow-hidden w-full lg:w-32 focus-within:ring-2 ring-txt-main/5 transition-all">
      <button 
        @click="updateValue(-1)"
        class="p-2 hover:bg-side text-txt-muted hover:text-txt-main transition-colors border-r border-line"
      >
        <Minus class="w-3.5 h-3.5" />
      </button>
      
      <input
        type="number"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="w-full bg-transparent text-center text-[13px] font-bold text-txt-main focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      
      <button 
        @click="updateValue(1)"
        class="p-2 hover:bg-side text-txt-muted hover:text-txt-main transition-colors border-l border-line"
      >
        <Plus class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { Minus, Plus } from 'lucide-vue-next';
const props = defineProps(['modelValue', 'label']);
const emit = defineEmits(['update:modelValue']);

const updateValue = (step) => {
  const current = Number(props.modelValue) || 0;
  emit('update:modelValue', current + step);
};
</script>