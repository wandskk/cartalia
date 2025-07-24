<template>
  <div class="trade-filters">
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

<style scoped lang="scss">
@use '../../../styles/_variables.scss' as *;

.trade-filters {
  margin-bottom: 24px;

  .search-section {
    width: 100%;
    max-width: 400px;
  }
}

@media (max-width: 768px) {
  .trade-filters {
    margin-bottom: 16px;

    .search-section {
      max-width: 100%;
    }
  }
}
</style> 