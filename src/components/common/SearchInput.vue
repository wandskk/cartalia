<template>
  <v-text-field
    v-model="searchValue"
    :placeholder="placeholder"
    prepend-inner-icon="mdi-magnify"
    variant="outlined"
    density="comfortable"
    hide-details
    class="search-input"
    :class="{ 'mobile': isMobile }"
    @input="handleInput"
    @focus="handleFocus"
    @blur="handleBlur"
  />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';

interface Props {
  modelValue?: string;
  placeholder?: string;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'search', value: string): void;
  (e: 'focus'): void;
  (e: 'blur'): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Buscar...'
});

const emit = defineEmits<Emits>();

const searchValue = ref(props.modelValue);
const isMobile = ref(false);

function handleInput() {
  emit('update:modelValue', searchValue.value);
  emit('search', searchValue.value);
}

function handleFocus() {
  emit('focus');
}

function handleBlur() {
  emit('blur');
}

function checkMobile() {
  isMobile.value = window.innerWidth <= 768;
}

watch(() => props.modelValue, (newValue) => {
  searchValue.value = newValue;
});

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>

<style scoped>
.search-input {
  width: 100%;
  transition: all 0.2s ease;
}

.search-input :deep(.v-field) {
  border-radius: 12px;
  transition: all 0.2s ease;
}

.search-input :deep(.v-field__input) {
  font-size: 1rem;
  padding: 12px 16px;
  min-height: 48px;
}

.search-input :deep(.v-field__prepend-inner) {
  padding-left: 16px;
}

.search-input :deep(.v-field__prepend-inner .v-icon) {
  font-size: 20px;
  color: rgba(0, 0, 0, 0.6);
}

/* Mobile specific styles */
.search-input.mobile :deep(.v-field__input) {
  font-size: 16px; /* Prevents zoom on iOS */
  padding: 14px 16px;
  min-height: 52px;
}

.search-input.mobile :deep(.v-field) {
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-input.mobile :deep(.v-field__prepend-inner .v-icon) {
  font-size: 22px;
}

/* Focus states */
.search-input :deep(.v-field--focused) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.search-input.mobile :deep(.v-field--focused) {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .search-input :deep(.v-field__input) {
    padding: 16px 20px;
    min-height: 56px;
  }
  
  .search-input :deep(.v-field__prepend-inner) {
    padding-left: 20px;
  }
  
  .search-input :deep(.v-field__prepend-inner .v-icon) {
    font-size: 24px;
  }
}

@media (max-width: 360px) {
  .search-input :deep(.v-field__input) {
    padding: 18px 24px;
    min-height: 60px;
  }
  
  .search-input :deep(.v-field__prepend-inner) {
    padding-left: 24px;
  }
}
</style> 