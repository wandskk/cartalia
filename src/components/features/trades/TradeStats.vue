<template>
  <StatsGrid 
    :stats="tradeStats"
    min-column-width="200px"
    gap="ga-5"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { numberFormatters } from '../../../utils/formatters';
import StatsGrid from '../../common/StatsGrid.vue';
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

const tradeStats = computed(() => [
  {
    number: numberFormatters.formatNumber(totalTrades.value),
    label: 'Total de Trocas',
    icon: 'mdi-chart-line',
    variant: 'default' as const
  },
  {
    number: numberFormatters.formatNumber(activeTrades.value),
    label: 'Trocas Ativas',
    icon: 'mdi-sync',
    variant: 'default' as const
  },
  {
    number: numberFormatters.formatNumber(thisMonthTrades.value),
    label: 'Este Mês',
    icon: 'mdi-trending-up',
    variant: 'default' as const
  },
  {
    number: numberFormatters.formatPercentage(successRate.value / 100),
    label: 'Taxa de Sucesso',
    icon: 'mdi-target',
    variant: 'default' as const
  }
]);
</script> 