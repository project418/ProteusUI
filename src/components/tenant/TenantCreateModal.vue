<template>
    <AppModal :show="store.isTenantModalOpen" :title="$t('tenant.createOrganization')" size="lg" @close="closeModal">
        <div class="space-y-6">

            <div class="flex items-center justify-center mb-8">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors" :class="step >= 1 ? 'bg-txt-main text-main' : 'bg-side text-txt-muted'">1</div>
                    <span class="text-xs font-bold uppercase tracking-widest" :class="step >= 1 ? 'text-txt-main' : 'text-txt-muted'">{{ $t('tenant.selectPlan') }}</span>
                </div>
                <div class="w-12 h-px bg-line mx-4"></div>
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors" :class="step >= 2 ? 'bg-txt-main text-main' : 'bg-side text-txt-muted'">2</div>
                    <span class="text-xs font-bold uppercase tracking-widest" :class="step >= 2 ? 'text-txt-main' : 'text-txt-muted'">{{ $t('tenant.details') }}</span>
                </div>
            </div>

            <div v-if="step === 1" class="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div class="text-center space-y-2">
                    <h3 class="text-lg font-bold text-txt-main">{{ $t('tenant.choosePlan') }}</h3>
                    <p class="text-sm text-txt-muted">{{ $t('tenant.flexiblePricing') }}</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div v-for="plan in plans" :key="plan.id" @click="selectPlan(plan)" class="relative p-4 border rounded-xl cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col" :class="[
                        selectedPlanId === plan.id ? 'border-txt-main bg-txt-main/5 ring-1 ring-txt-main' : 'border-line bg-card hover:border-txt-main/30',
                        plan.disabled ? 'opacity-50 pointer-events-none grayscale' : ''
                    ]">
                        <div v-if="plan.recommended" class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-txt-main text-main text-[10px] font-bold uppercase tracking-widest rounded-full">
                            {{ $t('tenant.recommended') }}
                        </div>

                        <div class="mb-4">
                            <h4 class="text-sm font-bold text-txt-main uppercase tracking-wider">{{ plan.name }}</h4>
                            <div class="mt-2 flex items-baseline gap-1">
                                <span class="text-2xl font-black text-txt-main">{{ plan.price }}</span>
                                <span class="text-[10px] text-txt-muted font-bold">{{ $t('tenant.perMonth') }}</span>
                            </div>
                        </div>

                        <ul class="space-y-2 mb-6 flex-1">
                            <li v-for="feature in plan.features" :key="feature" class="flex items-start gap-2 text-[11px] text-txt-muted">
                                <Check class="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                <span class="leading-tight">{{ feature }}</span>
                            </li>
                        </ul>

                        <button class="w-full py-2 rounded-lg text-xs font-bold transition-colors" :class="selectedPlanId === plan.id ? 'bg-txt-main text-main' : 'bg-side text-txt-main hover:bg-txt-main/10'">
                            {{ selectedPlanId === plan.id ? $t('tenant.selected') : $t('tenant.select') }}
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="step === 2" class="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div class="bg-side/30 p-4 rounded-xl flex items-center gap-4 border border-line">
                    <div class="w-10 h-10 bg-card rounded-lg flex items-center justify-center border border-line shadow-sm">
                        <Layers class="w-5 h-5 text-txt-main" />
                    </div>
                    <div>
                        <p class="text-xs font-bold text-txt-muted uppercase tracking-wider">{{ $t('tenant.selectedPlan') }}</p>
                        <p class="text-sm font-bold text-txt-main">{{ getSelectedPlanName }}</p>
                    </div>
                    <button @click="step = 1" class="ml-auto text-xs font-bold text-txt-muted hover:text-txt-main underline">{{ $t('tenant.change') }}</button>
                </div>

                <div class="space-y-4">
                    <AppInput v-model="tenantName" :label="$t('tenant.organizationName')" :placeholder="$t('tenant.organizationNamePlaceholder')" :error="error" autoFocus />
                    <p class="text-xs text-txt-muted">
                        {{ $t('tenant.organizationNameDescription') }}
                    </p>
                </div>
            </div>

        </div>

        <template #footer>
            <div class="flex justify-between w-full">
                <button v-if="step === 2" @click="step = 1" class="px-4 py-2 text-xs font-bold text-txt-muted hover:text-txt-main transition-colors">
                    {{ $t('tenant.goBack') }}
                </button>
                <div v-else></div> <button @click="handleNext" :disabled="isLoading || (step === 1 && !selectedPlanId) || (step === 2 && !tenantName)" class="px-6 py-2 bg-txt-main text-main rounded-xl text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
                    {{ step === 1 ? $t('tenant.continue') : (isLoading ? $t('tenant.creating') : $t('tenant.complete')) }}
                </button>
            </div>
        </template>
    </AppModal>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useSidebarStore } from '@/stores/sidebar';
import { useAuthStore } from '@/stores/auth';
import { Check, Layers, Loader2 } from 'lucide-vue-next';
import AppModal from '@/components/ui/AppModal.vue';
import AppInput from '@/components/forms/AppInput.vue';
import { useI18n } from 'vue-i18n';

const store = useSidebarStore();
const authStore = useAuthStore();
const { t: $t } = useI18n();

const step = ref(1);
const selectedPlanId = ref('free');
const tenantName = ref('');
const isLoading = ref(false);
const error = ref('');

const plans = [
    {
        id: 'free',
        name: 'Starter',
        price: '$0',
        features: ['5 Kullanıcı', 'Temel Analitik', '1GB Depolama', 'Topluluk Desteği'],
        disabled: false
    },
    {
        id: 'pro',
        name: 'Professional',
        price: '$29',
        features: ['Sınırsız Kullanıcı', 'Gelişmiş Raporlar', '100GB Depolama', 'Öncelikli Destek', 'API Erişimi'],
        recommended: true,
        disabled: true
    },
    {
        id: 'ent',
        name: 'Enterprise',
        price: 'Özel',
        features: ['Dedicated Server', 'SLA', 'Sınırsız Depolama', '7/24 Canlı Destek', 'SSO Entegrasyonu'],
        disabled: true
    }
];

const getSelectedPlanName = computed(() => plans.find(p => p.id === selectedPlanId.value)?.name);

const selectPlan = (plan) => {
    if (plan.disabled) return;
    selectedPlanId.value = plan.id;
};

const closeModal = () => {
    store.isTenantModalOpen = false;
    setTimeout(() => {
        step.value = 1;
        tenantName.value = '';
        error.value = '';
    }, 300);
};

const handleNext = async () => {
    if (step.value === 1) {
        step.value = 2;
    } else {
        if (!tenantName.value.trim()) {
            error.value = 'Organizasyon adı gereklidir.';
            return;
        }

        isLoading.value = true;
        error.value = '';

        const result = await authStore.createTenant(tenantName.value);

        isLoading.value = false;

        if (result.success) {
            closeModal();
        } else {
            error.value = result.error || $t('error.anErrorOccurred');
        }
    }
};
</script>