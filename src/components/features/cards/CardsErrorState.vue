<template>
  <div class="cards-error-state">
    <div class="error-icon">⚠️</div>
    <p class="error-message">{{ error }}</p>
    <BaseButton @click="$emit('retry')" color="primary">
      Tentar novamente
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '../../common/BaseButton.vue';

interface Props {
  error: string;
}

interface Emits {
  (e: 'retry'): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<style scoped lang="scss">
@use '../../../styles/_variables.scss' as *;

.cards-error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;

  .error-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .error-message {
    color: $error;
    margin-bottom: 16px;
    font-size: 16px;
  }
}
</style> 