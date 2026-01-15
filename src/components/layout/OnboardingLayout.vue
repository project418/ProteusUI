<template>
    <div class="flex flex-col h-screen bg-main text-txt-main transition-colors duration-300 overflow-hidden">

        <AppHeader :showSidebarToggle="false" class="shrink-0 z-20 relative" />

        <div class="flex flex-1 overflow-hidden relative z-10">

            <aside class="hidden lg:flex w-5/12 flex-col justify-center p-12 border-r border-line bg-main relative overflow-hidden">

                <div class="relative z-10 max-w-sm mx-auto w-full">
                    <h2 class="text-4xl font-bold text-txt-main tracking-tight leading-[1.1] mb-6">
                        {{ $t('onboarding.simplifyManagement') }}
                    </h2>
                    <p class="text-sm text-txt-muted leading-relaxed mb-8">
                        {{ $t('onboarding.managementDescription') }}
                    </p>

                    <div class="flex gap-4 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                        <div class="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center bg-white/5">
                            <div class="w-3 h-3 bg-zinc-400 rounded-full"></div>
                        </div>
                        <div class="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center bg-white/5">
                            <div class="w-3 h-3 bg-zinc-400 rounded-sm"></div>
                        </div>
                        <div class="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center bg-white/5">
                            <div class="w-3 h-3 bg-zinc-400 rotate-45"></div>
                        </div>
                    </div>
                </div>
            </aside>

            <main class="flex-1 flex flex-col min-w-0 bg-main relative overflow-hidden">
                <div class="flex-1 w-full h-full relative">
                    <router-view v-slot="{ Component }">
                        <transition name="fade">
                            <component :is="Component" class="absolute inset-0 w-full h-full overflow-y-auto custom-scrollbar" />
                        </transition>
                    </router-view>
                </div>
            </main>

        </div>
    </div>
</template>

<script setup>
import AppHeader from './AppHeader.vue'
</script>
