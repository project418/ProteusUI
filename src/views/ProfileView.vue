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
            <p class="text-xs text-txt-muted mt-1">{{ authStore.user?.email }}</p>
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
              <h3 class="text-[11px] font-bold text-txt-muted uppercase tracking-[0.2em] border-l-2 border-txt-main pl-3">Şifre Yönetimi</h3>
              <div class="space-y-4">
                <AppInput type="password" label="Mevcut Şifre" placeholder="••••••••" />
                <AppInput type="password" label="Yeni Şifre" placeholder="••••••••" />
              </div>
            </section>

            <div class="h-px bg-line w-full"></div>

            <section class="space-y-6">
              <div class="flex items-center justify-between border-l-2 border-txt-main pl-3">
                <h3 class="text-[11px] font-bold text-txt-muted uppercase tracking-[0.2em]">İki Aşamalı Doğrulama (2FA)</h3>
                <button v-if="!setupData && authStore.hasMfaEnabled" @click="openSetupModal" class="text-[11px] font-bold text-txt-main hover:text-txt-muted transition-colors flex items-center gap-1 cursor-pointer">
                  <Plus class="w-3.5 h-3.5" /> Yeni Cihaz Ekle
                </button>
              </div>

              <div v-if="authStore.totpDevices.length === 0 && !setupData" class="p-6 bg-card border border-line rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div>
                  <h4 class="text-sm font-bold text-txt-main">Hesabınızı Koruyun</h4>
                  <p class="text-xs text-txt-muted mt-1 max-w-sm">Google Authenticator veya benzeri bir uygulama kullanarak hesabınıza ekstra bir güvenlik katmanı ekleyin.</p>
                </div>
                <button @click="openSetupModal" class="px-5 py-2.5 bg-txt-main text-main rounded-xl text-xs font-bold hover:opacity-90 transition-all shadow-lg shrink-0">
                  Kurulumu Başlat
                </button>
              </div>

              <div v-if="setupData" class="p-6 bg-card border border-line rounded-2xl space-y-6 animate-in">
                <div class="flex justify-between items-start">
                  <h4 class="text-sm font-bold text-txt-main">Yeni Cihaz Tanımlama: <span class="text-txt-muted">{{ newDeviceName }}</span></h4>
                  <button @click="setupData = null" class="text-txt-muted hover:text-rose-500 transition-colors">
                    <X class="w-4 h-4" />
                  </button>
                </div>

                <div class="flex flex-col sm:flex-row gap-8 items-center">
                  <div class="bg-white p-2 rounded-xl shrink-0 shadow-sm">
                    <img :src="qrCodeUrl" class="w-32 h-32" alt="QR Code" />
                  </div>
                  <div class="space-y-4 flex-1 w-full">
                    <div>
                      <p class="text-[10px] font-bold text-txt-muted uppercase tracking-wider mb-1">Kurulum Anahtarı</p>
                      <p class="font-mono text-xs bg-side p-2 rounded select-all border border-line text-txt-main">{{ setupData.secret }}</p>
                    </div>
                    <div class="space-y-2">
                      <p class="text-[10px] font-bold text-txt-muted uppercase tracking-wider">Doğrulama Kodu</p>
                      <div class="flex gap-2">
                        <input v-model="verifyCode" type="text" maxlength="6" class="w-32 text-center font-bold bg-main border border-line rounded-lg py-2 focus:border-txt-main outline-none text-txt-main tabular-nums transition-all" placeholder="000000" />
                        <button @click="completeMfaSetup" :disabled="verifyCode.length !== 6" class="px-4 bg-txt-main text-main rounded-lg text-xs font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all">Doğrula</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="authStore.totpDevices.length > 0" class="space-y-3">
                <div v-for="device in authStore.totpDevices" :key="device.name" class="flex items-center justify-between p-4 bg-card border border-line rounded-xl group hover:border-txt-main/30 transition-all">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0" :class="device.verified ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'">
                      <ShieldCheck class="w-5 h-5" />
                    </div>

                    <div>
                      <h4 class="text-sm font-bold text-txt-main">{{ device.name }}</h4>

                      <p v-if="device.verified" class="text-[10px] text-txt-muted font-bold uppercase tracking-wider flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                        Aktif & Doğrulandı
                      </p>
                      <p v-else class="text-[10px] text-amber-600 font-bold uppercase tracking-wider flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block animate-pulse"></span>
                        Doğrulama Bekliyor
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <button v-if="!device.verified" @click="resumeMfaSetup(device.name)" class="px-3 py-1.5 bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1">
                      <RefreshCw class="w-3 h-3" /> Kurulumu Tamamla
                    </button>

                    <button @click="askRemoveMfa(device.name)" class="p-2 text-txt-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer" title="Cihazı Kaldır">
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div v-if="['notifications', 'integrations'].includes(activeTab)" class="space-y-8">
            <div class="p-12 bg-card border border-line rounded-2xl text-center flex flex-col items-center gap-3">
              <div class="w-12 h-12 bg-side rounded-full flex items-center justify-center text-txt-muted">
                <component :is="activeTab === 'notifications' ? Bell : Globe" class="w-6 h-6" />
              </div>
              <p class="text-sm font-bold text-txt-main">Bu özellik yakında eklenecek.</p>
            </div>
          </div>

        </div>
      </div>
    </div>

    <AppModal :show="showAddDeviceModal" title="Yeni Cihaz Ekle" size="sm" @close="showAddDeviceModal = false">
      <div class="space-y-4">
        <div class="bg-side/50 p-4 rounded-xl text-center">
          <p class="text-sm text-txt-muted">Cihazınızı tanımlamak için bir isim giriniz.</p>
        </div>
        <AppInput v-model="newDeviceName" placeholder="Örn: iPhone 13, İş Bilgisayarı" @keydown.enter="confirmAddDevice" />
      </div>
      <template #footer>
        <button @click="showAddDeviceModal = false" class="px-4 py-2 text-xs font-bold text-txt-muted hover:text-txt-main transition-colors">Vazgeç</button>
        <button @click="confirmAddDevice" class="px-6 py-2 bg-txt-main text-main rounded-lg text-xs font-bold hover:opacity-90 transition-opacity">Devam Et</button>
      </template>
    </AppModal>

    <AppModal :show="showDeleteDeviceModal" title="Cihazı Sil" size="sm" @close="showDeleteDeviceModal = false">
      <div class="text-center py-4">
        <div class="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 class="w-6 h-6" />
        </div>
        <p class="text-sm font-bold text-txt-main">"{{ deviceToDelete }}" silinecek.</p>
        <p class="text-xs text-txt-muted mt-2 max-w-[200px] mx-auto">Bu işlem geri alınamaz. Cihazın erişimi kalıcı olarak kaldırılacaktır.</p>
      </div>
      <template #footer>
        <button @click="showDeleteDeviceModal = false" class="px-4 py-2 text-xs font-bold text-txt-muted hover:text-txt-main transition-colors">Vazgeç</button>
        <button @click="confirmRemoveDevice" class="px-6 py-2 bg-rose-500 text-white rounded-lg text-xs font-bold hover:bg-rose-600 transition-colors">Evet, Sil</button>
      </template>
    </AppModal>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { User, Camera, ShieldCheck, Bell, Globe, Plus, X, Trash2, RefreshCw } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { useToastStore } from '@/stores/toast';
