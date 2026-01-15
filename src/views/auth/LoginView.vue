<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-main px-4 sm:px-6 py-12 transition-colors duration-300">
        <div class="w-full max-w-[400px] text-center mb-10">
            <div class="inline-flex items-center justify-center w-12 h-12 bg-card border border-line rounded-xl mb-4 shadow-sm">
                <div class="w-6 h-6 border-2 border-txt-main rounded-full opacity-90"></div>
            </div>
            <h1 class="text-2xl font-bold text-txt-main tracking-tight">{{ $t('auth.loginTitle') }}</h1>
            <p class="text-sm text-txt-muted mt-2">
                {{ $t('auth.noAccount') }}
                <router-link to="/register" class="text-txt-main font-semibold hover:underline">
                    {{ $t('auth.registerLink') }}
                </router-link>
            </p>
        </div>

        <div class="w-full max-w-[400px] space-y-6">
            <form @submit.prevent="handleLogin" class="space-y-4">
                <AppInput v-model="email" :label="$t('auth.email')" type="email" placeholder="name@company.com" required />

                <div class="space-y-1.5">
                    <div class="flex items-center justify-between px-1">
                        <label class="text-[10px] font-bold text-txt-muted uppercase tracking-widest">{{ $t('auth.password') }}</label>
                        <button type="button" @click="showForgotModal = true" class="text-[10px] font-bold text-txt-muted hover:text-txt-main transition-colors uppercase tracking-widest cursor-pointer">
                            {{ $t('auth.forgotPassword') }}
                        </button>
                    </div>
                    <input v-model="password" type="password" class="w-full bg-card border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ring-txt-main/5 focus:border-txt-main/20 transition-all text-txt-main" placeholder="••••••••" required />
                </div>

                <button type="submit" :disabled="isLoading" class="w-full bg-txt-main text-main py-3 rounded-xl font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                    <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
                    <span>{{ isLoading ? 'Giriş Yapılıyor...' : $t('auth.signIn') }}</span>
                </button>
            </form>

            <div class="relative py-4">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-line"></div>
                </div>
                <div class="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                    <span class="bg-main px-4 text-txt-muted">{{ $t('auth.or') }}</span>
                </div>
            </div>

            <button class="w-full flex items-center justify-center gap-3 bg-card border border-line py-3 rounded-xl font-bold text-sm text-txt-main hover:bg-side transition-colors">
                <img src="https://www.svgrepo.com/show/355037/google.svg" class="w-4 h-4" />
                Google
            </button>
        </div>

        <div class="fixed bottom-8 flex items-center gap-2">
            <button @click="themeStore.toggleTheme()" class="p-2 hover:bg-side rounded-lg text-txt-muted hover:text-txt-main cursor-pointer">
                <component :is="themeStore.isDark ? Sun : Moon" class="w-4 h-4" />
            </button>
            <div class="h-3 w-px bg-line"></div>
            <select :value="locale" @change="changeLanguage" class="bg-transparent text-xs border-none focus:ring-0 cursor-pointer text-txt-muted hover:text-txt-main py-1">
                <option value="tr">TR</option>
                <option value="en">EN</option>
            </select>
        </div>

        <AppModal :show="showForgotModal" title="Şifremi Unuttum" size="sm" @close="showForgotModal = false">
            <div class="space-y-6">
                <div class="text-center space-y-2">
                    <div class="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto">
                        <KeyRound class="w-6 h-6" />
                    </div>
                    <p class="text-sm text-txt-muted">
                        Hesabınıza ait e-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
                    </p>
                </div>

                <div class="space-y-4">
                    <AppInput v-model="forgotEmail" label="E-posta Adresi" placeholder="ornek@sirket.com" />
                    <button @click="handleForgotPassword" :disabled="isSendingReset || !forgotEmail" class="w-full bg-txt-main text-main py-2.5 rounded-xl font-bold text-xs hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
                        <Loader2 v-if="isSendingReset" class="w-3.5 h-3.5 animate-spin" />
                        {{ isSendingReset ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder' }}
                    </button>
                </div>
            </div>
        </AppModal>

        <AppModal :show="showVerifyModal" title="İki Aşamalı Doğrulama" size="sm" :closeOnBackdrop="false" @close="showVerifyModal = false">
            <div class="space-y-6 py-2">
                <div class="text-center space-y-2">
                    <div class="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto">
                        <ShieldCheck class="w-6 h-6" />
                    </div>
                    <p class="text-sm text-txt-muted">Lütfen authenticator uygulamanızdaki 6 haneli kodu giriniz.</p>
                </div>

                <div class="flex justify-center gap-2">
                    <input v-for="(digit, index) in 6" :key="index" ref="otpInputs" type="text" maxlength="1" v-model="otpCode[index]" @input="handleOtpInput($event, index)" @keydown.delete="handleOtpBackspace($event, index)" @paste="handlePaste" class="w-10 h-12 text-center text-lg font-bold bg-card border border-line rounded-lg focus:border-txt-main focus:ring-2 focus:ring-txt-main/10 outline-none transition-all tabular-nums text-txt-main" />
                </div>

                <button @click="verifyMfa" :disabled="isVerifying || otpCode.join('').length !== 6" class="w-full bg-txt-main text-main py-2.5 rounded-xl font-bold text-xs hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                    {{ isVerifying ? 'Doğrulanıyor...' : 'Doğrula ve Devam Et' }}
                </button>
            </div>
        </AppModal>

        <AppModal :show="showSetupModal" title="2FA Kurulumu Gerekli" size="sm" :closeOnBackdrop="false" @close="() => { }">
            <div class="space-y-6 py-2">
                <div class="text-center space-y-2">
                    <p class="text-sm text-txt-muted">Hesabınız için iki aşamalı doğrulama zorunludur. Lütfen aşağıdaki QR kodu taratın.</p>
                </div>

                <div v-if="setupData" class="flex flex-col items-center gap-4">
                    <div class="bg-white p-2 rounded-xl shadow-sm">
                        <img :src="qrCodeUrl" class="w-40 h-40" />
                    </div>
                    <p class="text-[11px] font-mono bg-side p-2 rounded-lg text-txt-main select-all border border-line">{{ setupData.secret }}</p>
                </div>
                <div v-else class="flex justify-center py-4">
                    <Loader2 class="w-8 h-8 animate-spin text-txt-muted" />
                </div>

                <div class="space-y-3">
                    <label class="text-[10px] font-bold text-txt-muted uppercase tracking-widest block text-center">Doğrulama Kodu</label>
                    <div class="flex justify-center gap-2">
                        <input v-model="setupVerifyCode" type="text" maxlength="6" class="w-full text-center text-lg font-bold bg-card border border-line rounded-xl py-2.5 tracking-widest focus:border-txt-main outline-none transition-all text-txt-main tabular-nums" placeholder="000000" />
                    </div>
                    <button @click="completeSetup" :disabled="isVerifying || setupVerifyCode.length !== 6" class="w-full bg-txt-main text-main py-2.5 rounded-xl font-bold text-xs hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                        {{ isVerifying ? 'Doğrulanıyor...' : 'Kurulumu Tamamla' }}
                    </button>
                </div>
            </div>
        </AppModal>

        <AppModal :show="showForcePasswordChangeModal" title="Şifre Değişikliği Gerekli" size="sm" :closeOnBackdrop="false" @close="() => { }">
            <div class="space-y-6">
                <div class="text-center space-y-2">
                    <div class="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto">
                        <KeyRound class="w-6 h-6" />
                    </div>
                    <p class="text-sm text-txt-muted">
                        Güvenliğiniz için şifrenizi güncellemeniz gerekmektedir.
                    </p>
                </div>

                <div class="space-y-4">
                    <div class="space-y-1.5">
                        <AppInput v-model="newPassword" label="Yeni Şifre" type="password" placeholder="••••••••" />
                        <p class="text-[10px] text-txt-muted">En az 6 karakter olmalıdır.</p>
                    </div>
                    <AppInput v-model="confirmNewPassword" label="Yeni Şifre (Tekrar)" type="password" placeholder="••••••••" />

                    <button @click="handleForcePasswordChange" :disabled="isChangingPassword || !newPassword || !confirmNewPassword" class="w-full bg-txt-main text-main py-2.5 rounded-xl font-bold text-xs hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
                        <Loader2 v-if="isChangingPassword" class="w-3.5 h-3.5 animate-spin" />
                        {{ isChangingPassword ? 'Güncelleniyor...' : 'Şifreyi Güncelle ve Devam Et' }}
                    </button>
                </div>
            </div>
        </AppModal>

    </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { Sun, Moon, Loader2, ShieldCheck, KeyRound } from 'lucide-vue-next';
import { useThemeStore } from '@/stores/theme';
import { useAuthStore } from '@/stores/auth';
import { useToastStore } from '@/stores/toast';
import AppInput from '@/components/forms/AppInput.vue';
import AppModal from '@/components/ui/AppModal.vue';
import QRCode from 'qrcode';

const themeStore = useThemeStore()
const authStore = useAuthStore()
const toast = useToastStore()
const router = useRouter()
const route = useRoute()
const { locale } = useI18n()

// Form State
const email = ref('')
const password = ref('')
const isLoading = ref(false)

// Modals State
const showVerifyModal = ref(false)
const showSetupModal = ref(false)
const showForgotModal = ref(false)
const showForcePasswordChangeModal = ref(false)

// Forgot Password Logic
const forgotEmail = ref('')
const isSendingReset = ref(false)

// Force Password Change Logic
const newPassword = ref('')
const confirmNewPassword = ref('')
const isChangingPassword = ref(false)

// Verify Logic (OTP Input)
const isVerifying = ref(false)
const otpCode = ref(new Array(6).fill(''))
const otpInputs = ref([])

// Setup Logic
const setupData = ref(null)
const qrCodeUrl = ref('')
const setupVerifyCode = ref('')

// --- Login Process ---
const handleLogin = async () => {
    isLoading.value = true
    const result = await authStore.login(email.value, password.value)
    isLoading.value = false

    if (result.success) {
        if (result.status === 'MFA_VERIFY') {
            showVerifyModal.value = true
            nextTick(() => otpInputs.value[0]?.focus())
        } else if (result.status === 'MFA_SETUP') {
            await startForcedSetup()
        } else if (result.status === 'PASSWORD_CHANGE_REQUIRED') {
            showForcePasswordChangeModal.value = true
        } else {
            const redirectPath = route.query.redirect || '/'
            router.push(redirectPath)
        }
    }
}

// --- Password Change Process ---
const handleForcePasswordChange = async () => {
    if (newPassword.value !== confirmNewPassword.value) {
        toast.add('Şifreler eşleşmiyor.', 'warning')
        return
    }
    if (newPassword.value.length < 6) {
        toast.add('Şifre en az 6 karakter olmalıdır.', 'warning')
        return
    }

    isChangingPassword.value = true

    const success = await authStore.updateProfile({
        password: newPassword.value,
        currentPassword: password.value
    })

    isChangingPassword.value = false

    if (success) {
        showForcePasswordChangeModal.value = false
        const redirectPath = route.query.redirect || '/'
        router.push(redirectPath)
    }
}

// --- MFA Processes ---
const verifyMfa = async () => {
    const code = otpCode.value.join('')
    if (code.length !== 6) return

    isVerifying.value = true
    const result = await authStore.verifyMfa(code)
    isVerifying.value = false

    if (result.success) {
        if (result.status === 'PASSWORD_CHANGE_REQUIRED') {
            showVerifyModal.value = false
            showForcePasswordChangeModal.value = true
        } else {
            showVerifyModal.value = false
            const redirectPath = route.query.redirect || '/'
            router.push(redirectPath)
        }
    } else {
        otpCode.value = new Array(6).fill('')
        otpInputs.value[0]?.focus()
    }
}

const startForcedSetup = async () => {
    showSetupModal.value = true
    const deviceName = `device-${Date.now()}`
    const result = await authStore.createTotpDevice(deviceName)

    if (result.success) {
        setupData.value = result
        qrCodeUrl.value = await QRCode.toDataURL(result.qrCode)
    }
}

const completeSetup = async () => {
    if (!setupData.value) return

    isVerifying.value = true
    const result = await authStore.verifyTotpDevice(setupData.value.deviceName, setupVerifyCode.value)
    isVerifying.value = false

    if (result.success) {
        if (result.status === 'PASSWORD_CHANGE_REQUIRED') {
            showSetupModal.value = false
            showForcePasswordChangeModal.value = true
        } else {
            showSetupModal.value = false
            const redirectPath = route.query.redirect || '/'
            router.push(redirectPath)
        }
    } else {
        setupVerifyCode.value = ''
    }
}

// --- Forgot Password ---
const handleForgotPassword = async () => {
    if (!forgotEmail.value) return;

    isSendingReset.value = true;
    const success = await authStore.sendPasswordResetEmail(forgotEmail.value);
    isSendingReset.value = false;

    if (success) {
        showForgotModal.value = false;
        forgotEmail.value = '';
    }
}

// --- Helpers ---
const handleOtpInput = (e, index) => {
    const val = e.target.value
    if (val && index < 5) otpInputs.value[index + 1]?.focus()
}

const handleOtpBackspace = (e, index) => {
    if (!otpCode.value[index] && index > 0) otpInputs.value[index - 1]?.focus()
}

const handlePaste = (e) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').slice(0, 6).split('')
    text.forEach((char, i) => { if (i < 6) otpCode.value[i] = char })
    if (text.length === 6) {
        otpInputs.value[5]?.focus()
        verifyMfa()
    }
}

const changeLanguage = (event) => {
    const lang = event.target.value
    locale.value = lang
    localStorage.setItem('lang', lang)
}
</script>