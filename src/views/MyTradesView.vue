<template>
  <div class="my-trades-view">
    <Container>
      <PageHeader
        title="Minhas Trocas"
        subtitle="Gerencie suas solicitações de troca e crie novas propostas"
      >
        <template #actions>
          <BaseButton
            @click="showCreateModal = true"
            color="primary"
            class="create-btn"
          >
            <span class="btn-icon">+</span>
            Nova Troca
          </BaseButton>
        </template>
      </PageHeader>

      <TradeStats :trades="userTrades" />

      <div class="trades-section">
        <div class="section-header">
          <TradeFilters v-model="filters" @filter="handleFiltersChange" />

        </div>

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
      </div>
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
import BaseButton from "../components/common/BaseButton.vue";
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

<style scoped lang="scss">
@use "../styles/_variables.scss" as *;

.my-trades-view {
  min-height: 100vh;
  background: linear-gradient(135deg, $gray-50 0%, $white 100%);

  .create-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    font-weight: 600;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba($primary, 0.3);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba($primary, 0.4);
    }

    .btn-icon {
      font-size: 18px;
      font-weight: bold;
    }
  }

  .trades-section {
    background: $white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba($primary, 0.1);

    .section-header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: 16px;


      & .trade-filters {
        width: 100%;
      }
    }
  }
}
</style>
