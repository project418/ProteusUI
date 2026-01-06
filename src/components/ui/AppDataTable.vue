<template>
  <div class="w-full border border-line bg-card rounded-xl overflow-hidden shadow-none transition-all flex flex-col">
    <div class="overflow-x-auto relative">
      <table class="w-full text-left border-collapse border-spacing-0">
        <thead class="bg-side/40 border-b border-line">
          <tr>
            <th v-for="col in columns" :key="col.key" 
                @click="col.sortable && $emit('sort', col.key)"
                class="px-4 py-3 text-[10px] font-bold uppercase tracking-wider transition-all select-none group"
                :class="[
                  col.sortable ? 'cursor-pointer hover:bg-side/60' : '',
                  sortKey === col.key ? 'text-txt-main' : 'text-txt-muted'
                ]">
              <div class="flex items-center gap-2">
                {{ col.label }}
                
                <div v-if="col.sortable" class="flex items-center">
                  <template v-if="sortKey === col.key">
                    <ChevronUp v-if="sortOrder === 'asc'" class="w-3.5 h-3.5 text-txt-main" />
                    <ChevronDown v-else class="w-3.5 h-3.5 text-txt-main" />
                  </template>
                  <ArrowUpDown v-else class="w-3 h-3 opacity-20 group-hover:opacity-50" />
                </div>
              </div>
            </th>
          </tr>
        </thead>
        
        <tbody class="divide-y divide-line/40 relative min-h-[200px]">
          <tr v-if="loading">
            <td :colspan="columns.length + 1" class="py-20">
              <div class="flex flex-col items-center justify-center gap-3">
                <div class="w-6 h-6 border-2 border-txt-muted/20 border-t-txt-main rounded-full animate-spin"></div>
                <span class="text-[11px] font-bold text-txt-muted uppercase tracking-widest">{{ $t('common.loading') }}</span>
              </div>
            </td>
          </tr>

          <tr v-else-if="data.length === 0">
            <td :colspan="columns.length + 1" class="py-20">
              <div class="flex flex-col items-center justify-center gap-2 text-txt-muted">
                <Inbox class="w-8 h-8 opacity-20" />
                <span class="text-sm font-medium">{{ $t('common.noData') }}</span>
              </div>
            </td>
          </tr>

          <tr v-else v-for="(row, index) in data" :key="index"
              class="group hover:bg-side/50 transition-colors cursor-pointer"
              @click="$emit('row-click', row)">
            <td v-for="col in columns" :key="col.key" class="px-4 py-3.5 whitespace-nowrap">
              <slot :name="'cell-' + col.key" :value="row[col.key]" :row="row">
                <span class="text-[13px] text-txt-main font-medium leading-none">{{ row[col.key] }}</span>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="px-4 py-3 border-t border-line bg-side/20 flex items-center justify-between mt-auto">
      <div class="text-[11px] text-txt-muted font-bold uppercase tracking-tighter">
        {{ $t('common.total') }} {{ totalItems }} {{ $t('common.records') }}
      </div>
      <div class="flex items-center gap-1">
        <button 
          @click="$emit('page-change', currentPage - 1)"
          :disabled="currentPage === 1 || loading"
          class="p-1.5 border border-line rounded-md hover:bg-side disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft class="w-3.5 h-3.5" />
        </button>
        
        <div class="flex items-center px-2">
           <span class="text-[11px] font-bold text-txt-main tabular-nums">
             {{ $t('common.page') }} {{ currentPage }} / {{ totalPages }}
           </span>
        </div>

        <button 
          @click="$emit('page-change', currentPage + 1)"
          :disabled="currentPage === totalPages || loading"
          class="p-1.5 border border-line rounded-md hover:bg-side disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  ArrowUpDown, ChevronLeft, 
  ChevronRight, Inbox, ChevronUp, ChevronDown 
} from 'lucide-vue-next';

defineProps({
  columns: { type: Array, required: true },
  data: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  // Sıralama propları
  sortKey: { type: String, default: '' },
  sortOrder: { type: String, default: 'asc' },
  // Pagination propları
  currentPage: { type: Number, default: 1 },
  totalPages: { type: Number, default: 1 },
  totalItems: { type: Number, default: 0 }
});

defineEmits(['sort', 'row-click', 'page-change']);
</script>