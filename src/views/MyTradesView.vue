<template>
  <div class="my-trades-view">
    <Container>
      <PageHeader
        title="Minhas Trocas"
        subtitle="Gerencie suas solicitações de troca e crie novas propostas"
      >
        <template #actions>
          <v-btn
            @click="showCreateModal = true"
            color="primary"
            variant="elevated"
            class="d-flex align-center ga-2"
          >
            <v-icon>mdi-plus</v-icon>
            Nova Troca
          </v-btn>
        </template>
      </PageHeader>

      <TradeStats :trades="userTrades" />

      <v-card class="trades-section" elevation="2">
        <v-card-text class="pa-6">
          <TradeFilters v-model="filters" @filter="handleFiltersChange" />

          <div class="trades-content">
            <MyTradeList
              :trades="filteredTrades"
              :loading="loading"
              :error="error"
              :view-mode="viewMode"
              @retry="fetchUserTrades"
              @delete="handleDeleteTrade"
              @edit="handleEditTrade"
            />
          </div>
        </v-card-text>
      </v-card>
    </Container>

    <!-- Modal de Criação de Troca -->
    <CreateTradeModal
      v-model="showCreateModal"
      @trade-created="handleTradeCreated"
    />

    <!-- Modal de Confirmação de Exclusão -->
    <DeleteConfirmationModal
      v-model="showDeleteModal"
      :loading="loading"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useTradesStore } from "../stores/trades";
import { useAuthStore } from "../stores/auth";
import { useNotificationStore } from "../stores/notification";
import { useTradeFilters } from "../composables/useTradeFilters";
import Container from "../components/common/Container.vue";
import PageHeader from "../components/common/PageHeader.vue";
import MyTradeList from "../components/features/trades/MyTradeList.vue";
import CreateTradeModal from "../components/features/trades/CreateTradeModal.vue";
import TradeStats from "../components/features/trades/TradeStats.vue";
import TradeFilters from "../components/features/trades/TradeFilters.vue";
import DeleteConfirmationModal from "../components/features/trades/DeleteConfirmationModal.vue";
import type { Trade } from "../types";

const router = useRouter();
const tradesStore = useTradesStore();
const authStore = useAuthStore();
const notification = useNotificationStore();

const loading = computed(() => tradesStore.loading);
const error = computed(() => tradesStore.error);
const userTrades = computed(() => tradesStore.userTrades);

const viewMode = ref<"grid" | "list">("grid");
const showCreateModal = ref(false);
const showDeleteModal = ref(false);
const tradeToDelete = ref<Trade | null>(null);

const filters = ref({
  searchTerm: "",
});

const { filteredTrades, updateFilters } = useTradeFilters(userTrades);

function handleFiltersChange(newFilters: { searchTerm: string }) {
  updateFilters(newFilters);
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    fetchUserTrades();
  } else {
    router.push("/login");
  }
});

async function fetchUserTrades() {
  await tradesStore.fetchAllTrades();
}

async function handleDeleteTrade(trade: Trade) {
  tradeToDelete.value = trade;
  showDeleteModal.value = true;
}

async function confirmDelete() {
  if (!tradeToDelete.value) return;

  try {
    await tradesStore.deleteTrade(tradeToDelete.value.id);
    notification.show("Troca excluída com sucesso!", "success");
    showDeleteModal.value = false;
    tradeToDelete.value = null;
  } catch (err: any) {
    notification.show(err.message || "Erro ao excluir troca", "error");
  }
}

function handleEditTrade() {
  notification.show("Funcionalidade de edição em desenvolvimento", "info");
}

function handleTradeCreated() {
  showCreateModal.value = false;
  notification.show("Troca criada com sucesso!", "success");
  fetchUserTrades();
}
</script>

<style scoped>
.my-trades-view {
  min-height: 100vh;
  background: linear-gradient(135deg, rgb(var(--v-theme-grey-lighten-5)) 0%, white 100%);
}

.trades-section {
  border-radius: 16px;
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}
</style>
