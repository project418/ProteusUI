<template>
  <div class="h-full bg-main overflow-y-auto custom-scrollbar transition-colors duration-500">
    <div class="max-w-5xl mx-auto p-4 lg:p-8 space-y-8 lg:space-y-10">

      <header class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-line pb-8 lg:pb-10">
        <div class="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
          <div class="relative group">
            <div class="w-24 h-24 rounded-2xl bg-side border-2 border-line flex items-center justify-center overflow-hidden shadow-xl">
              <img v-if="user.avatar" :src="user.avatar" class="w-full h-full object-cover" />
              <User v-else class="w-10 h-10 text-txt-muted" />
            </div>
            <button class="absolute -bottom-2 -right-2 p-2 bg-txt-main text-main rounded-lg shadow-lg hover:scale-110 transition-transform cursor-pointer">
              <Camera class="w-4 h-4" />
            </button>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-txt-main tracking-tight">{{ user.name }}</h1>
            <p class="text-sm text-txt-muted font-medium uppercase tracking-wider mt-1">{{ user.role }} • {{ user.department }}</p>
          </div>
        </div>
        <div class="flex w-full md:w-auto">
          <button @click="saveProfile" class="w-full md:w-auto px-8 py-2.5 bg-txt-main text-main rounded-xl text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg">
            Değişiklikleri Kaydet
          </button>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <nav class="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 custom-scrollbar">
          <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" class="flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold transition-all text-left whitespace-nowrap lg:whitespace-normal" :class="activeTab === tab.id ? 'bg-side text-txt-main shadow-sm' : 'text-txt-muted hover:bg-side/50 hover:text-txt-main'">
            <component :is="tab.icon" class="w-4 h-4 shrink-0" />
            {{ tab.label }}
          </button>
        </nav>

        <div class="lg:col-span-2 space-y-8 animate-in fade-in duration-500">
          <div v-if="activeTab === 'general'" class="space-y-8">
            <section class="space-y-6">
              <h3 class="text-[11px] font-bold text-txt-muted uppercase tracking-[0.2em] border-l-2 border-txt-main pl-3">Temel Bilgiler</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AppInput v-model="user.firstName" label="Ad" />
                <AppInput v-model="user.lastName" label="Soyad" />
                <AppInput v-model="user.email" label="E-posta" class="sm:col-span-2" />
                <AppPhoneInput v-model="user.phone" v-model:countryCode="user.countryCode" label="Telefon" class="sm:col-span-2" />
              </div>
            </section>

            <section class="space-y-6">
              <h3 class="text-[11px] font-bold text-txt-muted uppercase tracking-[0.2em] border-l-2 border-txt-main pl-3">Ayarlar</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AppSelect v-model="user.timezone" label="Zaman Dilimi" :options="timezones" />
                <AppSelect v-model="user.language" label="Dil" :options="[{ label: 'Türkçe', value: 'tr' }, { label: 'English', value: 'en' }]" />
              </div>
            </section>
          </div>

          <div v-if="activeTab === 'security'" class="space-y-8">
            <section class="space-y-6">
              <h3 class="text-[11px] font-bold text-txt-muted uppercase tracking-[0.2em] border-l-2 border-txt-main pl-3">Güvenlik</h3>
              <div class="space-y-4">
                <AppInput type="password" label="Mevcut Şifre" />
                <AppInput type="password" label="Yeni Şifre" />
              </div>
            </section>
            <section class="p-5 bg-card border border-line rounded-2xl space-y-4">
              <AppToggle v-model="user.twoFactor" label="2FA Doğrulama" />
              <p class="text-[11px] text-txt-muted leading-relaxed">Hesabınızı daha güvenli hale getirmek için telefon kodu kullanın.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { User, Camera, ShieldCheck, Bell, Globe } from 'lucide-vue-next';
import { useToastStore } from '@/stores/toast';
import AppInput from '@/components/forms/AppInput.vue';
import AppSelect from '@/components/forms/AppSelect.vue';
import AppPhoneInput from '@/components/forms/AppPhoneInput.vue';
import AppToggle from '@/components/forms/AppToggle.vue';

const toast = useToastStore();
const activeTab = ref('general');
const tabs = [
  { id: 'general', label: 'Profil', icon: User },
  { id: 'security', label: 'Güvenlik', icon: ShieldCheck },
  { id: 'notifications', label: 'Bildirimler', icon: Bell },
  { id: 'integrations', label: 'Bağlantılar', icon: Globe },
];
const user = reactive({
  firstName: 'John', lastName: 'Akıncı', name: 'John Akıncı',
  email: 'John@sirket.com', phone: '5551234567', countryCode: '+90',
  role: 'Yönetici', department: 'Geliştirme',
  avatar: 'https://i.pravatar.cc/150?u=John',
  timezone: 'GMT+3', language: 'tr', twoFactor: true
});
const timezones = [
  { label: 'Istanbul (GMT+3)', value: 'GMT+3' },
  { label: 'London (GMT+0)', value: 'GMT+0' }
];
const saveProfile = () => { toast.add('Profil güncellendi.', 'success'); };
</script>