<template>
  <Container>
    <div class="dashboard-view">
      <DashboardHeader />

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
import Container from "../components/common/Container.vue";
import DashboardHeader from "../components/features/dashboard/DashboardHeader.vue";
import DashboardStats from "../components/features/dashboard/DashboardStats.vue";
import QuickActions from "../components/features/dashboard/QuickActions.vue";
import RecentActivity from "../components/features/dashboard/RecentActivity.vue";
import { useDashboard } from "../composables/useDashboard";

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
  fetchData,
} = useDashboard();
</script>

<style scoped lang="scss">
@use "../styles/_variables.scss" as *;

.dashboard-view {
  min-height: 100vh;
  padding: 2rem 0;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 1.5rem 0;
  }

  @media (max-width: 480px) {
    padding: 1rem 0;
  }

  .dashboard-content {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    max-width: 100%;
    width: 100%;

    @media (max-width: 768px) {
      gap: 2rem;
    }

    @media (max-width: 480px) {
      gap: 1.5rem;
    }
  }
}
</style>
