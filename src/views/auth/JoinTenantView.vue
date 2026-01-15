<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-main px-4 sm:px-6 py-12 transition-colors duration-300">

        <div class="w-full max-w-[400px] text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">

            <div class="inline-flex items-center justify-center w-16 h-16 bg-card border border-line rounded-2xl shadow-lg mb-4">
                <div class="w-8 h-8 bg-txt-main text-main rounded-lg flex items-center justify-center">
                    <Users class="w-5 h-5" />
                </div>
            </div>

            <div class="space-y-2">
                <h1 class="text-2xl font-bold text-txt-main tracking-tight">{{ $t('auth.joinTeam') }}</h1>
                <p class="text-sm text-txt-muted max-w-xs mx-auto">
                    {{ $t('auth.joinTeamDescription') }}
                </p>
            </div>

            <div class="bg-side/50 p-4 rounded-xl border border-line flex items-center gap-3 text-left">
                <div class="p-2 bg-card rounded-lg border border-line shrink-0">
                    <Mail class="w-4 h-4 text-txt-muted" />
                </div>
                <div class="min-w-0">
                    <p class="text-[10px] font-bold text-txt-muted uppercase tracking-wider">{{ $t('auth.invitedAccount') }}</p>
                    <p class="text-xs font-bold text-txt-main truncate">{{ userEmail }}</p>
                </div>
            </div>

            <div class="space-y-3">
                <button @click="handleAccept" :disabled="isLoading" class="w-full bg-txt-main text-main py-3 rounded-xl font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
                    <span>{{ isLoading ? $t('auth.processing') : $t('auth.acceptAndJoin') }}</span>
                </button>

                <button @click="handleReject" class="w-full bg-transparent text-txt-muted py-3 rounded-xl font-bold text-xs hover:text-txt-main transition-colors">
                    {{ $t('auth.cancelAndGoHome') }}
                </button>
            </div>

        </div>

        <div class="fixed bottom-8 flex items-center gap-2">
            <button @click="themeStore.toggleTheme()" class="p-2 hover:bg-side rounded-lg text-txt-muted hover:text-txt-main cursor-pointer">
                <component :is="themeStore.isDark ? Sun : Moon" class="w-4 h-4" />
            </button>
        </div>

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useThemeStore } from '@/stores/theme';
import { Users, Mail, Loader2, Sun, Moon } from 'lucide-vue-next';
import { useToastStore } from '@/stores/toast';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const themeStore = useThemeStore();
const toast = useToastStore();
const { t: $t } = useI18n();

const isLoading = ref(false);
const token = ref('');

const userEmail = computed(() => authStore.user?.email || '...');

onMounted(() => {
    token.value = route.query.token || '';
    if (!token.value) {
        toast.add($t('auth.invalidInviteLink'), 'error');
        router.push('/');
    }
});

const handleAccept = async () => {
    isLoading.value = true;

    const success = await authStore.acceptInvite(token.value);

    if (success) {
        router.push('/');
    }

    isLoading.value = false;
};

const handleReject = () => {
    router.push('/');
};
</script>