<template>
  <div class="cards-header">
    <div class="header-content">
      <h1>{{ title }}</h1>
      <p class="header-subtitle">{{ subtitle }}</p>
    </div>
    <BaseButton @click="$emit('add-cards')" color="primary" class="add-button">
      <span class="button-icon">+</span>
      {{ buttonText }}
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '../../common/BaseButton.vue';

interface Props {
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

interface Emits {
  (e: 'add-cards'): void;
}

withDefaults(defineProps<Props>(), {
  title: 'Minhas Cartas',
  subtitle: 'Gerencie sua coleção de cartas',
  buttonText: 'Adicionar Cartas'
});

defineEmits<Emits>();
</script>

<style scoped lang="scss">
@use '../../../styles/_variables.scss' as *;

.cards-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  gap: 20px;

  .header-content {
    width: 100%;

    h1 {
      margin: 0 0 8px 0;
      color: $black;
      font-size: 32px;
      font-weight: 700;
      line-height: 1.2;
    }

    .header-subtitle {
      margin: 0;
      color: $gray-600;
      font-size: 16px;
      line-height: 1.4;
    }
  }

  .add-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    font-weight: 600;
    border-radius: 12px;
    transition: all 0.3s ease;

    .button-icon {
      font-size: 18px;
      font-weight: 700;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    text-align: center;

    .header-content {
      h1 {
        font-size: 28px;
      }
    }

    .add-button {
      justify-content: center;
    }
  }
}
</style> 