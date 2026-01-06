<template>
  <div class="h-full bg-main overflow-y-auto custom-scrollbar transition-colors duration-500">
    <div class="max-w-5xl mx-auto p-8 space-y-10">
      
      <header class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-line pb-10">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-txt-main text-main flex items-center justify-center shadow-lg">
            <Settings2 class="w-6 h-6" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-txt-main tracking-tight">Sistem Ayarları</h1>
            <p class="text-sm text-txt-muted mt-1 font-medium">Platform genelindeki kuralları ve marka kimliğini yönetin.</p>
          </div>
        </div>
        <button @click="saveSettings" class="px-8 py-2.5 bg-txt-main text-main rounded-xl text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-xl">
          Tüm Değişiklikleri Uygula
        </button>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        <nav class="lg:col-span-1 flex flex-col gap-1">
          <button 
            v-for="tab in settingTabs" :key="tab.id"
            @click="activeTab = tab.id"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold transition-all text-left"
            :class="activeTab === tab.id ? 'bg-side text-txt-main shadow-sm' : 'text-txt-muted hover:bg-side/50 hover:text-txt-main'"
          >
            <component :is="tab.icon" class="w-4 h-4" />
            {{ tab.label }}
          </button>
        </nav>

        <div class="lg:col-span-3 space-y-10 animate-in fade-in duration-500">
          
          <div v-if="activeTab === 'general'" class="space-y-8">
            <section class="space-y-6">
              <h3 class="text-[11px] font-bold text-txt-muted uppercase tracking-[0.2em] border-l-2 border-txt-main pl-3">Marka Kimliği</h3>
              <div class="grid grid-cols-2 gap-6">
                <AppInput v-model="settings.companyName" label="Şirket Yasal Adı" />
                <AppInput v-model="settings.brandName" label="Görünen Marka Adı" />
                <div class="col-span-2">
                  <AppFileUpload label="Sistem Logosu (Dark/Light uyumlu PNG)" />
                </div>
              </div>
            </section>

            <section class="space-y-6">
              <h3 class="text-[11px] font-bold text-txt-muted uppercase tracking-[0.2em] border-l-2 border-txt-main pl-3">Bölgesel Ayarlar</h3>
              <div class="grid grid-cols-2 gap-6">
                <AppSelect v-model="settings.currency" label="Varsayılan Para Birimi" :options="currencies" />
                <AppSelect v-model="settings.dateFormat" label="Tarih Formatı" :options="dateFormats" />
              </div>
            </section>
          </div>

          <div v-if="activeTab === 'finance'" class="space-y-8">
            <section class="space-y-6">
              <h3 class="text-[11px] font-bold text-txt-muted uppercase tracking-[0.2em] border-l-2 border-txt-main pl-3">Vergi Düzenlemeleri</h3>
              <div class="grid grid-cols-2 gap-4">
                <AppNumberInput v-model="settings.vatRate" label="Standart KDV Oranı (%)" />
                <AppInput v-model="settings.taxOffice" label="Vergi Dairesi" />
              </div>
            </section>

            <section class="p-5 bg-card border border-line rounded-2xl space-y-4">
              <AppToggle v-model="settings.autoInvoice" label="Otomatik Fatura Oluşturma" />
              <p class="text-[11px] text-txt-muted">Sipariş "Tamamlandı" durumuna geçtiğinde PDF faturayı otomatik oluştur ve müşteriye gönder.</p>
            </section>
          </div>

          <div v-if="activeTab === 'api'" class="space-y-6">
            <h3 class="text-[11px] font-bold text-txt-muted uppercase tracking-[0.2em] border-l-2 border-txt-main pl-3">API Anahtarları</h3>
            <div class="space-y-4">
              <div v-for="key in apiKeys" :key="key.name" class="p-4 bg-side/30 border border-line rounded-xl flex items-center justify-between">
                <div>
                  <p class="text-[12px] font-bold text-txt-main">{{ key.name }}</p>
                  <p class="text-[11px] font-mono text-txt-muted mt-1">{{ key.hidden ? '••••••••••••••••' : key.value }}</p>
                </div>
                <button @click="key.hidden = !key.hidden" class="p-2 hover:bg-card rounded-lg transition-colors">
                  <Eye v-if="key.hidden" class="w-4 h-4 text-txt-muted" />
                  <EyeOff v-else class="w-4 h-4 text-txt-muted" />
                </button>
              </div>
            </div>
            <AppTagInput v-model="settings.webhooks" label="Aktif Webhook URL'leri" />
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { 
  Settings2, Building2, Wallet2, 
  Cpu, ShieldCheck, Eye, EyeOff 
} from 'lucide-vue-next';
import { useToastStore } from '@/stores/toast';

// UI Bileşenleri
import AppInput from '@/components/forms/AppInput.vue';
import AppSelect from '@/components/forms/AppSelect.vue';
import AppToggle from '@/components/forms/AppToggle.vue';
import AppNumberInput from '@/components/forms/AppNumberInput.vue';
import AppTagInput from '@/components/forms/AppTagInput.vue';
import AppFileUpload from '@/components/forms/AppFileUpload.vue';

const toast = useToastStore();
const activeTab = ref('general');

const settingTabs = [
  { id: 'general', label: 'Genel & Marka', icon: Building2 },
  { id: 'finance', label: 'Finans & Vergi', icon: Wallet2 },
  { id: 'security', label: 'Güvenlik Protokolleri', icon: ShieldCheck },
  { id: 'api', label: 'API & Entegrasyon', icon: Cpu },
];

const settings = reactive({
  companyName: 'Catalyst CRM Solutions Ltd.',
  brandName: 'Catalyst CRM',
  currency: 'USD',
  dateFormat: 'DD/MM/YYYY',
  vatRate: 20,
  taxOffice: 'Zincirlikuyu V.D.',
  autoInvoice: true,
  webhooks: ['https://api.stripe.com/v1/webhook', 'https://hooks.slack.com/services/...']
});

const apiKeys = ref([
  { name: 'Production API Key', value: 'sk_live_51Msz79LpXk...', hidden: true },
  { name: 'Stripe Secret Key', value: 'rk_live_098231LKJ1...', hidden: true }
]);

const currencies = [
  { label: 'Amerikan Doları (USD)', value: 'USD' },
  { label: 'Türk Lirası (TRY)', value: 'TRY' },
  { label: 'Euro (EUR)', value: 'EUR' }
];

const dateFormats = [
  { label: 'GG/AA/YYYY', value: 'DD/MM/YYYY' },
  { label: 'AA/GG/YYYY', value: 'MM/DD/YYYY' },
  { label: 'YYYY-AA-GG', value: 'YYYY-MM-DD' }
];

const saveSettings = () => {
  toast.add('Sistem ayarları başarıyla güncellendi.', 'success');
};
</script>