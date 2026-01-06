<template>
  <div class="h-full bg-main overflow-y-auto custom-scrollbar transition-colors duration-500">
    <div class="max-w-5xl mx-auto p-4 lg:p-8 space-y-8 lg:space-y-10">

      <header class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-line pb-8 lg:pb-10">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-txt-main text-main flex items-center justify-center shadow-lg shrink-0">
            <Settings2 class="w-6 h-6" />
          </div>
          <div>
            <h1 class="text-xl lg:text-2xl font-bold text-txt-main tracking-tight">Sistem Ayarları</h1>
            <p class="text-sm text-txt-muted mt-1 font-medium">Platform kurallarını ve marka kimliğini yönetin.</p>
          </div>
        </div>
        <button @click="saveSettings" class="w-full md:w-auto px-8 py-2.5 bg-txt-main text-main rounded-xl text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-xl">
          Tüm Değişiklikleri Uygula
        </button>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">

        <nav class="lg:col-span-1 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 custom-scrollbar">
          <button v-for="tab in settingTabs" :key="tab.id" @click="activeTab = tab.id" class="flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold transition-all text-left whitespace-nowrap lg:whitespace-normal" :class="activeTab === tab.id ? 'bg-side text-txt-main shadow-sm' : 'text-txt-muted hover:bg-side/50 hover:text-txt-main'">
            <component :is="tab.icon" class="w-4 h-4 shrink-0" />
            {{ tab.label }}
          </button>
        </nav>

        <div class="lg:col-span-3 space-y-10 animate-in fade-in duration-500">

          <div v-if="activeTab === 'general'" class="space-y-8">
            <section class="space-y-6">
              <h3 class="text-[11px] font-bold text-txt-muted uppercase tracking-[0.2em] border-l-2 border-txt-main pl-3">Marka Kimliği</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <AppInput v-model="settings.companyName" label="Şirket Yasal Adı" />
                <AppInput v-model="settings.brandName" label="Görünen Marka Adı" />
                <div class="sm:col-span-2">
                  <AppFileUpload label="Sistem Logosu" />
                </div>
              </div>
            </section>

            <section class="space-y-6">
              <h3 class="text-[11px] font-bold text-txt-muted uppercase tracking-[0.2em] border-l-2 border-txt-main pl-3">Bölgesel Ayarlar</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <AppSelect v-model="settings.currency" label="Varsayılan Para Birimi" :options="currencies" />
                <AppSelect v-model="settings.dateFormat" label="Tarih Formatı" :options="dateFormats" />
              </div>
            </section>
          </div>

          <div v-if="activeTab === 'finance'" class="space-y-8">
            <section class="space-y-6">
              <h3 class="text-[11px] font-bold text-txt-muted uppercase tracking-[0.2em] border-l-2 border-txt-main pl-3">Vergi Düzenlemeleri</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AppNumberInput v-model="settings.vatRate" label="Standart KDV Oranı (%)" />
                <AppInput v-model="settings.taxOffice" label="Vergi Dairesi" />
              </div>
            </section>
            <section class="p-5 bg-card border border-line rounded-2xl space-y-4">
              <AppToggle v-model="settings.autoInvoice" label="Otomatik Fatura Oluşturma" />
              <p class="text-[11px] text-txt-muted">Sipariş tamamlandığında faturayı otomatik oluştur.</p>
            </section>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { Settings2, Building2, Wallet2, Cpu, ShieldCheck } from 'lucide-vue-next';
import { useToastStore } from '@/stores/toast';
import AppInput from '@/components/forms/AppInput.vue';
import AppSelect from '@/components/forms/AppSelect.vue';
import AppToggle from '@/components/forms/AppToggle.vue';
import AppNumberInput from '@/components/forms/AppNumberInput.vue';
import AppFileUpload from '@/components/forms/AppFileUpload.vue';

const toast = useToastStore();
const activeTab = ref('general');
const settingTabs = [
  { id: 'general', label: 'Genel', icon: Building2 },
  { id: 'finance', label: 'Finans', icon: Wallet2 },
  { id: 'security', label: 'Güvenlik', icon: ShieldCheck },
  { id: 'api', label: 'API', icon: Cpu },
];
const settings = reactive({ companyName: 'Proteus UI Ltd.', brandName: 'Proteus', currency: 'USD', dateFormat: 'DD/MM/YYYY', vatRate: 20, taxOffice: 'Istanbul V.D.', autoInvoice: true });
const currencies = [{ label: 'Amerikan Doları (USD)', value: 'USD' }, { label: 'Türk Lirası (TRY)', value: 'TRY' }];
const dateFormats = [{ label: 'GG/AA/YYYY', value: 'DD/MM/YYYY' }, { label: 'AA/GG/YYYY', value: 'MM/DD/YYYY' }];
const saveSettings = () => { toast.add('Ayarlar başarıyla güncellendi.', 'success'); };
</script>