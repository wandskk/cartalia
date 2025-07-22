<template>
  <div class="dashboard-view">
    <Container>
      <div class="header">
        <h1>Bem-vindo ao Cartalia!</h1>
        <p>Gerencie suas cartas e faça trocas no marketplace.</p>
      </div>

      <div class="quick-actions">
        <h2>Ações Rápidas</h2>
        <div class="actions-grid">
          <div class="action-card">
            <h3>Minhas Cartas</h3>
            <p>Visualize e gerencie sua coleção de cartas</p>
            <BaseButton @click="goToCards" color="primary">
              Ver Minhas Cartas
            </BaseButton>
          </div>
          
          <div class="action-card">
            <h3>Marketplace</h3>
            <p>Explore trocas disponíveis no marketplace</p>
            <BaseButton @click="goToMarketplace" color="secondary">
              Ver Marketplace
            </BaseButton>
          </div>
          
          <div class="action-card">
            <h3>Nova Troca</h3>
            <p>Crie uma nova solicitação de troca</p>
            <BaseButton @click="goToCreateTrade" color="accent">
              Criar Troca
            </BaseButton>
          </div>
        </div>
      </div>
    </Container>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import Container from "../components/common/Container.vue";
import BaseButton from "../components/common/BaseButton.vue";

const router = useRouter();

function goToCards() {
  router.push('/cards');
}

function goToMarketplace() {
  router.push('/marketplace');
}

function goToCreateTrade() {
  router.push('/create-trade');
}
</script>

<style scoped lang="scss">
@use '../styles/_variables.scss' as *;

.dashboard-view {
  min-height: 100vh;
  background: $gray-50;
  padding: 24px 0;

  .header {
    text-align: center;
    margin-bottom: 48px;

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
    }
  }

  .quick-actions {
    h2 {
      margin: 0 0 24px 0;
      color: $black;
      font-size: 24px;
      font-weight: 600;
      text-align: center;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      max-width: 900px;
      margin: 0 auto;

      .action-card {
        background: $white;
        border-radius: 12px;
        padding: 32px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        text-align: center;
        transition: transform 0.3s ease;

        &:hover {
          transform: translateY(-4px);
        }

        h3 {
          margin: 0 0 12px 0;
          color: $black;
          font-size: 20px;
          font-weight: 600;
        }

        p {
          margin: 0 0 24px 0;
          color: $gray-600;
          font-size: 16px;
          line-height: 1.5;
        }
      }
    }
  }
}
</style> 