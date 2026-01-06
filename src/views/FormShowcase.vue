<template>
  <div class="h-full bg-main p-4 lg:p-8 overflow-y-auto custom-scrollbar transition-colors duration-500">
    <div class="max-w-5xl mx-auto space-y-8 lg:space-y-12 pb-24">

      <section class="flex flex-wrap gap-3 lg:gap-4 p-4 lg:p-6 bg-side/10 border border-line rounded-2xl animate-in">
        <div class="w-full mb-2">
          <h3 class="text-[10px] font-bold text-txt-muted uppercase tracking-[0.2em]">Modal Test Alanı</h3>
        </div>
        <button @click="showInfoModal = true" class="flex-1 lg:flex-none px-5 py-2.5 bg-card border border-line rounded-xl text-xs font-bold text-txt-main hover:bg-side transition-all flex items-center justify-center gap-2">
          <Info class="w-4 h-4 text-blue-500" /> Standart
        </button>
        <button @click="showDeleteModal = true" class="flex-1 lg:flex-none px-5 py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2">
          <Trash2 class="w-4 h-4" /> Sil
        </button>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        <section class="space-y-8 lg:space-y-10">
          <div>
            <h3 class="text-xs font-bold text-txt-muted uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <User class="w-3.5 h-3.5" /> Kimlik ve İletişim
            </h3>
            <div class="space-y-5">
              <AppInput v-model="formData.name" label="Tam Ad Soyad" placeholder="Örn: John Akıncı">
                <template #icon>
                  <User class="w-4 h-4" />
                </template>
              </AppInput>
              <AppInput v-model="formData.email" label="E-posta" type="email" placeholder="John@sirket.com" />
              <AppPhoneInput v-model="formData.phone" v-model:countryCode="formData.countryCode" label="Telefon Numarası" />
            </div>
          </div>

          <div>
            <h3 class="text-xs font-bold text-txt-muted uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Target class="w-3.5 h-3.5" /> Müşteri Segmentasyonu
            </h3>
            <div class="space-y-5">
              <div class="grid grid-cols-2 gap-4">
                <AppDatePicker v-model="formData.followUpDate" label="Takip Tarihi" />
                <AppRating v-model="formData.leadScore" label="Puan" />
              </div>
              <AppStatusSelect v-model="formData.leadStatus" label="Lead Durumu" :options="[
                { label: 'Yeni', value: 'new', color: 'text-blue-500' },
                { label: 'Sıcak', value: 'hot', color: 'text-orange-500' },
                { label: 'Kazanıldı', value: 'won', color: 'text-emerald-500' },
                { label: 'Kaybedildi', value: 'lost', color: 'text-rose-500' }
              ]" />
            </div>
          </div>
        </section>

        <section class="space-y-8 lg:space-y-10">
          <div>
            <h3 class="text-xs font-bold text-txt-muted uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <CreditCard class="w-3.5 h-3.5" /> Finansal Veriler
            </h3>
            <div class="bg-side/20 p-5 rounded-2xl border border-line space-y-5">
              <div class="grid grid-cols-2 gap-4">
                <AppCurrencyInput v-model="formData.price" label="Birim Fiyat" currencySymbol="₺" />
                <AppNumberInput v-model="formData.quantity" label="Miktar" />
              </div>
              <div class="pt-2 flex justify-between items-center border-t border-line/50">
                <span class="text-[10px] font-bold text-txt-muted uppercase tracking-widest">Toplam</span>
                <span class="text-xl font-bold text-txt-main tabular-nums">
                  ₺{{ (Number(formData.price) * Number(formData.quantity)).toLocaleString() }}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-xs font-bold text-txt-muted uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Settings2 class="w-3.5 h-3.5" /> Sistem Tercihleri
            </h3>
            <div class="space-y-6">
              <AppSelect v-model="formData.role" label="Erişim Yetkisi" :options="[{ label: 'Yönetici', value: 'admin' }, { label: 'Operatör', value: 'op' }]" />
              <AppTagInput v-model="formData.tags" label="Sistem Etiketleri" />
              <div class="bg-card border border-line rounded-xl p-4 space-y-4 shadow-sm">
                <AppToggle v-model="formData.notifications" label="E-posta Bildirimleri" />
                <div class="h-px bg-line w-full"></div>
                <AppToggle v-model="formData.twoFactor" label="2FA Güvenlik" />
              </div>
            </div>
          </div>
        </section>
      </div>

      <section class="pt-6">
        <h3 class="text-xs font-bold text-txt-muted uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          <FileText class="w-3.5 h-3.5" /> Dökümantasyon
        </h3>
        <AppFileUpload label="Sözleşmeler ve Ekler" />
      </section>

      <footer class="pt-10 border-t border-line flex flex-col lg:flex-row justify-end items-center gap-4">
        <p class="text-[11px] text-txt-muted italic lg:mr-auto order-2 lg:order-1 text-center">Son güncelleme: {{ new Date().toLocaleTimeString() }}</p>
        <button @click="submitShowcase" class="w-full lg:w-auto px-10 py-2.5 bg-txt-main text-main rounded-xl text-xs font-bold hover:opacity-90 transition-all shadow-xl order-1 lg:order-2">
          Tüm Verileri Kaydet
        </button>
      </footer>

      <AppModal :show="showInfoModal" title="Sistem Bilgilendirmesi" @close="showInfoModal = false">
        <div class="space-y-4">
          <p class="text-sm text-txt-main leading-relaxed">
            Bu modal, Catalyst tasarım diline uygun olarak <strong>Teleport</strong> ve <strong>Transition</strong> kullanılarak oluşturulmuştur.
          </p>
        </div>
        <template #footer>
          <button @click="showInfoModal = false" class="px-6 py-2 bg-txt-main text-main rounded-lg text-xs font-bold hover:opacity-90">Anladım</button>
        </template>
      </AppModal>

      <AppModal :show="showDeleteModal" title="Kaydı Kalıcı Olarak Sil" size="sm" @close="showDeleteModal = false">
        <div class="text-center py-4">
          <div class="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle class="w-6 h-6" />
          </div>
          <p class="text-sm font-bold text-txt-main">John Akıncı silinecek.</p>
          <p class="text-xs text-txt-muted mt-2">Bu işlem geri alınamaz.</p>
        </div>
        <template #footer>
          <button @click="showDeleteModal = false" class="px-4 py-2 text-xs font-bold text-txt-muted">Vazgeç</button>
          <button @click="handleDelete" class="px-6 py-2 bg-rose-500 text-white rounded-lg text-xs font-bold hover:bg-rose-600 transition-colors">Evet, Sil</button>
        </template>
      </AppModal>

    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import {
  User, Target, CreditCard, Settings2, FileText,
  Info, Trash2, AlertTriangle
} from 'lucide-vue-next';
import { useToastStore } from '@/stores/toast';

