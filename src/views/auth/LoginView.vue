<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-main px-4 sm:px-6 py-12">
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
            <div class="space-y-4">
                <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-txt-muted uppercase tracking-widest ml-1">{{ $t('auth.email') }}</label>
                    <input type="email" class="w-full bg-card border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ring-txt-main/5 focus:border-txt-main/20 transition-all text-txt-main" placeholder="name@company.com" />
                </div>

                <div class="space-y-1.5">
                    <div class="flex items-center justify-between px-1">
                        <label class="text-[10px] font-bold text-txt-muted uppercase tracking-widest">{{ $t('auth.password') }}</label>
                        <a href="#" class="text-[10px] font-bold text-txt-muted hover:text-txt-main transition-colors uppercase tracking-widest">
                            {{ $t('auth.forgotPassword') }}
                        </a>
                    </div>
                    <input type="password" class="w-full bg-card border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ring-txt-main/5 focus:border-txt-main/20 transition-all text-txt-main" placeholder="••••••••" />
                </div>
            </div>

            <button class="w-full bg-txt-main text-main py-3 rounded-xl font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-sm">
                {{ $t('auth.signIn') }}
            </button>

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
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { Sun, Moon } from 'lucide-vue-next';
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore()
const { locale } = useI18n()

const changeLanguage = (event) => {
    const lang = event.target.value
    locale.value = lang
    localStorage.setItem('lang', lang)
}
</script>