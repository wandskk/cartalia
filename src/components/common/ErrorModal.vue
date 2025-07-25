<template>
  <BaseModal
    v-model="isOpen"
    title="Erro"
    size="md"
    :show-close-button="true"
    :persistent="true"
  >
    <div class="d-flex flex-column align-center text-center pa-6">
      <v-icon size="48" color="error" class="mb-4">mdi-alert-circle</v-icon>
      <div class="text-center max-width-400">
        <h3 class="text-h6 font-weight-bold mb-3">{{ errorStore.currentError?.message || 'Ocorreu um erro' }}</h3>
        <p class="text-body-1 text-grey">
          {{ errorStore.currentError?.details || 'Algo deu errado. Tente novamente.' }}
        </p>
      </div>
    </div>

    <template #footer>
      <div class="d-flex justify-center ga-3">
        <v-btn
          @click="handleRetry"
          color="primary"
          variant="elevated"
          :loading="loading"
          prepend-icon="mdi-refresh"
        >
          Tentar Novamente
        </v-btn>
        <v-btn
          @click="handleClose"
          variant="outlined"
          prepend-icon="mdi-close"
        >
          Fechar
        </v-btn>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useErrorStore } from '../../stores/error';
import BaseModal from './BaseModal.vue';

const errorStore = useErrorStore();
const loading = ref(false);

const isOpen = computed({
  get: () => errorStore.isErrorModalOpen,
  set: (value) => {
    if (!value) {
      errorStore.closeErrorModal();
    }
  }
});

const handleRetry = async () => {
  loading.value = true;
  try {
    window.location.reload();
  } catch (error) {
    console.error('Retry failed:', error);
  } finally {
    loading.value = false;
  }
};

const handleClose = () => {
  errorStore.closeErrorModal();
};
</script>

<style scoped lang="scss">
.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem 0;
}

.error-icon {
  margin-bottom: 1rem;
}

.error-message {
  max-width: 400px;
}

.error-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: $gray-900;
  margin-bottom: 0.5rem;
}

.error-description {
  font-size: 1rem;
  color: $gray-600;
  line-height: 1.5;
}

.error-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  width: 100%;
}
</style> 
