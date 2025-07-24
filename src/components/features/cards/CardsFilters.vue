<template>
  <div class="cards-filters">
    <div class="search-filters">
      <div class="search-box">
        <SearchInput
          :model-value="searchQuery"
          placeholder="Buscar cartas..."
          @update:model-value="$emit('update:searchQuery', $event)"
        />
      </div>
      <div class="filter-buttons">
        <button 
          v-for="filter in filters"
          :key="filter.value"
          @click="$emit('update:currentFilter', filter.value)" 
          :class="['filter-btn', { active: currentFilter === filter.value }]"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>
    <ViewToggle 
      :model-value="viewMode" 
      :view-modes="viewModes" 
      @update:model-value="$emit('update:viewMode', $event)" 
    />
  </div>
</template>

<script setup lang="ts">
import ViewToggle from '../../common/ViewToggle.vue';
import SearchInput from '../../common/SearchInput.vue';

interface Filter {
  value: string;
  label: string;
}

interface ViewMode {
  value: 'grid' | 'list';
  icon: string;
  title: string;
}

interface Props {
  searchQuery: string;
  currentFilter: string;
  viewMode: 'grid' | 'list';
  filters?: Filter[];
  viewModes?: ViewMode[];
}

interface Emits {
  (e: 'update:searchQuery', value: string): void;
  (e: 'update:currentFilter', value: string): void;
  (e: 'update:viewMode', value: 'grid' | 'list'): void;
}

withDefaults(defineProps<Props>(), {
  filters: () => [
    { value: 'all', label: 'Todas' },
    { value: 'recent', label: 'Recentes' }
  ],
  viewModes: () => [
    { value: 'grid', icon: '⊞', title: 'Visualização em grade' },
    { value: 'list', icon: '☰', title: 'Visualização em lista' }
  ]
});

defineEmits<Emits>();
</script>

<style scoped lang="scss">
@use '../../../styles/_variables.scss' as *;

.cards-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;

  .search-filters {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
    min-width: 0;

    .search-box {
      position: relative;
      flex: 1;
      max-width: 300px;
    }

    .filter-buttons {
      display: flex;
      gap: 8px;

      .filter-btn {
        padding: 8px 16px;
        border: 2px solid $gray-200;
        border-radius: 8px;
        background: $white;
        color: $gray-700;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          border-color: $primary;
          color: $primary;
        }

        &.active {
          background: $primary;
          border-color: $primary;
          color: $white;
        }
      }
    }
  }



  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;

    .search-filters {
      flex-direction: column;
      align-items: stretch;

      .search-box {
        max-width: none;
      }

      .filter-buttons {
        justify-content: center;
      }
    }


  }
}
</style> 