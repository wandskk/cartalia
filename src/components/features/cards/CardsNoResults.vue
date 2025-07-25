<template>
  <div class="d-flex flex-column align-center justify-center py-8 text-center">
    <v-icon size="48" color="grey-lighten-1" class="mb-4">mdi-magnify</v-icon>
    <h3 class="text-h6 font-weight-bold mb-2">{{ title }}</h3>
    <p class="text-body-2 text-grey mb-0">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  description?: string;
}

withDefaults(defineProps<Props>(), {
  title: 'Nenhuma carta encontrada',
  description: 'Tente ajustar os filtros ou a busca'
});
</script>

<style scoped lang="scss">
@use '../../../styles/_variables.scss' as *;

.cards-no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;

  .no-results-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.6;
  }

  h3 {
    margin: 0 0 8px 0;
    color: $black;
    font-size: 20px;
    font-weight: 600;
  }

  p {
    margin: 0;
    color: $gray-600;
    font-size: 14px;
  }
}
</style> 