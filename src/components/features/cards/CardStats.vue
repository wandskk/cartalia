<template>
  <div class="card-stats">
    <div class="stats-grid">
      <StatCard
        :number="totalCards"
        label="Total de Cartas"
        icon="📊"
        variant="primary"
      />
      <StatCard
        :number="recentCards"
        label="Adicionadas este mês"
        icon="🔄"
        variant="secondary"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import StatCard from '../../common/StatCard.vue';

interface Props {
  totalCards: number;
  recentCards: number;
}

defineProps<Props>();
</script>

<style scoped lang="scss">
@use '../../../styles/_variables.scss' as *;

.card-stats {
  margin-bottom: 32px;

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }
}
</style> 