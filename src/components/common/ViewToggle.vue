<template>
  <div class="view-toggle">
    <button 
      v-for="view in viewModes"
      :key="view.value"
      @click="handleViewChange(view.value)" 
      :class="['view-btn', { active: modelValue === view.value }]"
      :title="view.title"
      type="button"
      :aria-label="view.title"
    >
      {{ view.icon }}
    </button>
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
  { value: 'grid', icon: '⊞', title: 'Visualização em grade' },
  { value: 'list', icon: '☰', title: 'Visualização em lista' }
] } = defineProps<Props>();

const emit = defineEmits<Emits>();

function handleViewChange(view: 'grid' | 'list') {
  emit('update:modelValue', view);
}
</script>

<style scoped lang="scss">
@use '../../styles/_variables.scss' as *;

.view-toggle {
  display: flex;
  gap: 4px;
  background: $gray-100;
  border-radius: 8px;
  padding: 4px;

  .view-btn {
    padding: 8px 12px;
    border: none;
    background: transparent;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: $gray-600;
    font-size: 16px;

    &.active {
      background: $white;
      color: $primary;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    &:hover:not(.active) {
      background: rgba($primary, 0.1);
      color: $primary;
    }
  }
}
</style> 