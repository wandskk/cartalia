<template>
  <div v-if="message" :class="['notification', type]">
    {{ message }}
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useNotificationStore } from '../../stores/notification';
const { message, type } = storeToRefs(useNotificationStore());
</script>

<style scoped lang="scss">
.notification {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  min-width: 220px;
  max-width: 90vw;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  z-index: 9999;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  color: #fff;
  opacity: 0.97;
  transition: all 0.3s;
}
.notification.success {
  background: #22c55e;
}
.notification.error {
  background: #ef4444;
}
</style> 
