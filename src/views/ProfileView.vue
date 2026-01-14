<template>
  <div class="h-full bg-main overflow-y-auto custom-scrollbar transition-colors duration-500">
    <div class="max-w-5xl mx-auto p-4 lg:p-8 space-y-8 lg:space-y-10">

      <header class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-line pb-8 lg:pb-10">
        <div class="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
          <div class="relative group">
            <div class="w-24 h-24 rounded-2xl bg-side border-2 border-line flex items-center justify-center overflow-hidden shadow-xl">
              <img :src="displayAvatar" class="w-full h-full object-cover" />
              <div v-if="isAvatarUploading" class="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                <Loader2 class="w-8 h-8 text-white animate-spin" />
              </div>
            </div>

            <button @click="showAvatarModal = true" class="absolute -bottom-2 -right-2 p-2 bg-txt-main text-main rounded-lg shadow-lg hover:scale-110 transition-transform cursor-pointer">
              <Camera class="w-4 h-4" />
            </button>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-txt-main tracking-tight">{{ displayName }}</h1>
            <p class="text-sm text-txt-muted font-medium uppercase tracking-wider mt-1">
              {{ profileForm.title || 'Unvan Belirtilmedi' }}
            </p>
            <p class="text-xs text-txt-muted mt-1">{{ authStore.user?.email }}</p>
          </div>
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
                <AppInput v-model="profileForm.firstName" label="Ad" placeholder="Adınız" />
                <AppInput v-model="profileForm.lastName" label="Soyad" placeholder="Soyadınız" />
                <AppInput v-model="profileForm.title" label="Unvan" placeholder="Örn: Kıdemli Geliştirici" class="sm:col-span-2" />
                <AppInput v-model="profileForm.email" label="E-posta" class="sm:col-span-2" placeholder="ornek@sirket.com" />
                <AppPhoneInput v-model="profileForm.phone" v-model:countryCode="profileForm.countryCode" label="Telefon" class="sm:col-span-2" />
              </div>
            </section>

            <section class="space-y-6">
              <h3 class="text-[11px] font-bold text-txt-muted uppercase tracking-[0.2em] border-l-2 border-txt-main pl-3">Ayarlar</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AppSelect v-model="profileForm.timezone" label="Zaman Dilimi" :options="timezones" />
                <AppSelect v-model="profileForm.language" label="Dil" :options="[{ label: 'Türkçe', value: 'tr' }, { label: 'English', value: 'en' }]" />
              </div>
            </section>

            <div class="pt-4 border-t border-line flex justify-end">
              <button @click="saveProfile" :disabled="isSaving" class="px-8 py-2.5 bg-txt-main text-main rounded-xl text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                <Loader2 v-if="isSaving" class="w-4 h-4 animate-spin" />
                {{ isSaving ? 'Kaydediliyor...' : 'Profili Güncelle' }}
              </button>
            </div>
          </div>

          <div v-if="activeTab === 'security'" class="space-y-8">
            <section class="space-y-6">
              <h3 class="text-[11px] font-bold text-txt-muted uppercase tracking-[0.2em] border-l-2 border-txt-main pl-3">Şifre Yönetimi</h3>
              <div class="space-y-4">
                <AppInput v-model="passwordForm.currentPassword" type="password" label="Mevcut Şifre" placeholder="••••••••" />
                <AppInput v-model="passwordForm.newPassword" type="password" label="Yeni Şifre" placeholder="••••••••" />
              </div>
              <div class="flex justify-end">
                <button @click="updatePassword" :disabled="isPasswordSaving || !passwordForm.newPassword" class="px-6 py-2.5 bg-card border border-line text-txt-main rounded-xl text-xs font-bold hover:bg-side transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  <Loader2 v-if="isPasswordSaving" class="w-3.5 h-3.5 animate-spin" />
                  Şifreyi Değiştir
                </button>
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

              <div v-if="setupData" class="p-6 bg-card border border-line rounded-2xl space-y-6 animate-in slide-in-from-top-2 border-l-4 border-l-txt-main">
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

    <AppModal :show="showAvatarModal" title="Profil Fotoğrafı Yükle" size="sm" @close="showAvatarModal = false">
      <div class="space-y-6">
        <div class="relative border-2 border-dashed rounded-xl p-8 transition-all flex flex-col items-center justify-center gap-3 group cursor-pointer" :class="isDraggingAvatar ? 'border-txt-main bg-txt-main/5' : 'border-line hover:border-txt-main/30 bg-card/50'" @dragover.prevent="isDraggingAvatar = true" @dragleave.prevent="isDraggingAvatar = false" @drop.prevent="handleAvatarDrop" @click="triggerFileInput">
          <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileUpload" />

          <div class="w-12 h-12 rounded-full bg-side flex items-center justify-center text-txt-muted group-hover:scale-110 transition-transform">
            <UploadCloud class="w-6 h-6" />
          </div>

          <div class="text-center space-y-1">
            <p class="text-sm font-bold text-txt-main">Fotoğrafı buraya sürükleyin</p>
            <p class="text-xs text-txt-muted">veya seçmek için tıklayın</p>
          </div>
        </div>

        <div class="flex items-center gap-3 p-3 rounded-lg bg-side/50 border border-line">
          <Info class="w-4 h-4 text-blue-500 shrink-0" />
          <p class="text-[11px] text-txt-muted leading-tight">
            Desteklenen formatlar: JPG, PNG. <br>
            Maksimum dosya boyutu: <strong>1MB</strong>
          </p>
        </div>
      </div>
      <template #footer>
        <button @click="showAvatarModal = false" class="px-4 py-2 text-xs font-bold text-txt-muted hover:text-txt-main transition-colors">Vazgeç</button>
      </template>
    </AppModal>

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
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { User, Camera, ShieldCheck, Bell, Globe, Plus, X, Trash2, RefreshCw, Loader2, UploadCloud, Info } from 'lucide-vue-next';
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
const isSaving = ref(false);
const isPasswordSaving = ref(false);

