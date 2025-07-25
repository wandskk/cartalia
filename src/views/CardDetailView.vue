<template>
  <div class="card-detail-view">
    <Container>
      <div v-if="loading" class="d-flex flex-column align-center justify-center py-10 text-grey">
        <LoadingSpinner text="Carregando detalhes da carta..." />
      </div>

      <div v-else-if="error" class="d-flex flex-column align-center justify-center py-10 text-center">
        <v-icon size="48" color="error" class="mb-4">mdi-alert-circle</v-icon>
        <p class="text-error text-body-1 mb-4">{{ error }}</p>
        <v-btn @click="fetchCard" color="primary" variant="elevated">
          Tentar novamente
        </v-btn>
      </div>

      <div v-else-if="!selectedCard" class="d-flex flex-column align-center justify-center py-10 text-center">
        <v-icon size="48" color="warning" class="mb-4">mdi-card-off</v-icon>
        <h2 class="text-h5 font-weight-bold mb-2">Carta não encontrada</h2>
        <p class="text-body-1 text-grey mb-4">A carta que você está procurando não existe ou foi removida.</p>
        <v-btn @click="goBack" color="primary" variant="elevated">Voltar</v-btn>
      </div>

      <div v-else class="card-detail-content">
        <div class="mb-6">
          <v-btn @click="goBack" color="secondary" variant="outlined" prepend-icon="mdi-arrow-left">
            Voltar
          </v-btn>
        </div>

        <v-card class="card-detail" elevation="2">
          <v-card-text class="pa-6">
            <div class="d-flex flex-column flex-md-row align-start ga-6">
              <div class="d-flex justify-center mb-4 mb-md-0">
                <v-img
                  :src="selectedCard.imageUrl"
                  :alt="selectedCard.name"
                  width="300"
                  height="420"
                  class="rounded-lg elevation-3"
                  @error="handleImageError"
                  cover
                />
              </div>

              <div class="flex-grow-1">
                <div class="mb-6">
                  <h1 class="text-h4 font-weight-bold mb-2">{{ selectedCard.name }}</h1>
                </div>

                <div class="mb-6">
                  <h3 class="text-h6 font-weight-bold mb-3">Descrição</h3>
                  <p class="text-body-1">{{ selectedCard.description }}</p>
                </div>

                <div class="d-flex flex-wrap ga-3">
                  <v-btn 
                    v-if="isUserCard" 
                    @click="addToTrade" 
                    color="primary" 
                    variant="elevated"
                    prepend-icon="mdi-swap-horizontal"
                  >
                    Usar em Troca
                  </v-btn>

                  <v-btn
                    @click="addToCollection"
                    :color="isUserCard ? 'grey' : 'secondary'"
                    :variant="isUserCard ? 'tonal' : 'elevated'"
                    :disabled="isUserCard"
                    prepend-icon="mdi-plus"
                  >
                    {{ isUserCard ? "Já na sua coleção" : "Adicionar à Coleção" }}
                  </v-btn>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
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
import { useLoadingState } from "../composables/useLoadingState";
import Container from "../components/common/Container.vue";
import LoadingSpinner from "../components/common/LoadingSpinner.vue";

const route = useRoute();
const router = useRouter();
const cardsStore = useCardsStore();
const authStore = useAuthStore();
const notification = useNotificationStore();


const { isLoading: loading, withLoading } = useLoadingState();

const cardId = computed(() => route.params.id as string);
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
  await withLoading(async () => {
    try {
      await cardsStore.fetchCardById(cardId.value);
    } catch (err: any) {
      notification.show(err.message || "Erro ao carregar carta", "error");
    }
  }, "Carregando detalhes da carta...");
}

function goBack() {
  router.back();
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = "/placeholder-card.jpg";
}

async function addToCollection() {
  if (!selectedCard.value) return;

  await withLoading(async () => {
    try {
      await cardsStore.addCardsToUser([selectedCard.value!.id]);
      notification.show("Carta adicionada à sua coleção!", "success");
    } catch (err: any) {
      notification.show(err.message || "Erro ao adicionar carta", "error");
    }
  }, "Adicionando carta à coleção...");
}

function addToTrade() {
  if (!selectedCard.value) return;
  router.push(`/my-trades?card=${selectedCard.value.id}`);
}
</script>

<style scoped>
.card-detail-view {
  min-height: 100vh;
  background: linear-gradient(135deg, rgb(var(--v-theme-grey-lighten-5)) 0%, white 100%);
}

.card-detail {
  border-radius: 16px;
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}
</style>
