<template>
    <AppModal :show="show" :title="isEditMode ? $t('settings.editRole') : $t('settings.createRole')" size="lg" @close="close">
        <div class="space-y-6">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AppInput v-model="form.name" :label="$t('settings.roleName')" placeholder="Örn: Operasyon Yöneticisi" :disabled="isEditMode" />

                <div class="space-y-1.5 opacity-50 pointer-events-none grayscale">
                    <label class="text-[10px] font-bold text-txt-muted uppercase tracking-widest ml-1">{{ $t('settings.description') }}</label>
                    <input type="text" class="w-full bg-card border border-line rounded-lg py-2 px-4 text-[13px] text-txt-main" disabled placeholder="Native RBAC modunda desteklenmiyor" />
                </div>
            </div>

            <div class="bg-side/30 border border-line rounded-xl p-4 flex items-center justify-between opacity-50 pointer-events-none grayscale">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <ShieldCheck class="w-4 h-4" />
                    </div>
                    <div>
                        <p class="text-xs font-bold text-txt-main">{{ $t('auth.twoFactorVerification') }}</p>
                        <p class="text-[10px] text-txt-muted">Desteklenmiyor</p>
                    </div>
                </div>
                <AppToggle :modelValue="false" label="" />
            </div>

            <div>
                <h3 class="text-[11px] font-bold text-txt-muted uppercase tracking-[0.2em] mb-4 border-b border-line pb-2">Erişim İzinleri</h3>

                <div class="space-y-3">
                    <div v-for="res in resources" :key="res.key" class="p-4 border border-line rounded-xl transition-all" :class="localPermissions[res.key]?.access ? 'bg-card border-txt-main/30 shadow-sm' : 'bg-side/20 opacity-70 hover:opacity-100'">

                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center gap-2">
                                <component :is="res.icon" class="w-4 h-4" :class="localPermissions[res.key]?.access ? 'text-txt-main' : 'text-txt-muted'" />
                                <span class="text-sm font-bold transition-colors" :class="localPermissions[res.key]?.access ? 'text-txt-main' : 'text-txt-muted'">{{ res.label }}</span>
                            </div>
                            <AppToggle :modelValue="localPermissions[res.key]?.access || false" @update:modelValue="toggleResourceAccess(res.key, $event)" label="" />
                        </div>

                        <div v-if="localPermissions[res.key]?.access" class="pl-6 pt-3 border-t border-line/50 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-in slide-in-from-top-1">
                            <AppCheck v-for="action in actions" :key="action.value" :modelValue="hasAction(res.key, action.value)" @update:modelValue="toggleAction(res.key, action.value)" :label="action.label" />
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <template #footer>
            <button @click="close" class="px-4 py-2 text-xs font-bold text-txt-muted hover:text-txt-main transition-colors">{{ $t('common.cancel') }}</button>
            <button @click="handleSave" :disabled="isLoading || !form.name" class="px-6 py-2 bg-txt-main text-main rounded-lg text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <Loader2 v-if="isLoading" class="w-3.5 h-3.5 animate-spin" />
                {{ isLoading ? $t('common.saving') : $t('common.save') }}
            </button>
        </template>
    </AppModal>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue';
import { ShieldCheck, Package, Calendar, Settings, Users, Loader2 } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import AppModal from '@/components/ui/AppModal.vue';
import AppInput from '@/components/forms/AppInput.vue';
import AppToggle from '@/components/forms/AppToggle.vue';
import AppCheck from '@/components/forms/AppCheck.vue';

const props = defineProps({ show: Boolean, roleToEdit: Object });
const emit = defineEmits(['close', 'create', 'update']);
const { t: $t } = useI18n();

const isLoading = ref(false);
const isEditMode = computed(() => !!props.roleToEdit);

const form = reactive({ name: '' });

const resources = [
    { key: 'orders', label: 'Sipariş Yönetimi', icon: Package },
    { key: 'events', label: 'Etkinlik Takvimi', icon: Calendar },
    { key: 'system_iam', label: 'Kullanıcı & Roller', icon: Users },
    { key: 'settings', label: 'Genel Ayarlar', icon: Settings },
];

const actions = [
    { label: 'Oluştur', value: 'create' },
    { label: 'Görüntüle', value: 'read' },
    { label: 'Düzenle', value: 'update' },
    { label: 'Sil', value: 'delete' },
];

const localPermissions = reactive({});

watch(() => props.show, (val) => {
    if (val) {
        if (props.roleToEdit) {
            const { name, permissions } = props.roleToEdit;
            form.name = name;

            resources.forEach(res => {
                localPermissions[res.key] = { access: false, actions: [] };
            });

            if (permissions && Array.isArray(permissions)) {
                permissions.forEach(perm => {
                    const [resKey, action] = perm.split(':');
                    if (localPermissions[resKey]) {
                        localPermissions[resKey].access = true;
                        if (!localPermissions[resKey].actions.includes(action)) {
                            localPermissions[resKey].actions.push(action);
                        }
                    }
                });
            }

        } else {
            form.name = '';
            resources.forEach(res => {
                localPermissions[res.key] = { access: false, actions: [] };
            });
        }
    }
});

const toggleResourceAccess = (resourceKey, value) => {
    if (value) {
        localPermissions[resourceKey] = { access: true, actions: ['read'] };
    } else {
        localPermissions[resourceKey] = { access: false, actions: [] };
    }
};

const hasAction = (resourceKey, actionValue) => {
    return localPermissions[resourceKey]?.actions.includes(actionValue);
};

const toggleAction = (resourceKey, actionValue) => {
    const currentActions = localPermissions[resourceKey].actions;
    if (currentActions.includes(actionValue)) {
        localPermissions[resourceKey].actions = currentActions.filter(a => a !== actionValue);
    } else {
        localPermissions[resourceKey].actions.push(actionValue);
    }
};

const close = () => emit('close');

const handleSave = async () => {
    isLoading.value = true;

    const permissionsList = [];
    Object.keys(localPermissions).forEach(key => {
        if (localPermissions[key].access) {
            const actions = localPermissions[key].actions;
            if (actions.length > 0) {
                actions.forEach(act => permissionsList.push(`${key}:${act}`));
            } else {
                permissionsList.push(`${key}:read`); // Default
            }
        }
    });

    const roleData = {
        roleName: isEditMode.value ? form.name : form.name.toLowerCase().replace(/\s+/g, '_'),
        permissions: permissionsList
    };

    if (isEditMode.value) {
        emit('update', roleData);
    } else {
        emit('create', roleData);
    }

    setTimeout(() => isLoading.value = false, 500);
};
</script>