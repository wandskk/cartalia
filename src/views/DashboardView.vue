<template>
  <Container class="dashboard-view pa-0">
    <div v-if="!isInitialized && loading" class="dashboard-loading">
      <LoadingSpinner />
    </div>
    
    <div v-else class="dashboard-content">
      <DashboardHeader />
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
  </Container>
</template>

<script setup lang="ts">
import Container from "../components/common/Container.vue";
import DashboardStats from "../components/features/dashboard/DashboardStats.vue";
import QuickActions from "../components/features/dashboard/QuickActions.vue";
import RecentActivity from "../components/features/dashboard/RecentActivity.vue";
import LoadingSpinner from "../components/common/LoadingSpinner.vue";
import { useDashboard } from "../composables/useDashboard";
import DashboardHeader from "../components/features/dashboard/DashboardHeader.vue";

const {
  loading,
  error,
  userCards,
  userTradesList,
  totalCards,
  totalTrades,
  activeTrades,
  userTrades,
  marketplaceTrades,
  uniqueCards,
  isInitialized,
  fetchData
} = useDashboard();
</script>

<style scoped>
.dashboard-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 2rem 0;
  overflow-x: hidden;
}

.dashboard-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  max-width: 100%;
  width: 100%;
}

@media (max-width: 768px) {
  .dashboard-view {
    padding: 1.5rem 0;
  }

  .dashboard-content {
    gap: 2rem;
  }
}

@media (max-width: 480px) {
  .dashboard-view {
    padding: 1rem 0;
  }

  .dashboard-content {
    gap: 1.5rem;
  }
}
</style>
