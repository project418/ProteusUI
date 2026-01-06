<template>
  <div class="space-y-1.5 w-full">
    <label v-if="label" class="text-[10px] font-bold text-txt-muted uppercase tracking-widest ml-1">{{ label }}</label>
    <div class="flex flex-wrap gap-2 p-2 bg-side/20 border border-line rounded-xl">
      <button 
        v-for="opt in options" :key="opt.value"
        type="button"
        @click="$emit('update:modelValue', opt.value)"
        class="flex-1 px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all border text-center"
        :class="modelValue === opt.value 
          ? `${opt.color} border-current ring-4 ring-current/5` 
          : 'bg-card border-line text-txt-muted hover:text-txt-main'"
      >
        {{ opt.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps(['modelValue', 'label', 'options']);
defineEmits(['update:modelValue']);
</script>