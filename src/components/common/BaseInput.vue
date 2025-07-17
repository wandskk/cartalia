<template>
  <div class="base-input">
    <label v-if="label" :for="id">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      v-model="modelValueProxy"
      class="input"
      :autocomplete="autocomplete"
      :disabled="disabled"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  type?: string
  id?: string
  autocomplete?: string
  disabled?: boolean
}>()
const emit = defineEmits(['update:modelValue'])
const modelValueProxy = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})
</script>

<style scoped lang="scss">
@use '../../styles/_variables.scss' as *;
.base-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
label {
  font-size: 1rem;
  color: $gray-800;
  font-weight: 500;
}
.input {
  padding: 0.9rem 1rem;
  border: 1.5px solid $gray-300;
  border-radius: 10px;
  font-size: 1rem;
  background: $white;
  color: $gray-900;
  outline: none;
  transition: border-color 0.2s;
}
.input:focus {
  border-color: $primary;
}
.input:disabled {
  background: $gray-100;
  color: $gray-400;
}
</style> 