<template>
  <div class="view-toggle" :class="{ 'mobile': isMobile }">
    <v-btn
      v-for="view in viewModes"
      :key="view.value"
      @click="handleViewChange(view.value)"
      :variant="modelValue === view.value ? 'elevated' : 'text'"
      :color="modelValue === view.value ? 'primary' : 'grey'"
      :size="isMobile ? 'default' : 'small'"
      :title="view.title"
      :aria-label="view.title"
      class="view-btn text-none"
      :class="{ 'active': modelValue === view.value }"
    >
      <v-icon :icon="view.icon" :size="isMobile ? 20 : 16"></v-icon>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

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
const isMobile = ref(false);

function handleViewChange(view: 'grid' | 'list') {
  emit('update:modelValue', view);
}

function checkMobile() {
  isMobile.value = window.innerWidth <= 768;
}

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>

<style scoped>
.view-toggle {
  display: flex;
  gap: 4px;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 12px;
  padding: 4px;
  transition: all 0.2s ease;
}

.view-toggle.mobile {
  gap: 6px;
  border-radius: 16px;
  padding: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.view-btn {
  border-radius: 8px;
  transition: all 0.2s ease;
  min-width: 40px;
  height: 36px;
}

.view-toggle.mobile .view-btn {
  border-radius: 12px;
  min-width: 48px;
  height: 44px;
}

.view-btn.active {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transform: scale(1.05);
}

.view-toggle.mobile .view-btn.active {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transform: scale(1.08);
}

.view-btn:hover {
  transform: scale(1.02);
}

.view-toggle.mobile .view-btn:hover {
  transform: scale(1.05);
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .view-toggle {
    gap: 8px;
    padding: 8px;
  }
  
  .view-toggle.mobile .view-btn {
    min-width: 52px;
    height: 48px;
  }
}

@media (max-width: 360px) {
  .view-toggle {
    gap: 6px;
    padding: 6px;
  }
  
  .view-toggle.mobile .view-btn {
    min-width: 48px;
    height: 44px;
  }
}
</style> 