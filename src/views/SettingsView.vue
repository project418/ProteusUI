<template>
  <div class="h-full bg-main overflow-y-auto custom-scrollbar transition-colors duration-500">
    <div class="max-w-5xl mx-auto p-4 lg:p-8 space-y-8 lg:space-y-10">

      <header class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-line pb-8 lg:pb-10">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-txt-main text-main flex items-center justify-center shadow-lg shrink-0">
            <Settings2 class="w-6 h-6" />
          </div>
          <div>
            <h1 class="text-xl lg:text-2xl font-bold text-txt-main tracking-tight">{{ $t('settings.organizationSettings') }}</h1>
            <p class="text-sm text-txt-muted mt-1 font-medium">
              {{ $t('settings.configurationFor', { name: authStore.currentTenant?.name }) }}
            </p>
          </div>
        </div>

        <button v-if="activeTab === 'general'" @click="handleUpdateTenant" class="w-full md:w-auto px-8 py-2.5 bg-txt-main text-main rounded-xl text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer">
          <Loader2 v-if="isSaving" class="w-4 h-4 animate-spin" />
          {{ isSaving ? $t('settings.saving') : $t('settings.saveChanges') }}
        </button>

        <button v-if="activeTab === 'members'" @click="showInviteModal = true" class="w-full md:w-auto px-6 py-2.5 bg-txt-main text-main rounded-xl text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer">
          <Plus class="w-4 h-4" /> {{ $t('settings.inviteNewMember') }}
        </button>

        <button v-if="activeTab === 'roles'" @click="openCreateRoleModal" class="w-full md:w-auto px-6 py-2.5 bg-txt-main text-main rounded-xl text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer">
          <Plus class="w-4 h-4" /> {{ $t('settings.createRole') }}
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
              <h3 class="text-[11px] font-bold text-txt-muted uppercase tracking-[0.2em] border-l-2 border-txt-main pl-3">{{ $t('settings.identity') }}</h3>
              <div class="grid grid-cols-1 gap-6">
                <AppInput v-model="generalForm.name" :label="$t('settings.organizationName')" :placeholder="$t('settings.companyName')" />
                <div class="opacity-50 pointer-events-none grayscale">
                  <AppFileUpload :label="$t('settings.systemLogo')" :maxSize="2" />
                </div>
              </div>
            </section>
          </div>

          <div v-if="activeTab === 'members'" class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-[11px] font-bold text-txt-muted uppercase tracking-[0.2em] border-l-2 border-txt-main pl-3">{{ $t('settings.teamMembers') }}</h3>
              <span class="text-[10px] font-bold text-txt-muted bg-side px-2 py-1 rounded border border-line">{{ members.length }} {{ $t('settings.users') }}</span>
            </div>

            <div v-if="isLoadingMembers" class="py-12 flex justify-center">
              <Loader2 class="w-8 h-8 text-txt-muted animate-spin" />
            </div>

            <div v-else class="space-y-3">
              <div v-for="member in members" :key="member.id" class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-card border border-line rounded-xl hover:border-txt-main/30 transition-all group">

                <div class="flex items-center gap-4 min-w-0 flex-1">
                  <img :src="member.avatar || `https://ui-avatars.com/api/?name=${member.firstName}+${member.lastName}&background=random`" class="w-10 h-10 rounded-lg border border-line object-cover shrink-0" />
                  <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <h4 class="text-sm font-bold text-txt-main truncate">{{ member.firstName }} {{ member.lastName }}</h4>
                      <span v-if="member.id === authStore.user?.id" class="text-[9px] font-bold bg-txt-main/10 text-txt-main px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">{{ $t('settings.you') }}</span>
                    </div>
                    <p class="text-xs text-txt-muted truncate">{{ member.email }}</p>
                  </div>
                </div>

                <div class="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-line/50">
                  <div class="relative">
                    <select class="bg-side border border-line rounded-lg text-[10px] font-bold uppercase text-txt-main py-1.5 pl-2 pr-6 outline-none focus:border-txt-main/50 transition-all cursor-pointer appearance-none hover:bg-side/80" @change="handleAssignRole(member, $event.target.value)" :value="member.role || ''">
                      <option value="" disabled selected hidden>{{ $t('settings.selectRole') }}</option>
                      <option v-for="role in authStore.roles" :key="role.name" :value="role.name">
                        {{ role.name.toUpperCase() }}
                      </option>
                    </select>
                    <div class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-txt-muted">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </div>
                  </div>

                  <div class="text-right hidden sm:block">
                    <p class="text-[10px] font-bold text-txt-muted uppercase tracking-wider">{{ $t('settings.joinedDate') }}</p>
                    <p class="text-xs font-medium text-txt-main mt-0.5">{{ new Date(member.joined).toLocaleDateString() }}</p>
                  </div>

                  <button v-if="member.id !== authStore.user?.id" @click="handleRemoveUser(member)" class="p-2 text-txt-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all opacity-100 sm:opacity-0 group-hover:opacity-100 cursor-pointer" :title="$t('settings.removeFromTeam')">
                    <Trash2 class="w-4 h-4" />
                  </button>
                  <div v-else class="w-8"></div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'roles'" class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-[11px] font-bold text-txt-muted uppercase tracking-[0.2em] border-l-2 border-txt-main pl-3">{{ $t('settings.policies') }}</h3>
            </div>

            <div v-if="isLoadingRoles" class="py-12 flex justify-center">
              <Loader2 class="w-8 h-8 text-txt-muted animate-spin" />
            </div>

            <div v-else class="space-y-3">
              <div v-for="role in authStore.roles" :key="role.name" class="flex items-center justify-between p-4 bg-card border border-line rounded-xl hover:border-txt-main/30 transition-all group">

                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-lg bg-side flex items-center justify-center border border-line text-txt-muted shrink-0">
                    <ShieldCheck class="w-5 h-5" />
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-txt-main capitalize">{{ role.name }}</h4>
                    <p class="text-[10px] text-txt-muted font-bold tracking-wider">ROLE</p>
                  </div>
                </div>

                <div class="flex-1 px-8 hidden sm:block">
                  <p class="text-xs text-txt-muted truncate">
                    {{ $t('settings.noDescription') }}
                  </p>
                </div>

                <div class="flex items-center gap-4">
                  <div v-if="role.name !== 'admin'" class="flex items-center gap-2">
                    <button @click="openEditRoleModal(role)" class="p-2 text-txt-muted hover:text-txt-main hover:bg-side rounded-lg transition-all cursor-pointer opacity-100 sm:opacity-0 group-hover:opacity-100" :title="$t('common.edit')">
                      <FileKey class="w-4 h-4" />
                    </button>

                    <button @click="confirmDeleteRole(role.name)" class="p-2 text-txt-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer opacity-100 sm:opacity-0 group-hover:opacity-100" :title="$t('settings.deleteRole')">
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                  <div v-else>
                    <span class="text-[9px] font-bold bg-amber-500/10 text-amber-600 px-2 py-1 rounded uppercase tracking-wider">SYSTEM</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div v-if="activeTab === 'finance'" class="space-y-8">
            <div class="p-8 border border-dashed border-line rounded-2xl text-center text-txt-muted">
              <Wallet2 class="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p class="text-sm">{{ $t('settings.financeComingSoon') }}</p>
            </div>
          </div>

        </div>
      </div>
    </div>

    <AppModal :show="showInviteModal" :title="$t('settings.inviteMember')" size="sm" @close="showInviteModal = false">
      <div class="space-y-5">
        <div class="bg-side/50 p-4 rounded-xl flex items-start gap-3">
          <Info class="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <p class="text-xs text-txt-muted leading-relaxed">
            {{ $t('settings.inviteDescription') }}
          </p>
        </div>

        <AppInput v-model="inviteForm.email" :label="$t('settings.emailAddress')" placeholder="ornek@sirket.com" />

        <AppSelect v-model="inviteForm.role" :label="$t('settings.accessPermission')" :options="roleOptions" :disabled="isLoadingRoles" :placeholder="isLoadingRoles ? $t('settings.loadingRoles') : $t('settings.selectRole')" />
      </div>
      <template #footer>
        <button @click="showInviteModal = false" class="px-4 py-2 text-xs font-bold text-txt-muted hover:text-txt-main transition-colors">{{ $t('common.cancel') }}</button>
        <button @click="handleInviteUser" :disabled="isInviting || !inviteForm.email || !inviteForm.role" class="px-6 py-2 bg-txt-main text-main rounded-lg text-xs font-bold hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          <Loader2 v-if="isInviting" class="w-3.5 h-3.5 animate-spin" />
          {{ isInviting ? $t('settings.sending') : $t('settings.sendInvite') }}
        </button>
      </template>
    </AppModal>

    <AppModal :show="showDeleteModal" :title="$t('settings.removeUser')" size="sm" @close="showDeleteModal = false">
      <div class="text-center py-4">
        <div class="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserX class="w-6 h-6" />
        </div>
        <p class="text-sm font-bold text-txt-main">{{ $t('settings.userWillBeRemoved', { firstName: userToDelete?.firstName, lastName: userToDelete?.lastName }) }}</p>
        <p class="text-xs text-txt-muted mt-2 max-w-[240px] mx-auto">{{ $t('settings.userAccessRemoved') }}</p>
      </div>
      <template #footer>
        <button @click="showDeleteModal = false" class="px-4 py-2 text-xs font-bold text-txt-muted hover:text-txt-main transition-colors">{{ $t('common.cancel') }}</button>
        <button @click="confirmRemoveUser" class="px-6 py-2 bg-rose-500 text-white rounded-lg text-xs font-bold hover:bg-rose-600 transition-colors">{{ $t('settings.yesRemove') }}</button>
      </template>
    </AppModal>

    <AppModal :show="showDeleteRoleModal" :title="$t('settings.deleteRole')" size="sm" @close="showDeleteRoleModal = false">
      <div class="text-center py-4">
        <div class="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 class="w-6 h-6" />
        </div>
        <p class="text-sm font-bold text-txt-main">{{ $t('settings.roleWillBeDeleted', { name: roleToDelete }) }}</p>
        <p class="text-xs text-txt-muted mt-2 max-w-[240px] mx-auto">{{ $t('settings.roleDeleteWarning') }}</p>
      </div>
      <template #footer>
        <button @click="showDeleteRoleModal = false" class="px-4 py-2 text-xs font-bold text-txt-muted hover:text-txt-main transition-colors">{{ $t('common.cancel') }}</button>
        <button @click="handleDeleteRole" class="px-6 py-2 bg-rose-500 text-white rounded-lg text-xs font-bold hover:bg-rose-600 transition-colors">{{ $t('settings.yesRemove') }}</button>
      </template>
    </AppModal>

    <RoleCreateModal :show="showRoleModal" :roleToEdit="roleToEdit" @close="closeRoleModal" @create="handleCreateRole" @update="handleUpdateRole" />

  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';
