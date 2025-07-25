<template>
  <div class="d-flex align-center justify-space-between ga-4 search-pagination-container">
    <SearchInput
      :model-value="searchQuery"
      :placeholder="placeholder"
      :disabled="disabled"
      class="flex-grow-1"
      @update:model-value="handleSearchChange"
    />

    <SimplePagination
      v-if="showPagination"
      :total-items="totalItems"
      :items-per-page="itemsPerPage"
      :current-page="currentPage"
      :loading="loading"
      @page-change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SearchInput from './SearchInput.vue';
import SimplePagination from './SimplePagination.vue';

interface Props {
  searchQuery: string;
  placeholder?: string;
  disabled?: boolean;
  showPagination?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
  currentPage?: number;
  loading?: boolean;
}

interface Emits {
  (e: 'update:searchQuery', value: string): void;
  (e: 'page-change', page: number): void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Buscar...',
  disabled: false,
  showPagination: true,
  totalItems: 0,
  itemsPerPage: 12,
  currentPage: 1,
  loading: false
});

// Forçar reatividade com computed
const showPagination = computed(() => props.showPagination);
const totalItems = computed(() => props.totalItems);
const itemsPerPage = computed(() => props.itemsPerPage);
const currentPage = computed(() => props.currentPage);
const loading = computed(() => props.loading);

const emit = defineEmits<Emits>();

function handleSearchChange(value: string) {
  emit('update:searchQuery', value);
}

function handlePageChange(page: number) {
  emit('page-change', page);
}
</script>

<style scoped>
.search-pagination-container {
  margin-bottom: 24px;
}

@media (max-width: 768px) {
  .search-pagination-container {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
}
</style> 