import AppInput from '@/components/forms/AppInput.vue';
import AppSelect from '@/components/forms/AppSelect.vue';
import AppTagInput from '@/components/forms/AppTagInput.vue';
import AppToggle from '@/components/forms/AppToggle.vue';
import AppFileUpload from '@/components/forms/AppFileUpload.vue';
import AppCurrencyInput from '@/components/forms/AppCurrencyInput.vue';
import AppNumberInput from '@/components/forms/AppNumberInput.vue';
import AppDatePicker from '@/components/forms/AppDatePicker.vue';
import AppStatusSelect from '@/components/forms/AppStatusSelect.vue';
import AppRating from '@/components/forms/AppRating.vue';
import AppPhoneInput from '@/components/forms/AppPhoneInput.vue';
import AppModal from '@/components/ui/AppModal.vue';

const toast = useToastStore();

const showInfoModal = ref(false);
const showDeleteModal = ref(false);

const formData = reactive({
  name: 'John Akıncı',
  email: 'John@akinci.me',
  phone: '5551234567',
  countryCode: '+90',
  role: 'admin',
  tags: ['VIP', 'Developer'],
  notifications: true,
  twoFactor: false,
  isBusiness: true,
  price: '4500',
  quantity: 2,
  leadScore: 4,
  leadStatus: 'hot',
  followUpDate: '2026-02-15'
});

const submitShowcase = () => {
  toast.add('Tüm veriler başarıyla kaydedildi.', 'success');
};

const handleDelete = () => {
  showDeleteModal.value = false;
  toast.add('Kayıt başarıyla silindi.', 'error');
};
</script>

<style scoped>
.animate-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>