<template>
  <div class="cards-empty-state">
    <div class="empty-content">
      <div class="empty-icon">🃏</div>
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
      <BaseButton @click="$emit('add-cards')" color="primary">
        {{ buttonText }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '../../common/BaseButton.vue';

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