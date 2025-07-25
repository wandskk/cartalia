<template>
  <MainLayout>
    <template #header>
      <CardsHeader />
    </template>

    <div class="cards-content">
      <CardsErrorState v-if="cardsStore.error" :error="cardsStore.error" />
      <CardsEmptyState v-else-if="!cardsStore.loading && cardsStore.userCards.length === 0" />
      <CardList v-else :cards="cardsStore.userCards" />
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useCardsStore } from '../stores/cards';
import MainLayout from '../components/layout/MainLayout.vue';
import CardsHeader from '../components/features/cards/CardsHeader.vue';
import CardsErrorState from '../components/features/cards/CardsErrorState.vue';
import CardsEmptyState from '../components/features/cards/CardsEmptyState.vue';
import CardList from '../components/features/cards/CardList.vue';

const cardsStore = useCardsStore();

onMounted(() => {
  cardsStore.fetchUserCards();
});
</script>

<style scoped>
.cards-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
}
</style>
