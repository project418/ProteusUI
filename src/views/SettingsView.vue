<template>
  <div class="h-full bg-main overflow-y-auto custom-scrollbar transition-colors duration-500">
    <div class="max-w-5xl mx-auto p-4 lg:p-8 space-y-8 lg:space-y-10">

      <header class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-line pb-8 lg:pb-10">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-txt-main text-main flex items-center justify-center shadow-lg shrink-0">
            <Settings2 class="w-6 h-6" />
          </div>
          <div>
            <h1 class="text-xl lg:text-2xl font-bold text-txt-main tracking-tight">Organizasyon Ayarları</h1>
            <p class="text-sm text-txt-muted mt-1 font-medium">
              {{ authStore.currentTenant?.name }} için yapılandırma.
            </p>
          </div>
        </div>

        <button v-if="activeTab === 'general'" @click="handleUpdateTenant" class="w-full md:w-auto px-8 py-2.5 bg-txt-main text-main rounded-xl text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer">
          <Loader2 v-if="isSaving" class="w-4 h-4 animate-spin" />
          {{ isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet' }}
        </button>

        <button v-if="activeTab === 'members'" @click="showInviteModal = true" class="w-full md:w-auto px-6 py-2.5 bg-txt-main text-main rounded-xl text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer">
          <Plus class="w-4 h-4" /> Yeni Üye Davet Et
        </button>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">

        <nav class="lg:col-span-1 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 custom-scrollbar">
          <button v-for="tab in settingTabs" :key="tab.id" @click="activeTab = tab.id" class="flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold transition-all text-left whitespace-nowrap lg:whitespace-normal cursor-pointer" :class="activeTab === tab.id ? 'bg-side text-txt-main shadow-sm' : 'text-txt-muted hover:bg-side/50 hover:text-txt-main'">
            <component :is="tab.icon" class="w-4 h-4 shrink-0" />
            {{ tab.label }}
          </button>
        </nav>

        <div class="lg:col-span-3 space-y-10 animate-in fade-in duration-500">

          <div v-if="activeTab === 'general'" class="space-y-8">
            <section class="space-y-6">
              <h3 class="text-[11px] font-bold text-txt-muted uppercase tracking-[0.2em] border-l-2 border-txt-main pl-3">Kimlik Bilgileri</h3>
              <div class="grid grid-cols-1 gap-6">
                <AppInput v-model="generalForm.name" label="Organizasyon Adı" placeholder="Şirketinizin adı" />
                <div class="opacity-50 pointer-events-none grayscale">
                  <AppFileUpload label="Sistem Logosu (Yakında)" :maxSize="2" />
                </div>
              </div>
            </section>
          </div>

          <div v-if="activeTab === 'members'" class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-[11px] font-bold text-txt-muted uppercase tracking-[0.2em] border-l-2 border-txt-main pl-3">Ekip Üyeleri</h3>
              <span class="text-[10px] font-bold text-txt-muted bg-side px-2 py-1 rounded border border-line">{{ members.length }} Kullanıcı</span>
            </div>

            <div v-if="isLoadingMembers" class="py-12 flex justify-center">
              <Loader2 class="w-8 h-8 text-txt-muted animate-spin" />
            </div>

            <div v-else class="space-y-3">
              <div v-for="member in members" :key="member.id" class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-card border border-line rounded-xl hover:border-txt-main/30 transition-all group">
                <div class="flex items-center gap-4">
                  <img :src="member.avatar || `https://ui-avatars.com/api/?name=${member.firstName}+${member.lastName}&background=random`" class="w-10 h-10 rounded-lg border border-line object-cover" />
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="text-sm font-bold text-txt-main">{{ member.firstName }} {{ member.lastName }}</h4>
                      <span v-if="member.id === authStore.user?.id" class="text-[9px] font-bold bg-txt-main/10 text-txt-main px-1.5 py-0.5 rounded uppercase tracking-wider">Siz</span>
                    </div>
                    <p class="text-xs text-txt-muted">{{ member.email }}</p>
                  </div>
                </div>

                <div class="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-line/50">
                  <div class="text-right">
                    <p class="text-[10px] font-bold text-txt-muted uppercase tracking-wider">Katılma Tarihi</p>
                    <p class="text-xs font-medium text-txt-main mt-0.5">{{ new Date(member.joined).toLocaleDateString() }}</p>
                  </div>

                  <button v-if="member.id !== authStore.user?.id" @click="handleRemoveUser(member)" class="p-2 text-txt-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all opacity-100 sm:opacity-0 group-hover:opacity-100 cursor-pointer" title="Ekipten Çıkar">
                    <Trash2 class="w-4 h-4" />
                  </button>
                  <div v-else class="w-8"></div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'finance'" class="space-y-8">
            <div class="p-8 border border-dashed border-line rounded-2xl text-center text-txt-muted">
              <Wallet2 class="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p class="text-sm">Finansal ayarlar yakında eklenecek.</p>
            </div>
          </div>

        </div>
      </div>
    </div>

    <AppModal :show="showInviteModal" title="Yeni Üye Davet Et" size="sm" @close="showInviteModal = false">
      <div class="space-y-5">
        <div class="bg-side/50 p-4 rounded-xl flex items-start gap-3">
          <Info class="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <p class="text-xs text-txt-muted leading-relaxed">
            Davet edilen kullanıcıya bir e-posta gönderilecek ve şifresini belirleyerek sisteme katılması istenecektir.
          </p>
        </div>

        <AppInput v-model="inviteForm.email" label="E-posta Adresi" placeholder="ornek@sirket.com" />

        <AppSelect v-model="inviteForm.role" label="Erişim Yetkisi" :options="roleOptions" :disabled="loadingRoles" :placeholder="loadingRoles ? 'Roller yükleniyor...' : 'Bir rol seçin'" />
      </div>
      <template #footer>
        <button @click="showInviteModal = false" class="px-4 py-2 text-xs font-bold text-txt-muted hover:text-txt-main transition-colors">Vazgeç</button>
        <button @click="handleInviteUser" :disabled="isInviting || !inviteForm.email || !inviteForm.role" class="px-6 py-2 bg-txt-main text-main rounded-lg text-xs font-bold hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          <Loader2 v-if="isInviting" class="w-3.5 h-3.5 animate-spin" />
          {{ isInviting ? 'Gönderiliyor...' : 'Davet Gönder' }}
        </button>
      </template>
    </AppModal>

    <AppModal :show="showDeleteModal" title="Kullanıcıyı Çıkar" size="sm" @close="showDeleteModal = false">
      <div class="text-center py-4">
        <div class="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserX class="w-6 h-6" />
        </div>
        <p class="text-sm font-bold text-txt-main">{{ userToDelete?.firstName }} {{ userToDelete?.lastName }} çıkarılacak.</p>
        <p class="text-xs text-txt-muted mt-2 max-w-[240px] mx-auto">Bu kullanıcının organizasyona erişimi kalıcı olarak kaldırılacaktır. Emin misiniz?</p>
      </div>
      <template #footer>
        <button @click="showDeleteModal = false" class="px-4 py-2 text-xs font-bold text-txt-muted hover:text-txt-main transition-colors">Vazgeç</button>
        <button @click="confirmRemoveUser" class="px-6 py-2 bg-rose-500 text-white rounded-lg text-xs font-bold hover:bg-rose-600 transition-colors">Evet, Çıkar</button>
      </template>
    </AppModal>

  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';
import { Settings2, Building2, Wallet2, ShieldCheck, Loader2, Plus, Trash2, UserX, Info } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import AppInput from '@/components/forms/AppInput.vue';
import AppSelect from '@/components/forms/AppSelect.vue';
import AppFileUpload from '@/components/forms/AppFileUpload.vue';
import AppModal from '@/components/ui/AppModal.vue';

const authStore = useAuthStore();
const activeTab = ref('general');
const isSaving = ref(false);

const settingTabs = [
  { id: 'general', label: 'Genel', icon: Building2 },
  { id: 'members', label: 'Üyeler', icon: ShieldCheck },
  { id: 'finance', label: 'Finans', icon: Wallet2 },
];

const generalForm = reactive({ name: '' });

const initForm = () => {
  if (authStore.currentTenant) {
    generalForm.name = authStore.currentTenant.name;
  }
};

const handleUpdateTenant = async () => {
  if (!generalForm.name) return;
  isSaving.value = true;
  await authStore.updateTenant(generalForm.name);
  isSaving.value = false;
};

const members = ref([]);
const isLoadingMembers = ref(false);
const showDeleteModal = ref(false);
const userToDelete = ref(null);

const showInviteModal = ref(false);
const isInviting = ref(false);
const inviteForm = reactive({ email: '', role: '' });
const loadingRoles = ref(false);

const roleOptions = computed(() => {
  return authStore.roles.map(r => ({
    label: r.name.charAt(0).toUpperCase() + r.name.slice(1) + (r.policy?.description ? ` - ${r.policy.description}` : ''),
    value: r.name
  }));
});

const fetchMembers = async () => {
  isLoadingMembers.value = true;
  const result = await authStore.fetchTenantUsers();
  members.value = result.users.map(u => ({
    id: u.id,
    firstName: u.firstName || 'İsimsiz',
    lastName: u.lastName || 'Kullanıcı',
    email: u.email,
    avatar: u.avatar,
    joined: u.timeJoined
  }));
  isLoadingMembers.value = false;
};

const fetchRolesData = async () => {
  loadingRoles.value = true;
  await authStore.fetchRoles();
  loadingRoles.value = false;

  if (authStore.roles.length > 0 && !inviteForm.role) {
    const defaultRole = authStore.roles.find(r => r.name === 'user') || authStore.roles[0];
    inviteForm.role = defaultRole.name;
  }
};

const handleRemoveUser = (user) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

const confirmRemoveUser = async () => {
  if (!userToDelete.value) return;
  const success = await authStore.removeUserFromTenant(userToDelete.value.id);
  if (success) {
    members.value = members.value.filter(m => m.id !== userToDelete.value.id);
    showDeleteModal.value = false;
    userToDelete.value = null;
  }
};

const handleInviteUser = async () => {
  if (!inviteForm.email || !inviteForm.role) return;
  isInviting.value = true;
  const success = await authStore.inviteUser(inviteForm.email, inviteForm.role);
  isInviting.value = false;
  if (success) {
    showInviteModal.value = false;
    inviteForm.email = '';
  }
};

watch(activeTab, (newTab) => {
  if (newTab === 'members') {
    fetchMembers();
    fetchRolesData();
  }
});

onMounted(() => {
  initForm();
  if (activeTab.value === 'members') {
    fetchMembers();
    fetchRolesData();
  }
});

watch(() => authStore.currentTenant, initForm);
</script>