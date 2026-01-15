<template>
  <div class="h-full bg-main overflow-y-auto custom-scrollbar p-6 lg:p-10 space-y-10">

    <section class="max-w-3xl mx-auto text-center space-y-8 py-12">
      <div class="space-y-3">
        <h1 class="text-4xl font-bold text-txt-main tracking-tight">{{ $t('home.welcomeUser', { name: userName }) }}</h1>
        <p class="text-sm text-txt-muted max-w-lg mx-auto leading-relaxed">
          {{ $t('home.quickAccessDescription') }}
        </p>
      </div>

      <div @click="isPaletteOpen = true" class="relative group cursor-pointer max-w-xl mx-auto transition-transform active:scale-[0.98]">
        <div class="absolute inset-0 bg-txt-main/5 blur-2xl group-hover:bg-txt-main/10 transition-all rounded-full"></div>
        <div class="relative flex items-center gap-4 bg-card border border-line p-5 rounded-2xl shadow-sm group-hover:border-txt-main/30 transition-all">
          <Search class="w-5 h-5 text-txt-muted group-hover:text-txt-main transition-colors" />
          <span class="flex-1 text-left text-txt-muted text-sm font-medium">{{ $t('home.quickSearch') }}</span>
          <div class="flex items-center gap-1.5 px-2 py-1 bg-side border border-line rounded-lg text-[10px] font-bold text-txt-muted uppercase">
            <span>Ctrl</span>
            <span>K</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Search } from 'lucide-vue-next';
import { isPaletteOpen } from '@/stores/commandPalette';
import { useAuthStore } from '@/stores/auth';
import { useI18n } from 'vue-i18n';

const authStore = useAuthStore();
const { t: $t } = useI18n();

const userName = computed(() => authStore.user?.firstName || 'User');
</script>