<template>
  <div class="d-flex ga-1 bg-grey-lighten-4 rounded-lg pa-1">
    <v-btn
      v-for="view in viewModes"
      :key="view.value"
      @click="handleViewChange(view.value)"
      :variant="modelValue === view.value ? 'elevated' : 'text'"
      :color="modelValue === view.value ? 'primary' : 'grey'"
      size="small"
      :title="view.title"
      :aria-label="view.title"
      class="text-none"
    >
      <v-icon :icon="view.icon" size="16"></v-icon>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
interface ViewMode {
  value: 'grid' | 'list';
  icon: string;
  title: string;
}

interface Props {
  modelValue: 'grid' | 'list';
  viewModes?: ViewMode[];
}

interface Emits {
  (e: 'update:modelValue', value: 'grid' | 'list'): void;
}

const { modelValue, viewModes = [
  { value: 'grid', icon: 'mdi-view-grid', title: 'Visualização em grade' },
  { value: 'list', icon: 'mdi-view-list', title: 'Visualização em lista' }
] } = defineProps<Props>();

const emit = defineEmits<Emits>();

function handleViewChange(view: 'grid' | 'list') {
  emit('update:modelValue', view);
}
</script> 