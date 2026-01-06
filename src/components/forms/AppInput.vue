<template>
  <div class="space-y-1.5 w-full">
    <label v-if="label" class="text-[10px] font-bold text-txt-muted uppercase tracking-widest ml-1">
      {{ label }}
    </label>
    <div class="relative group">
      <div v-if="$slots.icon" class="absolute left-3 top-1/2 -translate-y-1/2 text-txt-muted group-focus-within:text-txt-main transition-colors">
        <slot name="icon" />
      </div>
      <input
        v-bind="$attrs"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="w-full bg-card border border-line rounded-lg py-2 text-[13px] text-txt-main placeholder:text-txt-muted/50 focus:outline-none focus:ring-2 ring-txt-main/5 focus:border-txt-main/30 transition-all"
        :class="[$slots.icon ? 'pl-9 pr-4' : 'px-4']"
      />
    </div>
    <p v-if="error" class="text-[10px] text-rose-500 font-bold ml-1 uppercase">{{ error }}</p>
  </div>
</template>

<script setup>
defineProps(['modelValue', 'label', 'error']);
defineEmits(['update:modelValue']);
</script>