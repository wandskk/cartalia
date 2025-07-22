<template>
  <div v-if="isOpen" class="error-modal-overlay" @click="handleOverlayClick">
    <div class="error-modal" @click.stop>
      <div class="modal-header">
        <div class="error-icon">
          <span v-if="error?.type === 'api'">⚠️</span>
          <span v-else-if="error?.type === 'network'">🌐</span>
          <span v-else-if="error?.type === 'auth'">🔒</span>
          <span v-else-if="error?.type === 'validation'">📝</span>
          <span v-else>❌</span>
        </div>
        <h3 class="modal-title">{{ error?.message || 'Erro' }}</h3>
        <button @click="closeModal" class="close-button" type="button">
          ×
        </button>
      </div>

      <div class="modal-content">
        <p v-if="error?.details" class="error-details">
          {{ error.details }}
        </p>

        <div v-if="error?.component" class="error-meta">
          <span class="meta-label">Componente:</span>
          <span class="meta-value">{{ error.component }}</span>
        </div>

        <div class="error-actions">
          <BaseButton @click="closeModal" color="secondary">
            Fechar
          </BaseButton>
          
          <BaseButton 
            v-if="error?.type === 'auth'" 
            @click="goToLogin" 
            color="primary"
          >
            Fazer Login
          </BaseButton>
          
          <BaseButton 
            v-else-if="error?.type === 'network'" 
            @click="retry" 
            color="primary"
          >
            Tentar Novamente
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useErrorStore } from '../../stores/error';
import BaseButton from './BaseButton.vue';
import type { AppError } from '../../stores/error';

interface Props {
  isOpen: boolean;
}

const props = defineProps<Props>();

const router = useRouter();
const errorStore = useErrorStore();

const error = computed(() => errorStore.currentError);

function closeModal() {
  errorStore.closeErrorModal();
}

function handleOverlayClick() {
  closeModal();
}

function goToLogin() {
  closeModal();
  router.push('/login');
}

function retry() {
  closeModal();
  window.location.reload();
}
</script>

<style scoped lang="scss">
@use '../../styles/_variables.scss' as *;

.error-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.error-modal {
  background: $white;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease;

  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .modal-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 24px 24px 0 24px;
    position: relative;

    .error-icon {
      font-size: 32px;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba($error, 0.1);
      border-radius: 12px;
      flex-shrink: 0;
    }

    .modal-title {
      margin: 0;
      color: $black;
      font-size: 20px;
      font-weight: 600;
      flex: 1;
      line-height: 1.3;
    }

    .close-button {
      background: none;
      border: none;
      font-size: 24px;
      color: $gray-500;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s;

      &:hover {
        background: $gray-100;
        color: $black;
      }
    }
  }

  .modal-content {
    padding: 20px 24px 24px 24px;

    .error-details {
      margin: 0 0 16px 0;
      color: $gray-700;
      font-size: 15px;
      line-height: 1.5;
      background: $gray-50;
      padding: 12px;
      border-radius: 8px;
      border-left: 4px solid $error;
    }

    .error-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 20px;
      padding: 8px 12px;
      background: $gray-100;
      border-radius: 6px;

      .meta-label {
        font-size: 12px;
        color: $gray-600;
        font-weight: 500;
        text-transform: uppercase;
      }

      .meta-value {
        font-size: 12px;
        color: $black;
        font-family: monospace;
      }
    }

    .error-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      flex-wrap: wrap;

      @media (max-width: 480px) {
        flex-direction: column;
      }
    }
  }
}
</style> 