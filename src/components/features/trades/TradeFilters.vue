<template>
  <div class="trade-filters">
    <div class="filters-container">
      <div class="search-filter">
        <SearchInput
          v-model="searchTerm"
          placeholder="Buscar por nome da carta..."
          @search="handleSearch"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import SearchInput from '../../common/SearchInput.vue';

interface Props {
  modelValue?: {
    searchTerm: string;
  };
}

interface Emits {
  (e: 'update:modelValue', value: { searchTerm: string }): void;
  (e: 'filter', value: { searchTerm: string }): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({
    searchTerm: ''
  })
});

const emit = defineEmits<Emits>();

const searchTerm = ref(props.modelValue.searchTerm);

function emitValue() {
  const value = {
    searchTerm: searchTerm.value
  };
  emit('update:modelValue', value);
  emit('filter', value);
}

function handleSearch() {
  emitValue();
}

watch(() => props.modelValue, (newValue) => {
  searchTerm.value = newValue.searchTerm;
});
</script>

<style scoped lang="scss">
@use '../../../styles/_variables.scss' as *;

.trade-filters {
  .filters-container {
    display: flex;
    gap: 16px;
    flex: 1;
    flex-wrap: wrap;

    .search-filter {
      flex: 1;
      min-width: 250px;
    }
  }
}
</style> 