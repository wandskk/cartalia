<template>
  <div class="create-trade-view">
    <Container>
      <div class="header">
        <BaseButton @click="goBack" color="secondary">
          ← Voltar
        </BaseButton>
      </div>

      <div v-if="!isAuthenticated" class="auth-required">
        <div class="auth-content">
          <h2>Login Necessário</h2>
          <p>Você precisa estar logado para criar uma troca.</p>
          <div class="auth-actions">
            <BaseButton @click="goToLogin" color="primary">
              Fazer Login
            </BaseButton>
            <BaseButton @click="goToRegister" color="secondary">
              Cadastrar
            </BaseButton>
          </div>
        </div>
      </div>

      <div v-else-if="!hasUserCards" class="no-cards">
        <div class="no-cards-content">
          <h2>Nenhuma Carta Disponível</h2>
          <p>Você precisa ter cartas na sua coleção para criar uma troca.</p>
          <BaseButton @click="goToCards" color="primary">
            Adicionar Cartas
          </BaseButton>
        </div>
      </div>

      <div v-else class="create-form">
        <CreateTradeForm />
      </div>
    </Container>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useCardsStore } from '../stores/cards';
import Container from '../components/common/Container.vue';
import BaseButton from '../components/common/BaseButton.vue';
import CreateTradeForm from '../components/features/trades/CreateTradeForm.vue';

const router = useRouter();
const authStore = useAuthStore();
const cardsStore = useCardsStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const hasUserCards = computed(() => cardsStore.hasUserCards);

onMounted(() => {
  if (isAuthenticated.value) {
    cardsStore.fetchUserCards();
  }
});

function goBack() {
  router.back();
}

function goToLogin() {
  router.push('/login');
}

function goToRegister() {
  router.push('/register');
}

function goToCards() {
  router.push('/cards');
}
</script>

<style scoped lang="scss">
@use '../styles/_variables.scss' as *;

.create-trade-view {
  min-height: 100vh;
  background: $gray-50;
  padding: 24px 0;

  .header {
    margin-bottom: 24px;
  }

  .auth-required,
  .no-cards {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60vh;

    .auth-content,
    .no-cards-content {
      text-align: center;
      max-width: 400px;

      h2 {
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

      .auth-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
        flex-wrap: wrap;

        @media (max-width: 480px) {
          flex-direction: column;
        }
      }
    }
  }

  .create-form {
    max-width: 1200px;
    margin: 0 auto;
  }
}
</style> 
