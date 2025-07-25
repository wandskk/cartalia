<template>
  <StatsGrid 
    :stats="dashboardStats"
    margin-bottom="mb-0"
    min-column-width="280px"
    gap="ga-6"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import StatsGrid from '../../common/StatsGrid.vue';

interface Props {
  totalCards: number;
  totalTrades: number;
  activeTrades: number;
  uniqueCards: number;
}

const props = defineProps<Props>();

const dashboardStats = computed(() => [
  {
    number: props.totalCards,
    label: 'Total de Cartas',
    icon: '🃏',
    variant: 'default' as const
  },
  {
    number: props.totalTrades,
    label: 'Trocas Criadas',
    icon: '📊',
    variant: 'default' as const
  },
  {
    number: props.activeTrades,
    label: 'Trocas Ativas',
    icon: '🔄',
    variant: 'default' as const
  },
  {
    number: props.uniqueCards,
    label: 'Cartas Únicas',
    icon: '⭐',
    variant: 'default' as const
  }
]);
</script> 
