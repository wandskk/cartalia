<template>
  <div class="d-flex justify-space-between align-start mb-8 flex-wrap ga-6">
    <div class="flex-grow-1">
      <h1 class="text-h3 font-weight-bold mb-2 text-primary text-left">{{ title }}</h1>
      <p class="text-body-1 text-grey mb-0 text-left">{{ subtitle }}</p>
    </div>
    
    <div v-if="$slots.actions" class="d-flex ga-3 flex-wrap">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  subtitle: string;
}

defineProps<Props>();
</script>

<style scoped>
@media (max-width: 768px) {
  .d-flex {
    flex-direction: column;
    text-align: center;
    align-items: stretch;
  }
  
  .text-h3 {
    font-size: 28px !important;
  }
  
  .text-body-1 {
    font-size: 16px !important;
  }
  
  .d-flex .d-flex {
    width: 100%;
    justify-content: center;
  }
}
</style> 