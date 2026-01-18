<template>
    <div class="h-full w-full flex overflow-hidden bg-main transition-colors duration-500">
        <div class="flex-1 flex flex-col relative bg-main">
            <div class="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 animate-in fade-in zoom-in-95 duration-500">
                <div class="max-w-md w-full space-y-8">
                    <div class="text-center space-y-2">
                        <h1 class="text-2xl lg:text-3xl font-bold text-txt-main tracking-tight">
                            {{ $t('onboarding.welcomeMessage', { name: userName }) }}
                        </h1>
                        <p class="text-txt-muted text-sm">
                            {{ $t('onboarding.getStartedMessage') }}
                        </p>
                    </div>

                    <button @click="openCreateModal" class="group relative w-full p-6 bg-card border border-line hover:border-txt-main/30 rounded-2xl text-left transition-all hover:shadow-lg active:scale-[0.99] flex items-start gap-5 cursor-pointer">
                        <div class="w-12 h-12 rounded-xl bg-txt-main text-main flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Plus class="w-6 h-6" />
                        </div>
                        <div class="flex-1">
                            <div class="flex items-center justify-between">
                                <h3 class="text-base font-bold text-txt-main">{{ $t('onboarding.createOrganization') }}</h3>
                                <ArrowRight class="w-4 h-4 text-txt-muted group-hover:text-txt-main group-hover:translate-x-1 transition-all" />
                            </div>
                            <p class="text-xs text-txt-muted mt-1.5 leading-relaxed pr-4">
                                {{ $t('onboarding.createOrganizationDescription') }}
                            </p>
                        </div>
                    </button>

                    <div class="flex items-center gap-4 py-4">
                        <div class="h-px bg-line flex-1"></div>
                        <span class="text-[10px] font-bold text-txt-muted uppercase tracking-widest">{{ $t('auth.or') }}</span>
                        <div class="h-px bg-line flex-1"></div>
                    </div>

                    <div class="text-center bg-side/30 p-4 rounded-xl border border-dashed border-line">
                        <p class="text-xs text-txt-muted">
                            {{ $t('onboarding.waitingForInvite') }} <br>
                            <span class="opacity-70">{{ $t('onboarding.waitingForInviteDescription') }}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { Plus, ArrowRight, } from 'lucide-vue-next';
import { useSidebarStore } from '@/stores/sidebar';
import { useAuthStore } from '@/stores/auth';
import { useI18n } from 'vue-i18n';

const sidebarStore = useSidebarStore();
const authStore = useAuthStore();
const { t } = useI18n();

const userName = computed(() => authStore.user?.profile?.firstName || t('common.user'));

const openCreateModal = () => {
    sidebarStore.isTenantModalOpen = true;
};
</script>