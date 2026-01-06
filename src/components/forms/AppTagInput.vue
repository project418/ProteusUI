<template>
  <div class="space-y-1.5">
    <label class="text-[10px] font-bold text-txt-muted uppercase tracking-widest ml-1">{{ label }}</label>
    <div class="flex flex-wrap gap-2 p-2 bg-card border border-line rounded-lg min-h-[40px] focus-within:border-txt-main/30 transition-all">
      <div v-for="tag in modelValue" :key="tag" class="flex items-center gap-1 bg-side border border-line px-2 py-0.5 rounded-md">
        <span class="text-[11px] font-bold text-txt-main">{{ tag }}</span>
        <X @click="removeTag(tag)" class="w-3 h-3 text-txt-muted hover:text-rose-500 cursor-pointer" />
      </div>
      <input @keydown.enter.prevent="addTag" :placeholder="$t('forms.tag.addNew')" class="flex-1 bg-transparent border-none outline-none text-[13px] text-txt-main min-w-[100px]" />
    </div>
  </div>
</template>

<script setup>
import { X } from 'lucide-vue-next';
const props = defineProps(['modelValue', 'label']);
const emit = defineEmits(['update:modelValue']);

const addTag = (e) => {
  const val = e.target.value.trim();
  if (val && !props.modelValue.includes(val)) {
    emit('update:modelValue', [...props.modelValue, val]);
    e.target.value = '';
  }
};
const removeTag = (tag) => {
  emit('update:modelValue', props.modelValue.filter(t => t !== tag));
};
</script>