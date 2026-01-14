<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-main px-4 sm:px-6 py-12 transition-colors duration-300">
        <div class="w-full max-w-[400px] text-center mb-10">
            <div class="inline-flex items-center justify-center w-12 h-12 bg-card border border-line rounded-xl mb-4 shadow-sm">
                <div class="w-6 h-6 border-2 border-txt-main rounded-full opacity-90"></div>
            </div>
            <h1 class="text-2xl font-bold text-txt-main tracking-tight">Yeni Şifre Belirle</h1>
            <p class="text-sm text-txt-muted mt-2">
                Lütfen hesabınız için yeni bir şifre giriniz.
            </p>
        </div>

        <div class="w-full max-w-[400px] space-y-6">
            <div v-if="!token" class="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-sm text-center font-medium">
                Hata: Geçersiz veya eksik sıfırlama bağlantısı.
            </div>

            <form v-else @submit.prevent="handleReset" class="space-y-4">
                <div class="space-y-1.5">
                    <AppInput v-model="password" label="Yeni Şifre" type="password" placeholder="••••••••" :error="v$.password.$error ? 'Şifre en az 6 karakter olmalıdır' : ''" />
                    <p class="text-[10px] text-txt-muted">En az 6 karakter, harf ve rakam içermeli.</p>
                </div>

                <AppInput v-model="confirmPassword" label="Yeni Şifre (Tekrar)" type="password" placeholder="••••••••" :error="v$.confirmPassword.$error ? 'Şifreler eşleşmiyor' : ''" />

                <button type="submit" :disabled="isLoading" class="w-full bg-txt-main text-main py-3 rounded-xl font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2">
                    <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
                    <span>{{ isLoading ? 'Güncelleniyor...' : 'Şifreyi Güncelle' }}</span>
                </button>
            </form>

            <div class="text-center">
                <router-link to="/login" class="text-xs font-bold text-txt-muted hover:text-txt-main transition-colors uppercase tracking-widest">
                    Giriş Sayfasına Dön
                </router-link>
            </div>
        </div>

        <div class="fixed bottom-8 flex items-center gap-2">
            <button @click="themeStore.toggleTheme()" class="p-2 hover:bg-side rounded-lg text-txt-muted hover:text-txt-main cursor-pointer">
                <component :is="themeStore.isDark ? Sun : Moon" class="w-4 h-4" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { Loader2, Sun, Moon } from 'lucide-vue-next'
import useVuelidate from '@vuelidate/core'
import { required, minLength, sameAs } from '@vuelidate/validators'
import AppInput from '@/components/forms/AppInput.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const isLoading = ref(false)
const password = ref('')
const confirmPassword = ref('')
const token = ref('')

onMounted(() => {
    token.value = route.query.token || ''
})

const rules = computed(() => ({
    password: { required, minLength: minLength(6) },
    confirmPassword: { required, sameAs: sameAs(password) }
}))

const v$ = useVuelidate(rules, { password, confirmPassword })

const handleReset = async () => {
    const isFormCorrect = await v$.value.$validate()
    if (!isFormCorrect) return

    isLoading.value = true
    const success = await authStore.resetPassword(token.value, password.value)
    isLoading.value = false

    if (success) {
        router.push('/login')
    }
}
</script>