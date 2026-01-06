<template>
  <div class="space-y-1.5 w-full">
    <label v-if="label" class="text-[10px] font-bold text-txt-muted uppercase tracking-widest ml-1">
      {{ label }}
    </label>

    <div @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop" class="relative border-2 border-dashed rounded-xl p-6 transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer" :class="[
      isDragging ? 'border-txt-main bg-txt-main/5' : 'border-line hover:border-txt-main/30 bg-card/50',
      error ? 'border-rose-500/50' : ''
    ]">
      <input type="file" class="absolute inset-0 opacity-0 cursor-pointer" @change="handleFileSelect" multiple />

      <div class="w-10 h-10 rounded-full bg-side flex items-center justify-center text-txt-muted group-hover:scale-110 transition-transform">
        <UploadCloud class="w-5 h-5" />
      </div>

      <div class="text-center">
        <p class="text-[12px] font-bold text-txt-main">{{ $t('forms.file.dropHere') }}</p>
        <p class="text-[10px] text-txt-muted font-medium mt-0.5">PDF, PNG, JPG ({{ $t('common.max') }}. 10MB)</p>
      </div>
    </div>

    <p v-if="error" class="text-[10px] text-rose-500 font-bold ml-1 uppercase">{{ error }}</p>

    <div v-if="files.length > 0" class="mt-3 space-y-2">
      <div v-for="file in files" :key="file.name" class="flex items-center justify-between bg-side/50 border border-line px-3 py-2 rounded-lg">
        <div class="flex items-center gap-3 overflow-hidden">
          <FileText class="w-4 h-4 text-txt-muted shrink-0" />
          <span class="text-[11px] font-bold text-txt-main truncate">{{ file.name }}</span>
        </div>
        <button @click="removeFile(file)" class="p-1 hover:bg-rose-500/10 rounded text-txt-muted hover:text-rose-500 transition-colors">
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { UploadCloud, FileText, X } from 'lucide-vue-next';

defineProps(['label', 'error']);

const files = ref([]);
const isDragging = ref(false);

const handleFileSelect = (e) => {
  const selected = Array.from(e.target.files);
  files.value.push(...selected);
};

const handleDrop = (e) => {
  isDragging.value = false;
  const dropped = Array.from(e.dataTransfer.files);
  files.value.push(...dropped);
};

const removeFile = (file) => {
  files.value = files.value.filter(f => f !== file);
};
</script>