import { Settings2, Building2, Wallet2, ShieldCheck, Loader2, Plus, Trash2, UserX, Info, FileKey } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { useI18n } from 'vue-i18n';
import AppInput from '@/components/forms/AppInput.vue';
import AppSelect from '@/components/forms/AppSelect.vue';
import AppFileUpload from '@/components/forms/AppFileUpload.vue';
import AppModal from '@/components/ui/AppModal.vue';
import RoleCreateModal from '@/components/tenant/RoleCreateModal.vue';

const authStore = useAuthStore();
const { t: $t } = useI18n();
const activeTab = ref('general');
const isSaving = ref(false);

const settingTabs = [
  { id: 'general', label: $t('settings.general'), icon: Building2 },
  { id: 'members', label: $t('settings.members'), icon: ShieldCheck },
  { id: 'roles', label: $t('settings.policies'), icon: FileKey }, // Tab ID 'roles' oldu
  { id: 'finance', label: $t('settings.finance'), icon: Wallet2 },
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
const isLoadingRoles = ref(false);

const showRoleModal = ref(false);
const showDeleteRoleModal = ref(false);
const roleToDelete = ref(null);
const roleToEdit = ref(null);

const roleOptions = computed(() => {
  return authStore.roles.map(r => ({
    label: r.name.charAt(0).toUpperCase() + r.name.slice(1),
    value: r.name
  }));
});

const fetchMembers = async () => {
  isLoadingMembers.value = true;
  const result = await authStore.fetchTenantUsers();
  members.value = result.users.map(u => ({
    id: u.id,
    firstName: u.firstName || $t('settings.unnamed'),
    lastName: u.lastName || $t('settings.user'),
    email: u.email,
    avatar: u.avatar,
    joined: u.timeJoined,
    role: u.role || ''
  }));
  isLoadingMembers.value = false;
};

const fetchRolesData = async () => {
  isLoadingRoles.value = true;
  await authStore.fetchRoles();
  isLoadingRoles.value = false;

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

// --- ROLE ACTIONS ---

const openCreateRoleModal = () => {
  roleToEdit.value = null;
  showRoleModal.value = true;
};

const openEditRoleModal = (role) => {
  roleToEdit.value = role;
  showRoleModal.value = true;
};

const closeRoleModal = () => {
  showRoleModal.value = false;
  setTimeout(() => roleToEdit.value = null, 300);
};

const confirmDeleteRole = (roleName) => {
  roleToDelete.value = roleName;
  showDeleteRoleModal.value = true;
};

const handleDeleteRole = async () => {
  if (!roleToDelete.value) return;
  await authStore.deleteRole(roleToDelete.value);
  showDeleteRoleModal.value = false;
  roleToDelete.value = null;
  fetchRolesData();
};

const handleCreateRole = async ({ roleName, permissions }) => {
  const success = await authStore.createRole(roleName, permissions);
  if (success) {
    closeRoleModal();
    fetchRolesData();
  }
};

const handleUpdateRole = async ({ roleName, permissions }) => {
  const success = await authStore.updateRole(roleName, permissions);
  if (success) {
    closeRoleModal();
    fetchRolesData();
  }
};

// --- ROLE ASSIGNMENT ---
const handleAssignRole = async (member, newRole) => {
  if (!newRole || member.role === newRole) return;

  const success = await authStore.assignRole(member.id, newRole);
  if (success) {
    member.role = newRole;
  }
};

watch(activeTab, (newTab) => {
  if (newTab === 'members') {
    fetchMembers();
    fetchRolesData();
  }
  if (newTab === 'roles') {
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