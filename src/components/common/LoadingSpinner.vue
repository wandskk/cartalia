<template>
  <div class="d-flex flex-column align-center justify-center pa-5">
    <v-progress-circular 
      indeterminate 
      color="primary" 
      :size="size" 
      class="mb-4"
    />
    <p v-if="text" class="text-body-2 text-grey text-center mb-0">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text?: string;
  size?: number | string;
}

withDefaults(defineProps<Props>(), {
  text: '',
  size: 40
});
</script>

<style scoped>
@media (max-width: 768px) {
  .d-flex {
    padding: 30px 16px !important;
  }
  
  .v-progress-circular {
    margin-bottom: 12px !important;
  }
  
  .text-body-2 {
    font-size: 13px;
  }
}
</style> 