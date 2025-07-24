<template>
  <div class="search-input-container">
    <span class="search-icon">🔍</span>
    <input
      v-model="searchValue"
      type="text"
      :placeholder="placeholder"
      class="search-input"
      @input="handleInput"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  modelValue?: string;
  placeholder?: string;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'search', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Buscar...'
});

const emit = defineEmits<Emits>();

const searchValue = ref(props.modelValue);

function handleInput() {
  emit('update:modelValue', searchValue.value);
  emit('search', searchValue.value);
}

watch(() => props.modelValue, (newValue) => {
  searchValue.value = newValue;
});
</script>

<style scoped lang="scss">
@use '../../styles/_variables.scss' as *;

.search-input-container {
  position: relative;
  display: flex;
  align-items: center;

  .search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    color: $gray-500;
    z-index: 1;
  }

  .search-input {
    width: 100%;
    padding: 12px 16px 12px 44px;
    border: 2px solid $gray-200;
    border-radius: 12px;
    background: $white;
    font-size: 14px;
    color: $black;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: $primary;
      box-shadow: 0 0 0 3px rgba($primary, 0.1);
    }

    &::placeholder {
      color: $gray-500;
    }
  }
}
</style> 