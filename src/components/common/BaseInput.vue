<template>
  <v-text-field
    :model-value="modelValue"
    :value="value"
    :label="label"
    :placeholder="placeholder"
    :type="type"
    :id="id"
    :autocomplete="autocomplete"
    :disabled="disabled"
    :error="error"
    :error-messages="errorMessages"
    :variant="variant"
    :density="density"
    :hide-details="hideDetails"
    @update:model-value="$emit('update:modelValue', $event)"
    @input="onInput && onInput($event)"
    @change="onChange && onChange($event)"
    @blur="onBlur && onBlur($event)"
    class="base-input"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: string
  value?: string
  label?: string
  placeholder?: string
  type?: string
  id?: string
  autocomplete?: string
  disabled?: boolean
  error?: boolean
  errorMessages?: string | string[]
  variant?: 'outlined' | 'filled' | 'plain' | 'underlined' | 'solo'
  density?: 'default' | 'comfortable' | 'compact'
  hideDetails?: boolean
  onInput?: (e: Event) => void
  onChange?: (e: Event) => void
  onBlur?: (e: Event) => void
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<style scoped>
.base-input {
  border-radius: 10px;
}
</style> 
