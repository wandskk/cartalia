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
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 1.5rem;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 1.25rem;
  }

  @media (max-width: 480px) {
    padding: 1.25rem;
    border-radius: 1rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    gap: 1rem;

    @media (max-width: 768px) {
      margin-bottom: 1.25rem;
      gap: 0.75rem;
    }

    @media (max-width: 480px) {
      margin-bottom: 1rem;
      gap: 0.5rem;
      flex-direction: column;
      align-items: flex-start;
    }

    h3 {
      margin: 0;
      color: #1e293b;
      font-size: 1.5rem;
      font-weight: 700;
      line-height: 1.3;
      width: 100%;

      @media (max-width: 768px) {
        font-size: 1.375rem;
      }

      @media (max-width: 480px) {
        font-size: 1.25rem;
      }
    }
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1.5rem;
    color: #64748b;

    @media (max-width: 768px) {
      padding: 2.5rem 1.25rem;
    }

    @media (max-width: 480px) {
      padding: 2rem 1rem;
    }

    .loading-spinner {
      width: 2.5rem;
      height: 2.5rem;
      border: 2px solid #e2e8f0;
      border-top: 2px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;

      @media (max-width: 480px) {
        width: 2rem;
        height: 2rem;
        margin-bottom: 0.75rem;
      }
    }

    p {
      font-size: 1rem;
      margin: 0;
      font-weight: 500;

      @media (max-width: 480px) {
        font-size: 0.9375rem;
      }
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
    padding: 3rem 1.5rem;
    text-align: center;

    @media (max-width: 768px) {
      padding: 2.5rem 1.25rem;
    }

    @media (max-width: 480px) {
      padding: 2rem 1rem;
    }

    .error-message {
      color: #ef4444;
      margin-bottom: 1rem;
      font-size: 1rem;
      line-height: 1.5;
      font-weight: 500;

      @media (max-width: 480px) {
        font-size: 0.9375rem;
        margin-bottom: 0.75rem;
      }
    }
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem 1.5rem;
    color: #94a3b8;
    font-size: 1rem;
    font-weight: 500;

    @media (max-width: 768px) {
      padding: 2.5rem 1.25rem;
      font-size: 0.9375rem;
    }

    @media (max-width: 480px) {
      padding: 2rem 1rem;
      font-size: 0.875rem;
    }

    p {
      margin: 0;
    }
  }

  .activities-list {
    .activity-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem 0;
      border-bottom: 1px solid rgba(226, 232, 240, 0.6);
      transition: all 0.2s ease;

      @media (max-width: 768px) {
        gap: 0.875rem;
        padding: 0.875rem 0;
      }

      @media (max-width: 480px) {
        gap: 0.75rem;
        padding: 0.75rem 0;
      }

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background: rgba(248, 250, 252, 0.5);
        margin: 0 -1rem;
        padding-left: 1rem;
        padding-right: 1rem;
        border-radius: 0.75rem;
      }

      .activity-icon {
        width: 2.5rem;
        height: 2.5rem;
        background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
        border-radius: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        flex-shrink: 0;
        border: 1px solid rgba(0, 0, 0, 0.05);

        @media (max-width: 768px) {
          width: 2.25rem;
          height: 2.25rem;
          font-size: 1.125rem;
          border-radius: 0.625rem;
        }

        @media (max-width: 480px) {
          width: 2rem;
          height: 2rem;
          font-size: 1rem;
          border-radius: 0.5rem;
        }
      }

      .activity-content {
        flex: 1;
        min-width: 0;

        .activity-text {
          margin: 0 0 0.375rem 0;
          color: #1e293b;
          font-size: 1rem;
          line-height: 1.5;
          font-weight: 500;

          @media (max-width: 768px) {
            font-size: 0.9375rem;
            margin-bottom: 0.25rem;
          }

          @media (max-width: 480px) {
            font-size: 0.875rem;
            margin-bottom: 0.125rem;
          }
        }

        .activity-time {
          font-size: 0.875rem;
          color: #94a3b8;
          line-height: 1.3;
          font-weight: 400;

          @media (max-width: 480px) {
            font-size: 0.8125rem;
          }
        }
      }
    }
  }
}
</style>
