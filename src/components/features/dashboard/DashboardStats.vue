<template>
  <div class="dashboard-stats">
    <div class="stats-grid">
      <StatCard
        :number="totalCards"
        label="Total de Cartas"
        icon="🃏"
        variant="default"
      />

      <StatCard
        :number="totalTrades"
        label="Trocas Criadas"
        icon="📊"
        variant="default"
      />

      <StatCard
        :number="activeTrades"
        label="Trocas Ativas"
        icon="🔄"
        variant="default"
      />

      <StatCard
        :number="uniqueCards"
        label="Cartas Únicas"
        icon="⭐"
        variant="default"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import StatCard from '../../common/StatCard.vue';

interface Props {
  totalCards: number;
  totalTrades: number;
  activeTrades: number;
  uniqueCards: number;
}

defineProps<Props>();
</script>

<style scoped lang="scss">
@use '../../../styles/_variables.scss' as *;

.dashboard-stats {
  margin-bottom: 0;

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    width: 100%;

    @media (max-width: 1024px) {
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
    }

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
      gap: 0.875rem;
    }
  }
}
</style> 
