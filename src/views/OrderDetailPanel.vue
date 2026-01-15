<template>
  <div class="flex flex-col h-full bg-card overflow-hidden">
    <header class="px-6 py-4 border-b border-line flex items-center justify-between bg-side/20 shrink-0">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-txt-main/10 flex items-center justify-center text-txt-main shadow-sm">
          <Package class="w-4 h-4" />
        </div>
        <div>
          <h2 class="text-[13px] font-bold text-txt-main uppercase tracking-tight">{{ $t('orders.management') }}</h2>
          <p class="text-[10px] text-txt-muted font-bold tracking-widest uppercase">{{ order.id }}</p>
        </div>
      </div>
      <button @click="$emit('close')" class="p-2 hover:bg-main rounded-lg transition-colors">
        <X class="w-4 h-4 text-txt-muted" />
      </button>
    </header>

    <nav class="flex px-6 border-b border-line bg-side/5 gap-6 shrink-0">
      <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" class="py-3 text-[11px] font-bold uppercase tracking-wider transition-all border-b-2 relative -bottom-[1px]" :class="activeTab === tab.id ? 'border-txt-main text-txt-main' : 'border-transparent text-txt-muted hover:text-txt-main'">
        {{ tab.label }}
      </button>
    </nav>

    <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
      <div v-if="activeTab === 'general'" class="space-y-6 animate-in fade-in duration-300">
        <div class="grid grid-cols-2 gap-x-6 gap-y-5">
          <div v-for="field in formSchema" :key="field.key" :class="field.fullWidth ? 'col-span-2' : ''">

            <AppInput v-if="field.type === 'text'" v-model="localOrder[field.key]" :label="field.label" />

            <AppSelect v-else-if="field.type === 'select'" v-model="localOrder[field.key]" :label="field.label" :options="field.options.map(opt => ({ label: opt, value: opt }))" />

            <AppCurrencyInput v-else-if="field.type === 'currency'" v-model="localOrder[field.key]" :label="field.label" currencySymbol="$" />

            <div v-else-if="field.type === 'textarea'" class="space-y-1.5">
              <label class="text-[10px] font-bold text-txt-muted uppercase tracking-widest ml-1">{{ field.label }}</label>
              <textarea v-model="localOrder[field.key]" rows="4" class="w-full bg-card border border-line rounded-lg px-4 py-3 text-[13px] text-txt-main focus:outline-none focus:ring-2 ring-txt-main/5 focus:border-txt-main/30 transition-all"></textarea>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'items'" class="animate-in fade-in duration-300">
        <div class="border border-line rounded-xl overflow-hidden bg-main/50">
          <table class="w-full text-left text-[13px]">
            <thead class="bg-side/40 text-[10px] font-bold text-txt-muted uppercase border-b border-line">
              <tr>
                <th class="px-4 py-3">{{ $t('orders.productDescription') }}</th>
                <th class="px-4 py-3 text-center">{{ $t('orders.quantity') }}</th>
                <th class="px-4 py-3 text-right">{{ $t('orders.unitPrice') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-line/30">
              <tr v-for="item in localOrder.items" :key="item.name" class="hover:bg-side/20 transition-colors">
                <td class="px-4 py-3 text-txt-main font-medium">{{ item.name }}</td>
                <td class="px-4 py-3 text-center text-txt-muted tabular-nums">{{ item.qty }}</td>
                <td class="px-4 py-3 text-right text-txt-main font-bold tabular-nums">${{ item.price }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <footer class="p-6 border-t border-line bg-side/5 flex items-center gap-3 shrink-0">
      <button @click="$emit('save', localOrder)" class="flex-1 bg-txt-main text-main py-2.5 rounded-lg text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm">
        {{ $t('orders.saveChanges') }}
      </button>
      <button @click="$emit('close')" class="px-6 py-2.5 border border-line rounded-lg text-xs font-bold text-txt-main hover:bg-side transition-all">
        {{ $t('common.cancel') }}
      </button>
    </footer>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Package, X } from 'lucide-vue-next'
import AppInput from '@/components/forms/AppInput.vue'
import AppSelect from '@/components/forms/AppSelect.vue'
import AppCurrencyInput from '@/components/forms/AppCurrencyInput.vue'
import { useI18n } from 'vue-i18n'

const props = defineProps(['order'])
defineEmits(['save', 'close'])
const { t: $t } = useI18n()

const activeTab = ref('general')
const localOrder = ref({ ...props.order })

watch(() => props.order, (val) => {
  localOrder.value = JSON.parse(JSON.stringify(val))
}, { immediate: true })

const tabs = [
  { id: 'general', label: $t('orders.generalInfo') },
  { id: 'items', label: $t('orders.orderItems') }
]

const formSchema = [
  { label: $t('orders.customer'), key: 'customer', type: 'text' },
  { label: $t('orders.status'), key: 'status', type: 'select', options: ['Completed', 'Pending', 'Canceled'] },
  { label: $t('orders.payment'), key: 'payment', type: 'select', options: [$t('orders.paymentTypes.creditCard'), $t('orders.paymentTypes.bankTransfer'), $t('orders.paymentTypes.cash')] },
  { label: $t('orders.amount'), key: 'price', type: 'currency' },
  { label: $t('orders.internalNotes'), key: 'notes', type: 'textarea', fullWidth: true },
]
</script>