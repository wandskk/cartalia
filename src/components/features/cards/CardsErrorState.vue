<template>
  <div class="d-flex flex-column align-center justify-center py-10 text-center">
    <v-icon size="48" color="error" class="mb-4">mdi-alert-circle</v-icon>
    <p class="text-error text-body-1 mb-4">{{ error }}</p>
    <v-btn @click="$emit('retry')" color="primary" variant="elevated">
      Tentar novamente
    </v-btn>
  </div>
</template>

<script setup lang="ts">
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