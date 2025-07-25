<template>
  <div class="recent-activity">
    <div class="d-flex justify-space-between align-center mb-6">
      <h3 class="text-h6 font-weight-bold">Atividades Recentes</h3>
      <v-btn @click="viewAll" color="secondary" size="small" variant="outlined">
        Ver Todas
      </v-btn>
    </div>

    <div v-if="loading" class="d-flex flex-column align-center justify-center py-10 text-grey">
      <LoadingSpinner text="Carregando atividades..." />
    </div>

    <div v-else-if="error" class="d-flex flex-column align-center justify-center py-10 text-center">
      <v-icon size="48" color="error" class="mb-4">mdi-alert-circle</v-icon>
      <p class="text-error text-body-1 mb-4">{{ error }}</p>
      <v-btn @click="retry" color="primary" size="small" variant="elevated">
        Tentar novamente
      </v-btn>
    </div>

    <div v-else-if="activities.length === 0" class="d-flex flex-column align-center justify-center py-10 text-center">
      <v-icon size="48" color="grey-lighten-1" class="mb-4">mdi-clock-outline</v-icon>
      <p class="text-body-1 text-grey">Nenhuma atividade recente.</p>
    </div>

    <div v-else class="activities-list">
      <v-card
        v-for="activity in activities"
        :key="activity.id"
        class="activity-item d-flex align-center pa-4 mb-3"
        elevation="1"
      >
        <v-avatar size="40" color="grey-lighten-4" class="mr-4">
          <v-icon v-if="activity.type === 'trade_created'" color="primary">mdi-swap-horizontal</v-icon>
          <v-icon v-else-if="activity.type === 'card_added'" color="success">mdi-cards</v-icon>
          <v-icon v-else color="grey">mdi-information</v-icon>
        </v-avatar>

        <div class="flex-grow-1">
          <p class="text-body-2 font-weight-medium mb-1">{{ activity.description }}</p>
          <span class="text-caption text-grey">{{ formatTime(activity.createdAt) }}</span>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import LoadingSpinner from "../../common/LoadingSpinner.vue";
import type { Trade } from '../../../types';
import type { Card } from '../../../types';

interface Activity {
  id: string;
  type: "trade_created" | "card_added";
  description: string;
  createdAt: string;
}

interface Props {
  trades: Trade[];
  cards: Card[];
  loading?: boolean;
  error?: string | null;
}

interface Emits {
  (e: "retry"): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
});

const emit = defineEmits<Emits>();
const router = useRouter();

const activities = computed(() => {
  const activities: Activity[] = [];

  props.trades.slice(0, 5).forEach((trade) => {
    const offeringCount = trade.tradeCards.filter(
      (tc) => tc.type === "OFFERING"
    ).length;
    const receivingCount = trade.tradeCards.filter(
      (tc) => tc.type === "RECEIVING"
    ).length;

    activities.push({
      id: `trade-${trade.id}`,
      type: "trade_created",
      description: `Criou uma troca oferecendo ${offeringCount} carta${
        offeringCount !== 1 ? "s" : ""
      } por ${receivingCount} carta${receivingCount !== 1 ? "s" : ""}`,
      createdAt: trade.createdAt,
    });
  });

  props.cards.slice(0, 5).forEach((card) => {
    activities.push({
      id: `card-${card.id}`,
      type: "card_added",
      description: `Adicionou "${card.name}" à coleção`,
      createdAt: card.createdAt,
    });
  });

  return activities
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
});

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return "Agora mesmo";
  if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h atrás`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d atrás`;
  
  return date.toLocaleDateString("pt-BR");
}

function viewAll() {
  router.push("/my-trades");
}

function retry() {
  emit("retry");
}
</script>

<style scoped>
.activities-list {
  max-height: 400px;
  overflow-y: auto;
}

.activity-item {
  transition: all 0.3s ease;
}

.activity-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}
</style>
