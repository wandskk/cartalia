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
  margin-bottom: 0;

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    width: 100%;

    @media (max-width: 1024px) {
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
    }

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
      gap: 0.875rem;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      border-radius: 1.5rem;
      padding: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      gap: 1.25rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;

      @media (max-width: 768px) {
        padding: 1.5rem;
        gap: 1rem;
      }

      @media (max-width: 480px) {
        padding: 1.25rem;
        gap: 0.875rem;
      }

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &:hover {
        transform: translateY(-4px);
        background: rgba(255, 255, 255, 0.95);
        border-color: rgba(59, 130, 246, 0.2);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

        &::before {
          opacity: 1;
        }
      }

      .stat-icon {
        font-size: 2rem;
        width: 4rem;
        height: 4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
        border-radius: 1rem;
        flex-shrink: 0;
        border: 1px solid rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease;

        @media (max-width: 768px) {
          font-size: 1.75rem;
          width: 3.5rem;
          height: 3.5rem;
          border-radius: 0.875rem;
        }

        @media (max-width: 480px) {
          font-size: 1.5rem;
          width: 3rem;
          height: 3rem;
          border-radius: 0.75rem;
        }
      }

      .stat-content {
        flex: 1;
        min-width: 0;

        .stat-number {
          display: block;
          font-size: 2.5rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 0.25rem;
          line-height: 1;
          letter-spacing: -0.025em;

          @media (max-width: 768px) {
            font-size: 2.25rem;
            margin-bottom: 0.125rem;
          }

          @media (max-width: 480px) {
            font-size: 2rem;
          }
        }

        .stat-label {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          line-height: 1.2;

          @media (max-width: 768px) {
            font-size: 0.8125rem;
            letter-spacing: 0.025em;
          }

          @media (max-width: 480px) {
            font-size: 0.75rem;
          }
        }
      }
    }
  }
}
</style> 
