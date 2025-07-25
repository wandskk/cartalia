<template>
  <div class="card-detail-view">
    <Container>
      <div v-if="loading" class="d-flex flex-column align-center justify-center py-10 text-grey">
        <LoadingSpinner text="Carregando detalhes da carta..." />
      </div>

      <div v-else-if="error" class="error-state">
        <p class="error-message">{{ error }}</p>
        <BaseButton @click="fetchCard" color="primary"
          >Tentar novamente</BaseButton
        >
      </div>

      <div v-else-if="!selectedCard" class="not-found-state">
        <h2>Carta não encontrada</h2>
        <p>A carta que você está procurando não existe ou foi removida.</p>
        <BaseButton @click="goBack" color="primary">Voltar</BaseButton>
      </div>

      <div v-else class="card-detail-content">
        <div class="header">
          <BaseButton @click="goBack" color="secondary"> ← Voltar </BaseButton>
        </div>

        <div class="card-detail">
          <div class="card-image-section">
            <div class="card-image">
              <img
                :src="selectedCard.imageUrl"
                :alt="selectedCard.name"
                @error="handleImageError"
              />
            </div>
          </div>

          <div class="card-info-section">
            <div class="card-header">
              <h1 class="card-name">{{ selectedCard.name }}</h1>
            </div>

            <div class="card-description">
              <h3>Descrição</h3>
              <p>{{ selectedCard.description }}</p>
            </div>

            <div class="card-actions">
              <BaseButton v-if="isUserCard" @click="addToTrade" color="primary">
                Usar em Troca
              </BaseButton>

              <BaseButton
                @click="addToCollection"
                color="secondary"
                :disabled="isUserCard"
              >
                {{ isUserCard ? "Já na sua coleção" : "Adicionar à Coleção" }}
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </Container>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCardsStore } from "../stores/cards";
import { useAuthStore } from "../stores/auth";
import { useNotificationStore } from "../stores/notification";
import Container from "../components/common/Container.vue";
import BaseButton from "../components/common/BaseButton.vue";
import LoadingSpinner from "../components/common/LoadingSpinner.vue";

const route = useRoute();
const router = useRouter();
const cardsStore = useCardsStore();
const authStore = useAuthStore();
const notification = useNotificationStore();

const cardId = computed(() => route.params.id as string);
const loading = computed(() => cardsStore.loading);
const error = computed(() => cardsStore.error);
const selectedCard = computed(() => cardsStore.selectedCard);
const userCards = computed(() => cardsStore.userCards);

const isUserCard = computed(() => {
  if (!selectedCard.value) return false;
  return userCards.value.some((card) => card.id === selectedCard.value?.id);
});

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push("/login");
    return;
  }

  if (cardId.value) {
    fetchCard();
  }
});

async function fetchCard() {
  if (cardId.value) {
    await cardsStore.fetchCardById(cardId.value);
  }
}

function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement;
  target.src = "/placeholder-card.jpg";
}

function goBack() {
  router.back();
}

function addToTrade() {
  notification.show("Funcionalidade em desenvolvimento", "info");
}

async function addToCollection() {
  if (!selectedCard.value || isUserCard.value) return;

  try {
    await cardsStore.addCardsToUser([selectedCard.value.id]);
    notification.show("Carta adicionada à sua coleção!", "success");
  } catch (err: any) {
    notification.show(
      err.message || "Erro ao adicionar carta à coleção",
      "error"
    );
  }
}
</script>

<style scoped lang="scss">
@use "../styles/_variables.scss" as *;

.card-detail-view {
  min-height: 100vh;
  background: $gray-50;
  padding: 24px 0;

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
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
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

  .not-found-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    text-align: center;

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
    }
  }

  .card-detail-content {
    .header {
      margin-bottom: 24px;
    }

    .card-detail {
      background: $white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;

      @media (min-width: 768px) {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0;
      }

      .card-image-section {
        background: $gray-100;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px;

        .card-image {
          max-width: 400px;
          width: 100%;

          img {
            width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
          }
        }
      }

      .card-info-section {
        padding: 32px;

        .card-header {
          margin-bottom: 24px;

          .card-name {
            margin: 0 0 12px 0;
            color: $black;
            font-size: 28px;
            font-weight: 700;
            line-height: 1.2;
          }

          .card-meta {
            .card-date {
              font-size: 14px;
              color: $gray-500;
            }
          }
        }

        .card-description {
          margin-bottom: 32px;

          h3 {
            margin: 0 0 12px 0;
            color: $black;
            font-size: 18px;
            font-weight: 600;
          }

          p {
            margin: 0;
            color: $gray-700;
            font-size: 16px;
            line-height: 1.6;
            white-space: pre-line;
          }
        }

        .card-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;

          @media (max-width: 480px) {
            flex-direction: column;
          }
        }
      }
    }
  }
}
</style>
