<template>
  <div class="loading-spinner-container">
    <div class="loading-spinner"></div>
    <p v-if="text" class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text?: string;
}

withDefaults(defineProps<Props>(), {
  text: ''
});
</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';

.loading-spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: $gray-600;

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid $gray-200;
    border-top: 3px solid $primary;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }

  .loading-text {
    margin: 0;
    font-size: 14px;
    text-align: center;
    color: $gray-600;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
}

@media (max-width: 768px) {
  .loading-spinner-container {
    padding: 30px 16px;

    .loading-spinner {
      width: 32px;
      height: 32px;
      border-width: 2px;
      margin-bottom: 12px;
    }

    .loading-text {
      font-size: 13px;
    }
  }
}
</style> 