<template>
  <div class="card-stats">
    <div class="stats-grid">
      <div class="stat-card primary">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <span class="stat-number">{{ totalCards }}</span>
          <span class="stat-label">Total de Cartas</span>
        </div>
      </div>
      <div class="stat-card secondary">
        <div class="stat-icon">🔄</div>
        <div class="stat-content">
          <span class="stat-number">{{ recentCards }}</span>
          <span class="stat-label">Adicionadas este mês</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  totalCards: number;
  recentCards: number;
}

defineProps<Props>();
</script>

<style scoped lang="scss">
@use '../../../styles/_variables.scss' as *;

.card-stats {
  margin-bottom: 32px;

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;

    .stat-card {
      background: $white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      display: flex;
      align-items: center;
      gap: 16px;
      transition: all 0.3s ease;
      border: 1px solid rgba(0, 0, 0, 0.05);

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
      }

      &.primary {
        background: linear-gradient(
          135deg,
          $primary 0%,
          color-mix(in srgb, $primary 90%, black) 100%
        );
        color: $white !important;

        .stat-number {
          color: $white;
        }

        .stat-label {
          color: rgba(255, 255, 255, 0.9);
        }
      }

      &.secondary {
        background: linear-gradient(135deg, $gray-100 0%, $white 100%);
        border: 1px solid $gray-200;
      }

      .stat-icon {
        font-size: 32px;
        line-height: 1;
      }

      .stat-content {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .stat-number {
          font-size: 32px;
          font-weight: 700;
          color: $black;
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

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
      gap: 16px;

      .stat-card {
        padding: 20px;

        .stat-icon {
          font-size: 28px;
        }

        .stat-content .stat-number {
          font-size: 28px;
        }
      }
    }
  }
}
</style> 