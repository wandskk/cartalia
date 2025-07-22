<template>
  <div class="recent-activity">
    <div class="section-header">
      <h3>Atividades Recentes</h3>
      <BaseButton @click="viewAll" color="secondary" size="small">
        Ver Todas
      </BaseButton>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Carregando atividades...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p class="error-message">{{ error }}</p>
      <BaseButton @click="retry" color="primary" size="small">
        Tentar novamente
      </BaseButton>
    </div>

    <div v-else-if="activities.length === 0" class="empty-state">
      <p>Nenhuma atividade recente.</p>
    </div>

    <div v-else class="activities-list">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="activity-item"
      >
        <div class="activity-icon">
          <span v-if="activity.type === 'trade_created'">🔄</span>
          <span v-else-if="activity.type === 'card_added'">🃏</span>
          <span v-else>📝</span>
        </div>

        <div class="activity-content">
          <p class="activity-text">{{ activity.description }}</p>
          <span class="activity-time">{{
            formatTime(activity.createdAt)
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import BaseButton from "../../common/BaseButton.vue";
import type { Trade } from "../../../types/trade";
import type { Card } from "../../../types/card";

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

  if (props.cards.length > 0) {
    const recentCards = props.cards.slice(0, 3);
    recentCards.forEach((card) => {
      activities.push({
        id: `card-${card.id}`,
        type: "card_added",
        description: `Adicionou "${card.name}" à coleção`,
        createdAt: card.createdAt,
      });
    });
  }

  return activities
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 8);
});

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) {
    return "Agora mesmo";
  } else if (diffInHours < 24) {
    return `Há ${diffInHours}h`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `Há ${diffInDays} dia${diffInDays !== 1 ? "s" : ""}`;
  }
}

function viewAll() {
  router.push("/my-trades");
}

function retry() {
  emit("retry");
}
</script>

<style scoped lang="scss">
@use "../../../styles/_variables.scss" as *;

.recent-activity {
  background: $white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      width: 100%;
      margin: 0;
      color: $black;
      font-size: 20px;
      font-weight: 600;
    }
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    color: $gray-600;

    .loading-spinner {
      width: 32px;
      height: 32px;
      border: 3px solid $gray-200;
      border-top: 3px solid $primary;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 12px;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }

  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    text-align: center;

    .error-message {
      color: $error;
      margin-bottom: 12px;
      font-size: 14px;
    }
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    color: $gray-500;
    font-size: 14px;
  }

  .activities-list {
    .activity-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid $gray-100;

      &:last-child {
        border-bottom: none;
      }

      .activity-icon {
        width: 36px;
        height: 36px;
        background: $gray-100;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        flex-shrink: 0;
      }

      .activity-content {
        flex: 1;
        min-width: 0;

        .activity-text {
          margin: 0 0 4px 0;
          color: $black;
          font-size: 14px;
          line-height: 1.4;
        }

        .activity-time {
          font-size: 12px;
          color: $gray-500;
        }
      }
    }
  }
}
</style>
