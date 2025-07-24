<template>
  <div class="my-trade-list">
    <div v-if="loading && trades.length === 0" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Carregando suas trocas...</p>
    </div>

    <div v-else-if="error && trades.length === 0" class="error-state">
      <div class="error-icon">⚠️</div>
      <p class="error-message">{{ error }}</p>
      <BaseButton @click="retry" color="primary">Tentar novamente</BaseButton>
    </div>

    <div v-else-if="trades.length === 0" class="empty-state">
      <div class="empty-content">
        <div class="empty-icon">🃏</div>
        <h3>Você ainda não tem trocas</h3>
        <p>Crie sua primeira troca para começar a negociar!</p>
        <BaseButton color="primary" class="create-btn">
          <span class="btn-icon">+</span>
          Criar Primeira Troca
        </BaseButton>
      </div>
    </div>

    <div v-else class="trades-content">
      <div class="trades-stats">
        <span class="stat">
          {{ trades.length }} troca{{ trades.length !== 1 ? "s" : "" }}
        </span>
      </div>

      <div :class="['trades-grid', `view-${viewMode}`]">
        <TradeItem
          v-for="trade in trades"
          :key="trade.id"
          :trade="trade"
          :show-actions="true"
          :show-status="true"
          status="active"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from "../../common/BaseButton.vue";
import TradeItem from "./TradeItem.vue";
import type { Trade } from "../../../types";

interface Props {
  trades: Trade[];
  loading?: boolean;
  error?: string | null;
  viewMode?: "grid" | "list";
}

interface Emits {
  (e: "retry"): void;
  (e: "delete", trade: Trade): void;
  (e: "edit", trade: Trade): void;
}

withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  viewMode: "grid",
});

const emit = defineEmits<Emits>();

function retry() {
  emit("retry");
}

function handleEdit(trade: Trade) {
  emit("edit", trade);
}

function handleDelete(trade: Trade) {
  emit("delete", trade);
}
</script>

<style scoped lang="scss">
@use "../../../styles/_variables.scss" as *;

.my-trade-list {
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    color: $gray-600;

    .loading-spinner {
      width: 48px;
      height: 48px;
      border: 4px solid $gray-200;
      border-top: 4px solid $primary;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
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
    padding: 80px 20px;
    text-align: center;

    .error-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .error-message {
      color: $error;
      margin-bottom: 16px;
      font-size: 16px;
    }
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;

    .empty-content {
      text-align: center;
      max-width: 400px;

      .empty-icon {
        font-size: 64px;
        margin-bottom: 16px;
      }

      h3 {
        margin: 0 0 16px 0;
        color: $black;
        font-size: 24px;
        font-weight: 600;
      }

      p {
        margin: 0 0 24px 0;
        color: $gray-600;
        font-size: 16px;
        line-height: 1.5;
      }

      .create-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 24px;
        font-weight: 600;
        border-radius: 12px;

        .btn-icon {
          font-size: 18px;
          font-weight: bold;
        }
      }
    }
  }

  .trades-content {
    .trades-stats {
      margin-bottom: 20px;

      .stat {
        font-size: 14px;
        color: $gray-600;
        font-weight: 500;
      }
    }

    .trades-grid {
      display: grid;
      gap: 20px;

      &.view-grid {
        grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));

        @media (max-width: 768px) {
          grid-template-columns: 1fr;
        }
      }

      &.view-list {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style>
