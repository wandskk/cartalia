<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="['base-btn', color]"
  >
    <span v-if="loading" class="btn-spinner"></span>
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'error' | 'warning' | 'info'
}>()
</script>

<style scoped lang="scss">
@use '../../styles/_variables.scss' as *;
.base-btn {
  width: 100%;
  padding: 0.9rem 0;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.base-btn.primary {
  background: $primary;
  color: $white;
}
.base-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.btn-spinner {
  width: 1.2em;
  height: 1.2em;
  border: 2.5px solid $white;
  border-top: 2.5px solid $primary;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style> 