<template>
  <div class="dashboard-stats">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">🃏</div>
        <div class="stat-content">
          <span class="stat-number">{{ totalCards }}</span>
          <span class="stat-label">Total de Cartas</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <span class="stat-number">{{ totalTrades }}</span>
          <span class="stat-label">Trocas Criadas</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🔄</div>
        <div class="stat-content">
          <span class="stat-number">{{ activeTrades }}</span>
          <span class="stat-label">Trocas Ativas</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">⭐</div>
        <div class="stat-content">
          <span class="stat-number">{{ uniqueCards }}</span>
          <span class="stat-label">Cartas Únicas</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">


interface Props {
  totalCards: number;
  totalTrades: number;
  activeTrades: number;
  uniqueCards: number;
}

defineProps<Props>();
</script>

<style scoped lang="scss">
@use '../../../styles/_variables.scss' as *;

.dashboard-stats {
  margin-bottom: 32px;

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
      gap: 16px;
    }

          .stat-card {
        background: $white;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 16px;
        transition: transform 0.3s ease, box-shadow 0.3s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

      .stat-icon {
        font-size: 28px;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: $gray-100;
        border-radius: 12px;
        flex-shrink: 0;
      }

      .stat-content {
        flex: 1;

        .stat-number {
          display: block;
          font-size: 28px;
          font-weight: 700;
          color: $primary;
          margin-bottom: 4px;
          line-height: 1;
        }

        .stat-label {
          font-size: 14px;
          color: $gray-600;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      }
    }
  }
}
</style> 
