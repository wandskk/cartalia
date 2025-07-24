<template>
  <div class="trade-stats">
    <div class="stats-grid">
      <StatCard
        :number="totalTrades"
        label="Total de Trocas"
        icon="📊"
      />
      
      <StatCard
        :number="activeTrades"
        label="Trocas Ativas"
        icon="🔄"
      />

      <StatCard
        :number="thisMonthTrades"
        label="Este Mês"
        icon="📈"
      />

      <StatCard
        :number="`${successRate}%`"
        label="Taxa de Sucesso"
        icon="🎯"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import StatCard from '../../common/StatCard.vue';
import type { Trade } from '../../../types';

interface Props {
  trades: Trade[];
}

const props = defineProps<Props>();

const totalTrades = computed(() => props.trades.length);

const activeTrades = computed(() => {
  return props.trades.length;
});

const thisMonthTrades = computed(() => {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  
  return props.trades.filter(trade => {
    const tradeDate = new Date(trade.createdAt);
    return tradeDate.getMonth() === thisMonth && tradeDate.getFullYear() === thisYear;
  }).length;
});

const successRate = computed(() => {
  if (totalTrades.value === 0) return 0;
  return Math.round((activeTrades.value / totalTrades.value) * 100);
});
</script>

<style scoped lang="scss">
@use '../../../styles/_variables.scss' as *;

.trade-stats {
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 32px;

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
  }
}
</style> 