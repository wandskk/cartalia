<template>
  <div class="mb-6">
    <div class="search-section">
      <SearchInput
        v-model="filters.search"
        placeholder="Buscar por nome de carta ou usuário..."
        @input="handleSearch"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import SearchInput from '../../common/SearchInput.vue';

interface Filters {
  search: string;
}

interface Emits {
  (e: 'filters-change', filters: Filters): void;
}

const emit = defineEmits<Emits>();

const filters = reactive<Filters>({
  search: ''
});

function handleSearch() {
  emit('filters-change', { ...filters });
}

watch(filters, (newFilters) => {
  emit('filters-change', newFilters);
}, { deep: true });
</script>

<style scoped>
.search-section {
  width: 100%;
}

@media (max-width: 768px) {
  .mb-6 {
    margin-bottom: 16px !important;
  }
  
  .search-section {
    max-width: 100%;
  }
}
</style> 