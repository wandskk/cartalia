<template>
  <div class="cards-filters">
    <!-- Mobile Layout -->
    <div class="mobile-layout d-md-none">
      <!-- Search Bar - Full Width -->
      <div class="search-section mb-4">
        <SearchInput
          :model-value="searchQuery"
          placeholder="Buscar cartas..."
          @update:model-value="$emit('update:searchQuery', $event)"
        />
      </div>

      <!-- Expandable Filters Section -->
      <div class="expandable-filters">
        <div class="filters-header" @click="toggleFilters">
          <div class="filters-summary">
            <span class="filter-label">Filtros</span>
            <span class="filter-count">{{ getActiveFiltersCount() }}</span>
          </div>
          <v-icon 
            :icon="showFilters ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            class="expand-icon"
          />
        </div>

        <v-expand-transition>
          <div v-show="showFilters" class="filters-content">
            <!-- Filters Row -->
            <div class="filters-row mb-4">
              <div class="filter-buttons">
                <v-btn
                  v-for="filter in filters"
                  :key="filter.value"
                  @click="handleFilterClick(filter.value)"
                  :variant="currentFilter === filter.value ? 'elevated' : 'outlined'"
                  :color="currentFilter === filter.value ? 'primary' : 'grey'"
                  size="default"
                  class="filter-btn"
                  :class="{ 'active': currentFilter === filter.value }"
                >
                  {{ filter.label }}
                </v-btn>
              </div>
            </div>

            <!-- View Toggle - Centered -->
            <div class="view-toggle-section">
              <ViewToggle 
                :model-value="viewMode" 
                :view-modes="viewModes" 
                @update:model-value="$emit('update:viewMode', $event)" 
              />
            </div>
          </div>
        </v-expand-transition>
      </div>
    </div>

    <!-- Desktop Layout -->
    <div class="desktop-layout d-none d-md-flex justify-space-between align-center mb-6 flex-wrap ga-4">
      <div class="d-flex align-center ga-4 flex-grow-1 min-width-0">
        <div class="flex-grow-1">
          <SearchInput
            :model-value="searchQuery"
            placeholder="Buscar cartas..."
            @update:model-value="$emit('update:searchQuery', $event)"
          />
        </div>
        <div class="d-flex ga-2">
          <v-btn
            v-for="filter in filters"
            :key="filter.value"
            @click="$emit('update:currentFilter', filter.value)"
            :variant="currentFilter === filter.value ? 'elevated' : 'outlined'"
            :color="currentFilter === filter.value ? 'primary' : 'grey'"
            size="small"
          >
            {{ filter.label }}
          </v-btn>
        </div>
      </div>
      <ViewToggle 
        :model-value="viewMode" 
        :view-modes="viewModes" 
        @update:model-value="$emit('update:viewMode', $event)" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
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

const props = withDefaults(defineProps<Props>(), {
  filters: () => [
    { value: 'all', label: 'Todas' },
    { value: 'recent', label: 'Recentes' }
  ],
  viewModes: () => [
    { value: 'grid', icon: 'mdi-view-grid', title: 'Visualização em grade' },
    { value: 'list', icon: 'mdi-view-list', title: 'Visualização em lista' }
  ]
});

const emit = defineEmits<Emits>();

const showFilters = ref(false);

function toggleFilters() {
  showFilters.value = !showFilters.value;
}

function handleFilterClick(filterValue: string) {
  emit('update:currentFilter', filterValue);
  // Auto-collapse filters after selection on mobile
  setTimeout(() => {
    showFilters.value = false;
  }, 300);
}

function getActiveFiltersCount() {
  let count = 0;
  if (props.currentFilter !== 'all') count++;
  if (props.searchQuery) count++;
  return count;
}
</script>

<style scoped>
.cards-filters {
  margin-bottom: 1.5rem;
}

/* Mobile Layout Styles */
.mobile-layout {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-section {
  width: 100%;
}

.expandable-filters {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.filters-header:hover {
  background: rgba(0, 0, 0, 0.02);
}

.filters-summary {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-weight: 600;
  font-size: 1rem;
  color: rgba(0, 0, 0, 0.87);
}

.filter-count {
  background: var(--v-primary-base);
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

.expand-icon {
  transition: transform 0.2s ease;
  color: rgba(0, 0, 0, 0.6);
}

.filters-content {
  padding: 20px;
}

.filters-row {
  display: flex;
  justify-content: center;
  width: 100%;
}

.filter-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-btn {
  min-width: 80px;
  height: 44px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.filter-btn.active {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.view-toggle-section {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 16px;
}

/* Desktop Layout - Keep existing styles */
.desktop-layout {
  /* Existing desktop styles are preserved */
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .filters-header {
    padding: 14px 16px;
  }
  
  .filters-content {
    padding: 16px;
  }
  
  .filter-buttons {
    gap: 0.5rem;
  }
  
  .filter-btn {
    min-width: 70px;
    height: 40px;
    font-size: 0.875rem;
  }
}

@media (max-width: 360px) {
  .filters-header {
    padding: 12px 14px;
  }
  
  .filters-content {
    padding: 14px;
  }
  
  .filter-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .filter-btn {
    width: 100%;
    min-width: unset;
  }
}
</style> 