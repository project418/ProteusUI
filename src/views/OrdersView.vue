<template>
  <div class="h-full flex relative overflow-hidden bg-main">
    <main class="flex-1 flex flex-col min-w-0 transition-all duration-300 p-4 lg:p-8">
      <div class=" flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8 gap-4 shrink-0">
        <div class="flex items-center gap-4">
          <h1 class="text-[11px] font-bold text-txt-main uppercase tracking-[0.2em] border-l-2 border-txt-main pl-3">
            {{ $t('orders.management') }}
          </h1>
          <span class="px-2 py-0.5 bg-side border border-line rounded text-[10px] font-bold text-txt-muted tabular-nums">
            {{ filteredOrders.length }} {{ $t('common.records').toUpperCase() }}
          </span>
        </div>

        <div class="flex items-center gap-3 w-full sm:w-auto">
          <div class="relative group flex-1 sm:flex-none">
            <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-txt-muted group-focus-within:text-txt-main transition-colors" />
            <input v-model="searchQuery" type="text" :placeholder="$t('common.quickSearch')" class="w-full sm:w-48 lg:w-64 bg-card border border-line rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none transition-all focus:border-txt-main/30" />
          </div>
          <button @click="toggleCreate" class="bg-txt-main text-main px-4 py-1.5 rounded-lg text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm">
            {{ $t('common.new') }}
          </button>
        </div>
      </div>

      <div class="flex-1 min-h-0">
        <AppDataTable :columns="orderColumns" :data="paginatedOrders" :loading="isLoading" :sort-key="sortKey" :sort-order="sortOrder" :current-page="currentPage" :total-pages="totalPages" :total-items="filteredOrders.length" @sort="handleSort" @page-change="currentPage = $event" @row-click="toggleEdit($event)">
          <template #cell-status="{ value }">
            <div class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 rounded-full" :class="statusConfig[value]?.dot || 'bg-gray-400'"></div>
              <span class="text-[11px] font-bold text-txt-main">{{ value }}</span>
            </div>
          </template>
          <template #cell-price="{ value }">
            <span class="text-[13px] font-bold text-txt-main tabular-nums">${{ value }}</span>
          </template>
        </AppDataTable>
      </div>
    </main>

    <aside class="fixed top-0 right-0 h-full w-full lg:w-[600px] border-l border-line bg-card z-40 transition-transform duration-300 ease-in-out shadow-2xl" :class="isCreating || selectedOrder ? 'translate-x-0' : 'translate-x-full'">
      <OrderCreatePanel v-if="isCreating" @create="handleAddNewOrder" @close="isCreating = false" />
      <OrderDetailPanel v-if="selectedOrder" :order="selectedOrder" @save="handleSave" @close="selectedOrder = null" />
    </aside>

    <div v-if="selectedOrder || isCreating" @click="closePanels" class="fixed inset-0 bg-main/40 backdrop-blur-sm z-30"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Search } from 'lucide-vue-next'
import AppDataTable from '@/components/ui/AppDataTable.vue'
import OrderCreatePanel from './OrderCreatePanel.vue'
import OrderDetailPanel from './OrderDetailPanel.vue'
import { useToastStore } from '@/stores/toast'
import { useI18n } from 'vue-i18n'

const toast = useToastStore()
const { t: $t } = useI18n()
const isLoading = ref(true)
const selectedOrder = ref(null)
const searchQuery = ref('')
const isCreating = ref(false)
const currentPage = ref(1)
const itemsPerPage = 10
const sortKey = ref('id')
const sortOrder = ref('asc')

const orderColumns = [
  { label: $t('orders.orderId'), key: 'id', sortable: true },
  { label: $t('orders.customer'), key: 'customer', sortable: true },
  { label: $t('orders.date'), key: 'date', sortable: true },
  { label: $t('orders.amount'), key: 'price', sortable: true },
  { label: $t('orders.status'), key: 'status', sortable: false },
]

const statusConfig = {
  'Completed': { dot: 'bg-emerald-500' },
  'Pending': { dot: 'bg-amber-500' },
  'Canceled': { dot: 'bg-rose-500' },
}

const orders = ref([
  { id: '#9021', customer: 'John Akıncı', date: '02 Haz 2024', price: '2,400.00', status: 'Completed', items: [{ name: 'Macbook Air M2', qty: 1, price: '2400' }] },
  { id: '#8812', customer: 'Canan Işık', date: '01 Haz 2024', price: '980.50', status: 'Pending', items: [{ name: 'Magic Keyboard', qty: 2, price: '490' }] },
])

const filteredOrders = computed(() => {
  return orders.value.filter(o => o.customer.toLowerCase().includes(searchQuery.value.toLowerCase()) || o.id.includes(searchQuery.value))
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredOrders.value.length / itemsPerPage)))

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredOrders.value.slice(start, start + itemsPerPage);
})

const toggleCreate = () => {
  selectedOrder.value = null;
  isCreating.value = !isCreating.value;
}

const toggleEdit = (order) => {
  isCreating.value = false;
  selectedOrder.value = selectedOrder.value?.id === order.id ? null : order;
}

const closePanels = () => {
  isCreating.value = false;
  selectedOrder.value = null;
}

const handleAddNewOrder = (newRecord) => {
  orders.value.unshift(newRecord);
  isCreating.value = false;
  toast.add($t('toast.orderCreated'), 'success');
}

const handleSave = (updated) => {
  const idx = orders.value.findIndex(o => o.id === updated.id);
  if (idx !== -1) {
    orders.value[idx] = updated;
    toast.add($t('toast.orderUpdated'), 'success');
    selectedOrder.value = null;
  }
}

const handleSort = (key) => {
  sortKey.value = key;
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  orders.value.sort((a, b) => {
    let modifier = sortOrder.value === 'asc' ? 1 : -1;
    return a[key] > b[key] ? 1 * modifier : -1 * modifier;
  });
}

watch(searchQuery, () => { currentPage.value = 1 });

onMounted(() => {
  setTimeout(() => { isLoading.value = false }, 600);
})
</script>