<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-container" :class="size" @click.stop>
          <div class="modal-header">
            <h2 class="modal-title">{{ title }}</h2>
            <button 
              v-if="showCloseButton" 
              @click="$emit('update:modelValue', false)" 
              class="modal-close"
              type="button"
              aria-label="Fechar modal"
            >
              ✕
            </button>
          </div>
          
          <div class="modal-content">
            <slot />
          </div>
          
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  size: 'md',
  showCloseButton: true,
  closeOnOverlayClick: true
});

const emit = defineEmits<Emits>();

function handleOverlayClick() {
  if (props.closeOnOverlayClick) {
    emit('update:modelValue', false);
  }
}
</script>

<style scoped lang="scss">
@use '../../styles/_variables.scss' as *;

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: $white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: modalSlideIn 0.3s ease-out;

  &.sm {
    width: 400px;
  }

  &.md {
    width: 600px;
  }

  &.lg {
    width: 800px;
  }

  &.xl {
    width: 1000px;
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid $gray-200;

  .modal-title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: $black;
  }

  .modal-close {
    background: none;
    border: none;
    font-size: 20px;
    color: $gray-500;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.2s ease;

    &:hover {
      background: $gray-100;
      color: $gray-700;
    }
  }
}

.modal-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  max-height: calc(90vh - 140px);
}

.modal-footer {
  padding: 0 24px 24px 24px;
  border-top: 1px solid $gray-200;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(-20px);
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 16px;
  }

  .modal-container {
    width: 100% !important;
    max-width: 100%;
    max-height: 95vh;

    &.sm,
    &.md,
    &.lg,
    &.xl {
      width: 100%;
    }
  }

  .modal-header {
    padding: 20px 20px 0 20px;

    .modal-title {
      font-size: 18px;
    }
  }

  .modal-content {
    padding: 20px;
  }

  .modal-footer {
    padding: 0 20px 20px 20px;
  }
}
</style> 