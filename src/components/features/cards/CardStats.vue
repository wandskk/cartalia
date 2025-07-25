<template>
  <StatsGrid :stats="cardStats" min-column-width="200px" gap="ga-5" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { formatNumber } from "../../../utils/formatters";
import StatsGrid from "../../common/StatsGrid.vue";

interface Props {
  totalCards: number;
  recentCards: number;
}

const props = defineProps<Props>();

const cardStats = computed(() => [
  {
    number: formatNumber(props.totalCards),
    label: "Total de Cartas",
    icon: "mdi-cards",
    variant: "primary" as const,
  },
  {
    number: formatNumber(props.recentCards),
    label: "Adicionadas este mês",
    icon: "mdi-sync",
    variant: "secondary" as const,
  },
]);
</script>
