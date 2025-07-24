<template>
  <div class="cards-filters">
    <div class="search-filters">
      <div class="search-box">
        <input 
          :value="searchQuery" 
          @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
          type="text" 
          placeholder="Buscar cartas..."
          class="search-input"
        />
        <span class="search-icon">🔍</span>
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
    <div class="view-toggle">
      <button 
        v-for="view in viewModes"
        :key="view.value"
        @click="$emit('update:viewMode', view.value)" 
        :class="['view-btn', { active: viewMode === view.value }]"
        :title="view.title"
      >
        {{ view.icon }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
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

      .search-input {
        width: 100%;
        padding: 12px 16px 12px 44px;
        border: 2px solid $gray-200;
        border-radius: 12px;
        font-size: 14px;
        background: $white;
        transition: all 0.3s ease;

        &:focus {
          outline: none;
          border-color: $primary;
          box-shadow: 0 0 0 3px rgba($primary, 0.1);
        }

        &::placeholder {
          color: $gray-500;
        }
      }

      .search-icon {
        position: absolute;
        left: 16px;
        top: 50%;
        transform: translateY(-50%);
        color: $gray-500;
        font-size: 16px;
      }
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

  .view-toggle {
    display: flex;
    gap: 4px;
    background: $gray-100;
    border-radius: 8px;
    padding: 4px;

    .view-btn {
      padding: 8px 12px;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: $gray-600;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: $white;
        color: $gray-800;
      }

      &.active {
        background: $white;
        color: $primary;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

    .view-toggle {
      align-self: center;
    }
  }
}
</style> 