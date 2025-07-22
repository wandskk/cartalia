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
  fetchData
} = useDashboard();
</script>

<style scoped lang="scss">
@use "../styles/_variables.scss" as *;

.dashboard-view {
  min-height: 100vh;
  background: $gray-50;
  padding: 24px 0;

  .dashboard-content {
    display: grid;
    gap: 32px;
  }
}
</style>
