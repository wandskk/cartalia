<template>
  <div :class="marginBottom">
    <div 
      class="stats-grid" 
      :class="gap"
      :style="gridStyle"
    >
      <StatCard
        v-for="stat in stats"
        :key="stat.label"
        :number="stat.number"
        :label="stat.label"
        :icon="stat.icon"
        :variant="stat.variant || 'default'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import StatCard from './StatCard.vue';

interface Stat {
  number: number | string;
  label: string;
  icon: string;
  variant?: 'default' | 'primary' | 'secondary';
}

interface Props {
  stats: Stat[];
  marginBottom?: string;
  minColumnWidth?: string;
  gap?: string;
}

const props = withDefaults(defineProps<Props>(), {
  marginBottom: 'mb-8',
  minColumnWidth: '280px',
  gap: 'ga-6'
});

const gridStyle = computed(() => ({
  'grid-template-columns': `repeat(auto-fit, minmax(${props.minColumnWidth}, 1fr))`
}));
</script>

<style scoped>
.stats-grid {
  display: grid;
  width: 100%;
}

.stats-grid.ga-6 {
  gap: 24px;
}

.stats-grid.ga-5 {
  gap: 20px;
}

.stats-grid.ga-4 {
  gap: 16px;
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)) !important;
    gap: 20px !important;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 16px !important;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr !important;
    gap: 16px !important;
  }
}
</style> 