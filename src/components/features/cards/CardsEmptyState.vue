<template>
  <div class="d-flex align-center justify-center py-10">
    <div class="text-center" style="max-width: 400px;">
      <div class="mb-4" style="font-size: 64px;">🃏</div>
      <h3 class="text-h5 font-weight-bold mb-4">{{ title }}</h3>
      <p class="text-body-1 text-grey mb-6">{{ description }}</p>
      <v-btn @click="$emit('add-cards')" color="primary" variant="elevated">
        {{ buttonText }}
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  description?: string;
  buttonText?: string;
}

interface Emits {
  (e: 'add-cards'): void;
}

withDefaults(defineProps<Props>(), {
  title: 'Você ainda não tem cartas',
  description: 'Adicione cartas à sua coleção para começar a fazer trocas!',
  buttonText: 'Adicionar Primeira Carta'
});

defineEmits<Emits>();
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