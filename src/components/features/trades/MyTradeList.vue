<template>
  <div class="my-trade-list">
    <div
      v-if="loading && trades.length === 0"
      class="d-flex flex-column align-center justify-center py-10 text-grey"
    >
      <LoadingSpinner text="Carregando suas trocas..." />
    </div>

    <div
      v-else-if="error && trades.length === 0"
      class="d-flex flex-column align-center justify-center py-10 text-center"
    >
      <v-icon size="48" color="error" class="mb-4">mdi-alert-circle</v-icon>
      <p class="text-error text-body-1 mb-4">{{ error }}</p>
      <v-btn @click="retry" color="primary" variant="elevated"
        >Tentar novamente</v-btn
      >
    </div>

    <div
      v-else-if="trades.length === 0"
      class="d-flex align-center justify-center py-10"
    >
      <div class="text-center max-width-400">
        <div class="mb-4 text-h1">
          <v-icon size="64" color="grey">mdi-cards</v-icon>
        </div>
        <h3 class="text-h5 font-weight-bold mb-4">Você ainda não tem trocas</h3>
        <p class="text-body-1 text-grey mb-6">
          Crie sua primeira troca para começar a negociar!
        </p>
        <v-btn
          color="primary"
          variant="elevated"
          class="d-flex align-center ga-2"
        >
          <v-icon>mdi-plus</v-icon>
          Criar Primeira Troca
        </v-btn>
      </div>
    </div>

    <div v-else class="trades-content">
      <div class="mb-4">
        <h3 class="text-h6 font-weight-bold text-grey-darken-2">
          {{ trades.length }} troca{{
            trades.length !== 1 ? "s" : ""
          }}
          encontrada{{ trades.length !== 1 ? "s" : "" }}
        </h3>
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
import TradeItem from "./TradeItem.vue";
import LoadingSpinner from "../../common/LoadingSpinner.vue";
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

<style scoped>
.trades-grid {
  display: grid;
  gap: 16px;
}

.trades-grid.view-grid {
  grid-template-columns: 1fr;
}
</style>
