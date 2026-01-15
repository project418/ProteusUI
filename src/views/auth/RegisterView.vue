<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-main px-4 sm:px-6 py-12 transition-colors duration-300">
        <div class="w-full max-w-[400px] text-center mb-10">
            <div class="inline-flex items-center justify-center w-12 h-12 bg-card border border-line rounded-xl mb-4 shadow-sm">
                <div class="w-6 h-6 border-2 border-txt-main rounded-full opacity-90"></div>
            </div>
            <h1 class="text-2xl font-bold text-txt-main tracking-tight">{{ $t('auth.createAccount') }}</h1>
            <p class="text-sm text-txt-muted mt-2">
                {{ $t('auth.alreadyHaveAccount') }}
                <router-link to="/login" class="text-txt-main font-semibold hover:underline">
                    {{ $t('auth.register') }}
                </router-link>
            </p>
        </div>

        <div class="w-full max-w-[400px] space-y-6">
            <form @submit.prevent="handleRegister" class="space-y-4">

                <div class="grid grid-cols-2 gap-4">
                    <AppInput v-model="form.firstName" :label="$t('auth.firstName')" placeholder="John" :error="v$.firstName.$error ? $t('forms.validation.firstNameRequired') : ''" />
                    <AppInput v-model="form.lastName" :label="$t('auth.lastName')" placeholder="Doe" :error="v$.lastName.$error ? $t('forms.validation.lastNameRequired') : ''" />
                </div>

                <AppInput v-model="form.email" :label="$t('auth.emailAddress')" type="email" placeholder="name@company.com" :error="v$.email.$error ? $t('forms.validation.emailInvalid') : ''" />

                <div class="space-y-1.5">
                    <AppInput v-model="form.password" :label="$t('auth.password')" type="password" placeholder="••••••••" :error="v$.password.$error ? $t('forms.validation.passwordMin') : ''" />
                    <p class="text-[10px] text-txt-muted">En az 6 karakter, harf ve rakam içermeli.</p>
                </div>

                <AppInput v-model="form.confirmPassword" :label="$t('auth.confirmPassword')" type="password" placeholder="••••••••" :error="v$.confirmPassword.$error ? $t('forms.validation.passwordMismatch') : ''" />

                <div class="pt-2">
                    <button type="submit" :disabled="isLoading" class="w-full bg-txt-main text-main py-3 rounded-xl font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                        <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
                        <span>{{ isLoading ? $t('auth.registering') : $t('auth.registerFree') }}</span>
                    </button>
                </div>
            </form>

            <div class="relative py-4">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-line"></div>
                </div>
                <div class="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                    <span class="bg-main px-4 text-txt-muted">VEYA</span>
                </div>
            </div>

            <button class="w-full flex items-center justify-center gap-3 bg-card border border-line py-3 rounded-xl font-bold text-sm text-txt-main hover:bg-side transition-colors">
                <img src="https://www.svgrepo.com/show/355037/google.svg" class="w-4 h-4" />
                Google ile Devam Et
            </button>
        </div>

        <div class="fixed bottom-8 flex items-center gap-2">
            <button @click="themeStore.toggleTheme()" class="p-2 hover:bg-side rounded-lg text-txt-muted hover:text-txt-main cursor-pointer">
                <component :is="themeStore.isDark ? Sun : Moon" class="w-4 h-4" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { Loader2, Sun, Moon } from 'lucide-vue-next'
import useVuelidate from '@vuelidate/core'
import { required, email, minLength, sameAs } from '@vuelidate/validators'
import AppInput from '@/components/forms/AppInput.vue'

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const isLoading = ref(false)

const form = reactive({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
})

const rules = computed(() => ({
    firstName: { required },
    lastName: { required },
    email: { required, email },
    password: { required, minLength: minLength(6) },
    confirmPassword: { required, sameAs: sameAs(form.password) }
}))

const v$ = useVuelidate(rules, form)

const handleRegister = async () => {
    const isFormCorrect = await v$.value.$validate()
    if (!isFormCorrect) return

    isLoading.value = true

    const result = await authStore.register(form.email, form.password, form.firstName, form.lastName)

    isLoading.value = false

    if (result.success) {
        router.push('/')
    }
}
</script>