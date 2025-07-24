<template>
  <div class="cards-no-results">
    <div class="no-results-icon">🔍</div>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
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