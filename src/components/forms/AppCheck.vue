<template>
  <label class="flex items-center gap-3 cursor-pointer group select-none">
    <div class="relative flex items-center justify-center">
      <input
        :type="type"
        :checked="modelValue"
        @change="$emit('update:modelValue', $event.target.checked)"
        class="peer appearance-none w-4 h-4 border border-line bg-card rounded transition-all checked:bg-txt-main checked:border-txt-main focus:outline-none"
        :class="{ 'rounded-full': type === 'radio' }"
      />
      <Check v-if="type === 'checkbox'" class="absolute w-3 h-3 text-main opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
      <div v-else class="absolute w-1.5 h-1.5 bg-main rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
    </div>
    <span class="text-[13px] font-medium text-txt-main group-hover:text-txt-main transition-colors">{{ label }}</span>
  </label>
</template>

<script setup>
import { Check } from 'lucide-vue-next';
defineProps({
  modelValue: Boolean,
  label: String,
  type: { type: String, default: 'checkbox' }
});
defineEmits(['update:modelValue']);
</script>