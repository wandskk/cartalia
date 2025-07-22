<template>
  <div class="cards-view">
    <Container>
      <div class="header">
        <h1>Minhas Cartas</h1>
        <BaseButton @click="showAddForm = true" color="primary">
          Adicionar Cartas
        </BaseButton>
      </div>

      <div class="stats">
        <div class="stat-card">
          <span class="stat-number">{{ totalUserCards }}</span>
          <span class="stat-label">Total de Cartas</span>
        </div>
      </div>

      <div v-if="!showAddForm" class="user-cards-section">
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Carregando suas cartas...</p>
        </div>

        <div v-else-if="error" class="error-state">
          <p class="error-message">{{ error }}</p>
          <BaseButton @click="fetchUserCards" color="primary">Tentar novamente</BaseButton>
        </div>

        <div v-else-if="!hasUserCards" class="empty-state">
          <div class="empty-content">
            <h3>Você ainda não tem cartas</h3>
            <p>Adicione cartas à sua coleção para começar a fazer trocas!</p>
            <BaseButton @click="showAddForm = true" color="primary">
              Adicionar Primeira Carta
            </BaseButton>
          </div>
        </div>

        <div v-else class="cards-content">
          <CardList
            :cards="userCards"
            :loading="loading"
            :error="error"
            :clickable="true"
            @card-click="handleCardClick"
            @retry="fetchUserCards"
          />
        </div>
      </div>

      <div v-else class="add-form-section">
        <div class="form-header">
          <BaseButton @click="showAddForm = false" color="secondary">
            ← Voltar para Minhas Cartas
          </BaseButton>
        </div>
        <AddCardForm />
      </div>
    </Container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCardsStore } from '../stores/cards';
import { useAuthStore } from '../stores/auth';
import Container from '../components/common/Container.vue';
import BaseButton from '../components/common/BaseButton.vue';
import CardList from '../components/features/cards/CardList.vue';
import AddCardForm from '../components/features/cards/AddCardForm.vue';
import type { Card } from '../types/card';

const router = useRouter();
const cardsStore = useCardsStore();
const authStore = useAuthStore();

const showAddForm = ref(false);

const loading = computed(() => cardsStore.loading);
const error = computed(() => cardsStore.error);
const userCards = computed(() => cardsStore.userCards);
const hasUserCards = computed(() => cardsStore.hasUserCards);
const totalUserCards = computed(() => cardsStore.totalUserCards);

onMounted(() => {
  if (authStore.isAuthenticated) {
    fetchUserCards();
  } else {
    router.push('/login');
  }
});

async function fetchUserCards() {
  await cardsStore.fetchUserCards();
}

function handleCardClick(card: Card) {
  router.push(`/cards/${card.id}`);
}
</script>

<style scoped lang="scss">
@use '../styles/_variables.scss' as *;

.cards-view {
  min-height: 100vh;
  background: $gray-50;
  padding: 24px 0;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 16px;

    h1 {
      margin: 0;
      color: $black;
      font-size: 32px;
      font-weight: 700;
    }

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
      text-align: center;

      h1 {
        font-size: 24px;
      }
    }
  }

  .stats {
    margin-bottom: 32px;

    .stat-card {
      background: $white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      text-align: center;
      max-width: 200px;

      .stat-number {
        display: block;
        font-size: 36px;
        font-weight: 700;
        color: $primary;
        margin-bottom: 8px;
      }

      .stat-label {
        font-size: 14px;
        color: $gray-600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    color: $gray-600;

    .loading-spinner {
      width: 48px;
      height: 48px;
      border: 4px solid $gray-200;
      border-top: 4px solid $primary;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  }

  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    text-align: center;

    .error-message {
      color: $error;
      margin-bottom: 16px;
      font-size: 16px;
    }
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;

    .empty-content {
      text-align: center;
      max-width: 400px;

      h3 {
        margin: 0 0 16px 0;
        color: $black;
        font-size: 24px;
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

  .cards-content {
    background: $white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .add-form-section {
    .form-header {
      margin-bottom: 24px;
    }
  }
}
</style> 