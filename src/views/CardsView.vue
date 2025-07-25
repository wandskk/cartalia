<template>
  <div class="cards-view">
    <Container>
      <CardsHeader @add-cards="showAddCardModal = true" />

      <div class="cards-content">
        <CardsErrorState v-if="cardsStore.error" :error="cardsStore.error" />
        <CardsEmptyState
          v-else-if="!cardsStore.loading && cardsStore.userCards.length === 0"
        />
        <CardList v-else :cards="cardsStore.userCards" />
      </div>
    </Container>

    <!-- Modal de Adicionar Cartas -->
    <AddCardModal
      v-model="showAddCardModal"
      @cards-added="cardsStore.fetchUserCards()"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useCardsStore } from "../stores/cards";
import Container from "../components/common/Container.vue";
import CardsHeader from "../components/features/cards/CardsHeader.vue";
import CardsErrorState from "../components/features/cards/CardsErrorState.vue";
import CardsEmptyState from "../components/features/cards/CardsEmptyState.vue";
import CardList from "../components/features/cards/CardList.vue";
import AddCardModal from "../components/features/cards/AddCardModal.vue";

const cardsStore = useCardsStore();
const showAddCardModal = ref(false);

onMounted(() => {
  cardsStore.fetchUserCards();
});
</script>

<style scoped>
.cards-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  overflow-x: hidden;
}

.cards-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
}

@media (max-width: 768px) {
  .cards-view {
    padding: 1.5rem 0;
  }
}

@media (max-width: 480px) {
  .cards-view {
    padding: 1rem 0;
  }
}
</style>
