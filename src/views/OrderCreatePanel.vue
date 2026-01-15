<template>
  <div class="flex flex-col h-full bg-card overflow-hidden">
    <header class="px-6 py-4 border-b border-line flex items-center justify-between bg-side/20 shrink-0">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-txt-main/10 flex items-center justify-center text-txt-main shadow-sm">
          <Package class="w-4 h-4" />
        </div>
        <div>
          <h2 class="text-[13px] font-bold text-txt-main uppercase tracking-tight">{{ $t('orders.newOrder') }}</h2>
          <p class="text-[10px] text-txt-muted font-bold tracking-widest uppercase">{{ $t('orders.fillForm') }}</p>
        </div>
      </div>
      <button @click="$emit('close')" class="p-2 hover:bg-main rounded-lg transition-colors">
        <X class="w-4 h-4 text-txt-muted" />
      </button>
    </header>

    <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
      <div class="space-y-6 animate-in slide-in-from-right-4 duration-300">
        <div class="grid grid-cols-2 gap-x-6 gap-y-5">
          <div v-for="field in formSchema" :key="field.key" :class="field.fullWidth ? 'col-span-2' : ''">

            <AppInput v-if="field.type === 'text'" v-model="newOrder[field.key]" :label="field.label" :placeholder="`${field.label} giriniz...`" :error="errors[field.key]" />

            <AppSelect v-else-if="field.type === 'select'" v-model="newOrder[field.key]" :label="field.label" :options="field.options.map(opt => ({ label: opt, value: opt }))" :error="errors[field.key]" />

            <AppCurrencyInput v-else-if="field.type === 'currency'" v-model="newOrder[field.key]" :label="field.label" currencySymbol="$" :error="errors[field.key]" />

            <div v-else-if="field.type === 'textarea'" class="space-y-1.5">
              <label class="text-[10px] font-bold text-txt-muted uppercase tracking-widest ml-1">{{ field.label }}</label>
              <textarea v-model="newOrder[field.key]" rows="4" class="w-full bg-card border border-line rounded-lg px-4 py-3 text-[13px] text-txt-main focus:outline-none focus:ring-2 ring-txt-main/5 focus:border-txt-main/30 transition-all" :class="[errors[field.key] ? 'border-rose-500' : 'border-line']" placeholder="İsteğe bağlı notlar..."></textarea>
              <p v-if="errors[field.key]" class="text-[10px] text-rose-500 font-bold ml-1 uppercase">{{ errors[field.key] }}</p>
            </div>
          </div>
        </div>

        <div class="pt-6 border-t border-line">
          <h3 class="text-[11px] font-bold text-txt-main uppercase mb-4 tracking-wider">{{ $t('orders.orderItems') }}</h3>
          <button class="w-full py-3 border-2 border-dashed border-line rounded-xl text-[11px] font-bold text-txt-muted hover:border-txt-main/30 hover:text-txt-main hover:bg-side/20 transition-all flex items-center justify-center gap-2 group">
            <Plus class="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            {{ $t('orders.addProduct') }}
          </button>
        </div>
      </div>
    </div>

    <footer class="p-6 border-t border-line bg-side/5 flex items-center gap-3 shrink-0">
      <button @click="handleCreate" class="flex-1 bg-txt-main text-main py-2.5 rounded-lg text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm">
        {{ $t('orders.saveOrder') }}
      </button>
      <button @click="$emit('close')" class="px-6 py-2.5 border border-line rounded-lg text-xs font-bold text-txt-main hover:bg-side transition-all">
        {{ $t('common.cancel') }}
      </button>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { Package, X, Plus } from 'lucide-vue-next';
import AppInput from '@/components/forms/AppInput.vue';
import AppSelect from '@/components/forms/AppSelect.vue';
import AppCurrencyInput from '@/components/forms/AppCurrencyInput.vue';
import { useI18n } from 'vue-i18n';

const emit = defineEmits(['create', 'close']);
const { t: $t } = useI18n();

const newOrder = ref({
  customer: '',
  status: 'Pending',
  price: '',
  payment: '',
  notes: '',
  items: []
});

const errors = reactive({});

const formSchema = [
  { label: $t('orders.customerName'), key: 'customer', type: 'text' },
  { label: $t('orders.status'), key: 'status', type: 'select', options: ['Completed', 'Pending', 'Canceled'] },
  { label: $t('orders.payment'), key: 'payment', type: 'select', options: [$t('orders.paymentTypes.creditCard'), $t('orders.paymentTypes.bankTransfer'), $t('orders.paymentTypes.cash')] },
  { label: $t('orders.totalAmount'), key: 'price', type: 'currency' },
  { label: $t('orders.orderNotes'), key: 'notes', type: 'textarea', fullWidth: true },
];

const handleCreate = () => {
  errors.customer = !newOrder.value.customer ? $t('forms.validation.customerRequired') : '';
  errors.price = !newOrder.value.price ? $t('forms.validation.amountRequired') : '';

  if (Object.values(errors).some(e => e)) return;

  const orderData = {
    ...newOrder.value,
    id: '#ORD-' + Math.floor(1000 + Math.random() * 9000),
    date: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })
  };

  emit('create', orderData);
};
</script>