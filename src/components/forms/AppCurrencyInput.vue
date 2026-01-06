<template>
  <div class="space-y-1.5 w-full">
    <label v-if="label" class="text-[10px] font-bold text-txt-muted uppercase tracking-widest ml-1">
      {{ label }}
    </label>
    <div class="relative flex items-center">
      <span class="absolute left-3.5 text-[13px] font-bold text-txt-muted select-none">
        {{ currencySymbol || '$' }}
      </span>
      <input
        type="text"
        :value="modelValue"
        @input="onInput"
        class="w-full bg-card border border-line rounded-lg py-2 pl-8 pr-4 text-[13px] font-bold text-txt-main tabular-nums focus:outline-none focus:ring-2 ring-txt-main/5 focus:border-txt-main/30 transition-all placeholder:font-normal"
        placeholder="0.00"
      />
    </div>
  </div>
</template>

<script setup>
defineProps(['modelValue', 'label', 'currencySymbol']);
const emit = defineEmits(['update:modelValue']);

const onInput = (e) => {
  let value = e.target.value.replace(/[^0-9.]/g, '');
  const parts = value.split('.');
  if (parts.length > 2) value = parts[0] + '.' + parts.slice(1).join('');
  
  emit('update:modelValue', value);
};
</script>