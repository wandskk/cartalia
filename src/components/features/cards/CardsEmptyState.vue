<template>
  <div class="text-center max-width-400">
    <div class="mb-4 text-h1">
      <v-icon size="64" color="grey">mdi-cards</v-icon>
    </div>
    <h3 class="text-h5 font-weight-bold mb-4">Nenhuma carta encontrada</h3>
    <p class="text-body-1 text-grey mb-6">
      Parece que não há cartas disponíveis no momento. Tente ajustar os filtros ou volte mais tarde.
    </p>
  </div>
</template>

<script setup lang="ts">
// Componente simples, sem lógica adicional
</script>

<style scoped lang="scss">
@use '../../../styles/_variables.scss' as *;

.cards-empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;

  .empty-content {
    text-align: center;
    max-width: 400px;

    .empty-icon {
      font-size: 64px;
      margin-bottom: 16px;
    }

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
</style> 