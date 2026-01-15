<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] lg:pt-[15vh] px-2 sm:px-6">
        <div class="fixed inset-0 bg-main/80 backdrop-blur-md" @click="close"></div>

        <div class="relative w-full max-w-2xl bg-card border border-line shadow-2xl rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          <div class="flex items-center px-4 py-4 border-b border-line gap-3">
            <Search class="w-5 h-5 text-txt-muted" />
            <input ref="searchInput" v-model="query" type="text" :placeholder="$t('commandPalette.search')" class="flex-1 bg-transparent border-none outline-none text-base text-txt-main placeholder:text-txt-muted" @keydown.esc="close" @keydown.down="moveSelection(1)" @keydown.up="moveSelection(-1)" @keydown.enter="executeAction" />
            <div class="hidden sm:flex items-center gap-1 px-1.5 py-1 bg-side border border-line rounded text-[10px] font-bold text-txt-muted">
              <span>ESC</span>
            </div>
          </div>

          <div class="max-h-[50vh] lg:max-h-[400px] overflow-y-auto p-2 custom-scrollbar">
            <div v-for="group in filteredResults" :key="group.title">
              <h3 class="px-3 py-2 text-[10px] font-bold text-txt-muted uppercase tracking-[0.2em]">
                {{ group.title }}
              </h3>
              <div class="space-y-1">
                <button v-for="item in group.items" :key="item.id" @mouseenter="selectedIndex = item.globalIndex" @click="runAction(item)" class="w-full flex items-center gap-3 px-3 py-3 lg:py-2.5 rounded-xl transition-all text-left group" :class="selectedIndex === item.globalIndex ? 'bg-txt-main text-main' : 'hover:bg-side text-txt-main'">
                  <component :is="item.icon" class="w-5 h-5 lg:w-4 lg:h-4" :class="selectedIndex === item.globalIndex ? 'text-main' : 'text-txt-muted group-hover:text-txt-main'" />
                  <div class="flex-1">
                    <p class="text-[13px] font-bold leading-none">{{ item.name }}</p>
                    <p v-if="item.desc" class="text-[11px] mt-1.5 lg:mt-1 opacity-70">{{ item.desc }}</p>
                  </div>
                  <ChevronRight v-if="selectedIndex === item.globalIndex" class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div v-if="filteredResults.length === 0" class="py-12 text-center">
              <SearchX class="w-8 h-8 text-txt-muted mx-auto mb-3" />
              <p class="text-sm text-txt-muted">{{ $t('common.noResults') }}</p>
            </div>
          </div>

          <footer class="px-4 py-3 border-t border-line bg-side/20 flex items-center justify-between text-txt-muted">
            <div class="flex gap-4">
              <div class="flex items-center gap-1.5 uppercase font-bold text-[10px]">
                <kbd class="px-1.5 py-0.5 bg-card border border-line rounded">↓↑</kbd> {{ $t('common.navigate') }}
              </div>
            </div>
            <span class="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">{{ $t('commandPalette.proteusSearch') }}</span>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { Search, SearchX, ChevronRight, User, Package, Settings, LayoutDashboard } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const props = defineProps({ open: { type: Boolean, default: false } });
const emit = defineEmits(['update:open']);
const router = useRouter();
const { t: $t } = useI18n();
const query = ref('');
const selectedIndex = ref(0);
const searchInput = ref(null);

const staticActions = computed(() => [
  { id: 'dash', name: $t('commandPalette.controlPanel'), desc: $t('commandPalette.viewSystemSummary'), icon: LayoutDashboard, category: $t('commandPalette.navigation'), link: '/' },
  { id: 'ord', name: $t('commandPalette.orders'), desc: $t('commandPalette.manageAllOrders'), icon: Package, category: $t('commandPalette.navigation'), link: '/orders' },
  { id: 'prof', name: $t('commandPalette.profileSettings'), desc: $t('commandPalette.editAccount'), icon: User, category: $t('commandPalette.account'), link: '/profile' },
  { id: 'sett', name: $t('commandPalette.systemSettings'), desc: $t('commandPalette.configurePlatform'), icon: Settings, category: $t('commandPalette.account'), link: '/settings' },
]);

const filteredResults = computed(() => {
  const q = query.value.toLowerCase();
  const items = staticActions.value.filter(i => i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q));
  const groups = {};
  let counter = 0;
  items.forEach(item => {
    if (!groups[item.category]) groups[item.category] = [];
    item.globalIndex = counter++;
    groups[item.category].push(item);
  });
  return Object.keys(groups).map(title => ({ title, items: groups[title] }));
});

const maxIndex = computed(() => filteredResults.value.reduce((acc, group) => acc + group.items.length, 0) - 1);
const close = () => { emit('update:open', false); query.value = ''; };
const moveSelection = (dir) => {
  const next = selectedIndex.value + dir;
  if (next < 0) selectedIndex.value = maxIndex.value;
  else if (next > maxIndex.value) selectedIndex.value = 0;
  else selectedIndex.value = next;
};
const runAction = (item) => { if (item.link) router.push(item.link); close(); };
const executeAction = () => {
  const allItems = filteredResults.value.flatMap(g => g.items);
  const selected = allItems.find(i => i.globalIndex === selectedIndex.value);
  if (selected) runAction(selected);
};
const handleKeydown = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); emit('update:open', !props.open); } };
watch(() => props.open, (val) => { if (val) { selectedIndex.value = 0; nextTick(() => searchInput.value?.focus()); } });
onMounted(() => window.addEventListener('keydown', handleKeydown));
onUnmounted(() => window.removeEventListener('keydown', handleKeydown));
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>