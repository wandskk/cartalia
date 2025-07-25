<template>
  <div v-if="loading" class="loading-overlay" :class="{ 'overlay': overlay }">
    <div class="loading-content">
      <v-progress-circular
        :size="size"
        :width="width"
        :color="color"
        indeterminate
      />
      
      <div v-if="message" class="loading-message">
        {{ message }}
      </div>
      
      <div v-if="showSpinner" class="loading-spinner">
        <div class="spinner-dot"></div>
        <div class="spinner-dot"></div>
        <div class="spinner-dot"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  loading: boolean;
  message?: string;
  size?: number;
  width?: number;
  color?: string;
  showSpinner?: boolean;
  overlay?: boolean;
}

withDefaults(defineProps<Props>(), {
  loading: false,
  message: '',
  size: 48,
  width: 4,
  color: 'primary',
  showSpinner: false,
  overlay: true
});
</script>

<style scoped lang="scss">
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  border-radius: inherit;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading-message {
  font-size: 0.875rem;
  color: #666;
  text-align: center;
  max-width: 200px;
  line-height: 1.4;
}

.loading-spinner {
  display: flex;
  gap: 0.25rem;
}

.spinner-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #1976d2;
  animation: spinner-bounce 1.4s ease-in-out infinite both;
  
  &:nth-child(1) {
    animation-delay: -0.32s;
  }
  
  &:nth-child(2) {
    animation-delay: -0.16s;
  }
}

@keyframes spinner-bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

// Variants
.loading-overlay:not(.overlay) {
  position: relative;
  background: transparent;
  backdrop-filter: none;
}
</style> 