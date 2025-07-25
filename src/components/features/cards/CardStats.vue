<template>
  <StatsGrid 
    :stats="cardStats"
    min-column-width="200px"
    gap="ga-5"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import StatsGrid from '../../common/StatsGrid.vue';

interface Props {
  totalCards: number;
  recentCards: number;
}

const props = defineProps<Props>();

const cardStats = computed(() => [
  {
    number: props.totalCards,
    label: 'Total de Cartas',
    icon: '📊',
    variant: 'primary' as const
  },
  {
    number: props.recentCards,
    label: 'Adicionadas este mês',
    icon: '🔄',
    variant: 'secondary' as const
  }
]);
</script> 