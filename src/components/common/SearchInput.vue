<template>
  <v-text-field
    v-model="searchValue"
    :placeholder="placeholder"
    prepend-inner-icon="mdi-magnify"
    variant="outlined"
    density="comfortable"
    hide-details
    class="search-input"
    @input="handleInput"
  />
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

<style scoped>
.search-input {
  width: 100%;
}
</style> 