import QRCode from 'qrcode';

import AppInput from '@/components/forms/AppInput.vue';
import AppSelect from '@/components/forms/AppSelect.vue';
import AppPhoneInput from '@/components/forms/AppPhoneInput.vue';
import AppModal from '@/components/ui/AppModal.vue';

const authStore = useAuthStore();
const toast = useToastStore();
const activeTab = ref('general');

const tabs = [
  { id: 'general', label: 'Profil', icon: User },
  { id: 'security', label: 'Güvenlik', icon: ShieldCheck },
  { id: 'notifications', label: 'Bildirimler', icon: Bell },
  { id: 'integrations', label: 'Bağlantılar', icon: Globe },
];

const user = reactive({
  firstName: 'John',
  lastName: 'Akıncı',
  name: 'John Akıncı',
  email: authStore.user?.email || 'user@example.com',
  phone: '5551234567',
  countryCode: '+90',
  role: 'Yönetici',
  department: 'Geliştirme',
  avatar: 'https://ui-avatars.com/api/?name=' + (authStore.user?.email || 'User'),
  timezone: 'GMT+3',
  language: 'tr',
  twoFactor: authStore.hasMfaEnabled
});

const timezones = [
  { label: 'Istanbul (GMT+3)', value: 'GMT+3' },
  { label: 'London (GMT+0)', value: 'GMT+0' },
  { label: 'New York (GMT-5)', value: 'GMT-5' }
];

const saveProfile = () => {
  toast.add('Profil değişiklikleri başarıyla kaydedildi.', 'success');
};

// --- MFA (2FA) ---
const setupData = ref(null);
const qrCodeUrl = ref('');
const verifyCode = ref('');
const newDeviceName = ref('');

// State for modals
const showAddDeviceModal = ref(false);
const showDeleteDeviceModal = ref(false);
const deviceToDelete = ref(null);

onMounted(() => {
  if (authStore.isAuthenticated) {
    authStore.fetchTotpDevices();
  }
});

const openSetupModal = () => {
  newDeviceName.value = `device-${Date.now()}`;
  showAddDeviceModal.value = true;
};

const confirmAddDevice = async () => {
  if (!newDeviceName.value) return;
  showAddDeviceModal.value = false;
  await startMfaSetup(newDeviceName.value);
};

const startMfaSetup = async (deviceName) => {
  const result = await authStore.createTotpDevice(deviceName);
  if (result.success) {
    setupData.value = result;
    qrCodeUrl.value = await QRCode.toDataURL(result.qrCode, { margin: 0.5 });
    verifyCode.value = '';
  }
};

const completeMfaSetup = async () => {
  if (!setupData.value) return;
  const success = await authStore.verifyTotpDevice(setupData.value.deviceName, verifyCode.value);
  if (success) {
    setupData.value = null
  }
};

const resumeMfaSetup = async (deviceName) => {
  await authStore.removeTotpDevice(deviceName);
  newDeviceName.value = deviceName;
  await startMfaSetup(deviceName);
};

const askRemoveMfa = (deviceName) => {
  deviceToDelete.value = deviceName;
  showDeleteDeviceModal.value = true;
};

const confirmRemoveDevice = async () => {
  if (deviceToDelete.value) {
    await authStore.removeTotpDevice(deviceToDelete.value);
    deviceToDelete.value = null;
    showDeleteDeviceModal.value = false;
  }
};
</script>