const tabs = [
  { id: 'general', label: 'Profil', icon: User },
  { id: 'security', label: 'Güvenlik', icon: ShieldCheck },
  { id: 'notifications', label: 'Bildirimler', icon: Bell },
  { id: 'integrations', label: 'Bağlantılar', icon: Globe },
];

const timezones = [
  { label: 'Istanbul (GMT+3)', value: 'Europe/Istanbul' },
  { label: 'London (GMT+0)', value: 'Europe/London' },
  { label: 'New York (GMT-5)', value: 'America/New_York' }
];

const profileForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  countryCode: '+90',
  timezone: '',
  language: '',
  title: '',
  avatar: ''
});

const passwordForm = reactive({
  currentPassword: '',
  newPassword: ''
});

watch(() => authStore.user, (newUser) => {
  if (newUser) {
    profileForm.firstName = newUser.firstName || '';
    profileForm.lastName = newUser.lastName || '';
    profileForm.email = newUser.email || '';
    profileForm.phone = newUser.phone || '';
    profileForm.countryCode = newUser.countryCode || '+90';
    profileForm.timezone = newUser.timezone || '';
    profileForm.language = newUser.language || '';
    profileForm.title = newUser.title || '';
    profileForm.avatar = newUser.avatar || '';
  }
}, { immediate: true });

const displayName = computed(() => {
  if (profileForm.firstName && profileForm.lastName) {
    return `${profileForm.firstName} ${profileForm.lastName}`;
  }
  return authStore.user?.email?.split('@')[0] || 'Kullanıcı';
});

const displayAvatar = computed(() => {
  if (profileForm.avatar) return profileForm.avatar;
  return `https://ui-avatars.com/api/?name=${displayName.value}&background=333&color=fff`;
});

const showAvatarModal = ref(false);
const isDraggingAvatar = ref(false);
const isAvatarUploading = ref(false);
const fileInput = ref(null);

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleAvatarDrop = (e) => {
  isDraggingAvatar.value = false;
  const file = e.dataTransfer.files[0];
  if (file) processAvatarFile(file);
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) processAvatarFile(file);
};

const processAvatarFile = (file) => {
  if (!file.type.startsWith('image/')) {
    toast.add('Lütfen geçerli bir resim dosyası seçiniz.', 'error');
    return;
  }

  if (file.size > 1 * 1024 * 1024) {
    toast.add('Dosya boyutu 1MB\'dan küçük olmalıdır.', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = async (e) => {
    isAvatarUploading.value = true;
    showAvatarModal.value = false;

    const base64Image = e.target.result;

    const success = await authStore.updateProfile({ avatar: base64Image }, false);

    if (success) {
      profileForm.avatar = base64Image;
      toast.add('Profil fotoğrafı başarıyla güncellendi.', 'success');
    }

    isAvatarUploading.value = false;
  };
  reader.readAsDataURL(file);
};

const saveProfile = async () => {
  isSaving.value = true;
  await authStore.updateProfile(profileForm);
  isSaving.value = false;
};

const updatePassword = async () => {
  if (!passwordForm.newPassword || !passwordForm.currentPassword) {
    toast.add('Lütfen mevcut ve yeni şifrenizi giriniz.', 'warning');
    return;
  }
  if (passwordForm.newPassword.length < 6) {
    toast.add('Yeni şifre en az 6 karakter olmalıdır.', 'warning');
    return;
  }

  isPasswordSaving.value = true;
  const success = await authStore.updateProfile({
    password: passwordForm.newPassword,
    currentPassword: passwordForm.currentPassword
  }, false);

  if (success) {
    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    toast.add('Şifreniz başarıyla güncellendi.', 'success');
  }
  isPasswordSaving.value = false;
};

// --- MFA (2FA) ---
const setupData = ref(null);
const qrCodeUrl = ref('');
const verifyCode = ref('');
const newDeviceName = ref('');
const showAddDeviceModal = ref(false);
const showDeleteDeviceModal = ref(false);
const deviceToDelete = ref(null);

onMounted(() => {
  if (authStore.isAuthenticated) {
    authStore.fetchTotpDevices();
  }
});

const openSetupModal = () => {
  const randomSuffix = Math.floor(Math.random() * 1000);
  newDeviceName.value = `Cihaz-${randomSuffix}`;
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
    qrCodeUrl.value = await QRCode.toDataURL(result.qrCode);
    verifyCode.value = '';
  }
};

const completeMfaSetup = async () => {
  if (!setupData.value) return;
  const success = await authStore.verifyTotpDevice(setupData.value.deviceName, verifyCode.value);
  if (success) {
    setupData.value = null;
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