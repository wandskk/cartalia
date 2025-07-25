<template>
  <div class="d-flex justify-space-between align-center mb-6 flex-wrap ga-4">
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
    { value: 'grid', icon: 'mdi-view-grid', title: 'Visualização em grade' },
    { value: 'list', icon: 'mdi-view-list', title: 'Visualização em lista' }
  ]
});

defineEmits<Emits>();
</script>

<style scoped>
@media (max-width: 768px) {
  .d-flex {
    flex-direction: column;
    align-items: stretch;
  }
  
  .d-flex .d-flex {
    flex-direction: column;
    align-items: stretch;
  }
  
  .d-flex .d-flex .flex-grow-1 {
    max-width: none !important;
  }
  
  .d-flex .d-flex .d-flex {
    justify-content: center;
  }
}
</style> 