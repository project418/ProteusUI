<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
    <h1 class="text-9xl font-black text-line mb-4 select-none">
      {{ errorCode }}
    </h1>

    <div class="max-w-md space-y-6">
      <h2 class="text-3xl font-bold text-txt-main">
        {{ errorTitle }}
      </h2>
      <p class="text-txt-muted">
        {{ errorDescription }}
      </p>

      <div class="flex items-center justify-center gap-4 pt-4">
        <button 
          @click="$router.back()"
          class="px-5 py-2.5 rounded-xl border border-line bg-card text-txt-main text-sm font-semibold hover:bg-side transition-colors flex items-center gap-2"
        >
          <ArrowLeft class="w-4 h-4" />
          {{ $t('common.goBack') }}
        </button>
        
        <router-link 
          to="/"
          class="px-5 py-2.5 rounded-xl bg-txt-main text-main text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          {{ $t('common.goHome') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ArrowLeft } from 'lucide-vue-next';

const route = useRoute();
const { t } = useI18n();

const errorCode = computed(() => route.params.code || '404');

const errorTitle = computed(() => {
  return errorCode.value === '404' 
    ? t('error.pageNotFound') 
    : t('error.anErrorOccurred');
});

const errorDescription = computed(() => {
  return errorCode.value === '404'
    ? t('error.pageNotFoundDescription')
    : t('error.anErrorOccurredDescription');
});
</script>