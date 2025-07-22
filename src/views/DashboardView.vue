<template>
  <Container>
    <div class="dashboard-view">
      <div class="header">
        <div class="header-content">
          <h1>Bem-vindo ao Cartalia!</h1>
          <p>Gerencie suas cartas e faça trocas no marketplace.</p>
        </div>
      </div>

      <div class="dashboard-content">
        <DashboardStats
          :total-cards="totalCards"
          :total-trades="totalTrades"
          :active-trades="activeTrades"
          :unique-cards="uniqueCards"
        />

        <QuickActions
          :total-cards="totalCards"
          :user-trades="userTrades"
          :marketplace-trades="marketplaceTrades"
        />

        <RecentActivity
          :trades="userTradesList"
          :cards="userCards"
          :loading="loading"
          :error="error"
          @retry="fetchData"
        />
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useCardsStore } from "../stores/cards";
import { useTradesStore } from "../stores/trades";
import Container from "../components/common/Container.vue";
import DashboardStats from "../components/features/dashboard/DashboardStats.vue";
import QuickActions from "../components/features/dashboard/QuickActions.vue";
import RecentActivity from "../components/features/dashboard/RecentActivity.vue";

const router = useRouter();
const authStore = useAuthStore();
const cardsStore = useCardsStore();
const tradesStore = useTradesStore();

const loading = computed(() => cardsStore.loading || tradesStore.loading);
const error = computed(() => cardsStore.error || tradesStore.error);

const userCards = computed(() => cardsStore.userCards);
const userTradesList = computed(() => tradesStore.userTrades);

const totalCards = computed(() => cardsStore.totalUserCards);
const totalTrades = computed(() => tradesStore.totalUserTrades);
const activeTrades = computed(() => tradesStore.totalUserTrades);
const userTrades = computed(() => tradesStore.totalUserTrades);
const marketplaceTrades = computed(() => tradesStore.totalTrades);

const uniqueCards = computed(() => {
  const uniqueNames = new Set(userCards.value.map((card) => card.name));
  return uniqueNames.size;
});

onMounted(() => {
  if (authStore.isAuthenticated) {
    fetchData();
  } else {
    router.push("/login");
  }
});

async function fetchData() {
  await Promise.all([
    cardsStore.fetchUserCards(),
    tradesStore.fetchAllTrades(),
  ]);
}
</script>

<style scoped lang="scss">
@use "../styles/_variables.scss" as *;

.dashboard-view {
  min-height: 100vh;
  background: $gray-50;
  padding: 24px 0;

  .header {
    margin-bottom: 32px;

    .header-content {
      h1 {
        margin: 0 0 16px 0;
        color: $black;
        font-size: 36px;
        font-weight: 700;
      }

      p {
        margin: 0;
        color: $gray-600;
        font-size: 18px;
        line-height: 1.5;
      }
    }

    @media (max-width: 768px) {
      .header-content {
        h1 {
          font-size: 28px;
        }

        p {
          font-size: 16px;
        }
      }
    }
  }

  .dashboard-content {
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 32px;

    @media (max-width: 768px) {
      gap: 24px;
    }
  }
}
</style>
