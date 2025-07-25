<template>
  <v-dialog
    :model-value="modelValue"
    :max-width="maxWidth"
    :persistent="persistent"
    :scrollable="scrollable"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card class="base-modal">
      <v-card-title class="modal-header">
        <span class="modal-title">{{ title }}</span>
        <v-btn
          v-if="showCloseButton"
          icon
          variant="text"
          @click="$emit('update:modelValue', false)"
          aria-label="Fechar modal"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      
      <v-card-text class="modal-content">
        <slot />
      </v-card-text>
      
      <v-card-actions v-if="$slots.footer" class="modal-footer">
        <slot name="footer" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: boolean;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  persistent?: boolean;
  scrollable?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  size: 'md',
  showCloseButton: true,
  persistent: false,
  scrollable: false
});

defineEmits<Emits>();

const maxWidth = computed(() => {
  switch (props.size) {
    case 'sm': return '400px';
    case 'md': return '600px';
    case 'lg': return '800px';
    case 'xl': return '1000px';
    default: return '600px';
  }
});
</script>

<style scoped>
.base-modal {
  border-radius: 16px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
}

.modal-content {
  padding: 24px;
  max-height: calc(90vh - 140px);
  overflow-y: auto;
}

.modal-footer {
  padding: 0 24px 24px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  background: white;
  position: sticky;
  bottom: 0;
  z-index: 1;
}

@media (max-width: 768px) {
  .modal-header {
    padding: 20px 20px 0 20px;
  }

  .modal-title {
    font-size: 18px;
  }

  .modal-content {
    padding: 20px;
    max-height: calc(100vh - 180px);
  }

  .modal-footer {
    padding: 0 20px 20px 20px;
  }
}
</style> 