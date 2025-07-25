<template>
  <div class="mb-6">
    <SearchWithPagination
      v-model:search-query="internalFilters.search"
      placeholder="Buscar por nome de carta ou usuário..."
      :disabled="loading"
      :show-pagination="showPagination"
      :total-items="totalItems"
      :items-per-page="itemsPerPage"
      :current-page="currentPage"
      :loading="loading"
      @page-change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, computed } from 'vue';
import SearchWithPagination from '../../common/SearchWithPagination.vue';

interface Filters {
  search: string;
}

interface Props {
  modelValue?: { searchTerm: string };
  loading?: boolean;
  showPagination?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
  currentPage?: number;
}

interface Emits {
  (e: 'update:modelValue', value: { searchTerm: string }): void;
  (e: 'filter', filters: { searchTerm: string }): void;
  (e: 'filters-change', filters: Filters): void;
  (e: 'page-change', page: number): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({ searchTerm: '' }),
  loading: false,
  showPagination: false,
  totalItems: 0,
  itemsPerPage: 12,
  currentPage: 1
});

const emit = defineEmits<Emits>();

const internalFilters = reactive<Filters>({
  search: ''
});

// Computed para converter entre as duas interfaces
const internalFiltersComputed = computed({
  get: () => {
    // Se modelValue está sendo usado (interface antiga)
    if (props.modelValue) {
      return { search: props.modelValue.searchTerm };
    }
    return internalFilters;
  },
  set: (value) => {
    internalFilters.search = value.search;
  }
});

function handleSearch() {
  const filters = { search: internalFilters.search };
  emit('filters-change', filters);
  
  // Emit para interface antiga
  emit('update:modelValue', { searchTerm: internalFilters.search });
  emit('filter', { searchTerm: internalFilters.search });
}

function handlePageChange(page: number) {
  emit('page-change', page);
}

// Watch para sincronizar mudanças
watch(() => props.modelValue?.searchTerm, (newValue) => {
  if (newValue !== undefined) {
    internalFilters.search = newValue;
  }
}, { immediate: true });

watch(internalFilters, (newFilters) => {
  emit('filters-change', { ...newFilters });
  
  // Emit para interface antiga
  emit('update:modelValue', { searchTerm: newFilters.search });
  emit('filter', { searchTerm: newFilters.search });
}, { deep: true });
</script>

<style scoped>
@media (max-width: 768px) {
  .mb-6 {
    margin-bottom: 16px !important;
  }
}
</style> 