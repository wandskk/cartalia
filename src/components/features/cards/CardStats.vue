<template>
  <StatsGrid :stats="cardStats" min-column-width="200px" gap="ga-5" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { numberFormatters } from "../../../utils/formatters";
import StatsGrid from "../../common/StatsGrid.vue";

interface Props {
  totalCards: number;
  recentCards: number;
}

const props = defineProps<Props>();

const cardStats = computed(() => [
  {
    number: numberFormatters.formatNumber(props.totalCards),
    label: "Total de Cartas",
    icon: "mdi-cards",
    variant: "primary" as const,
  },
  {
    number: numberFormatters.formatNumber(props.recentCards),
    label: "Adicionadas este mês",
    icon: "mdi-sync",
    variant: "secondary" as const,
  },
]);
</script>
