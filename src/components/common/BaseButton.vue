<template>
  <v-btn
    :type="type"
    :disabled="disabled || loading"
    :color="color"
    :variant="variant"
    :size="size"
    :block="block"
    :loading="loading"
    @click="$emit('click')"
    class="base-btn"
  >
    <slot />
  </v-btn>
</template>

<script setup lang="ts">
defineProps<{
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'error' | 'warning' | 'info'
  variant?: 'text' | 'flat' | 'elevated' | 'tonal' | 'outlined' | 'plain'
  size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
  block?: boolean
}>()

defineEmits<{
  click: []
}>()
</script>

<style scoped>
.base-btn {
  border-radius: 10px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: normal;
}
</style> 
