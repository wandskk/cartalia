<template>
  <v-dialog v-model="showModal" max-width="400" persistent>
    <v-card>
      <v-card-text class="d-flex flex-column align-center text-center pa-6">
        <v-icon size="48" color="warning" class="mb-4">mdi-alert-circle</v-icon>
        <h3 class="text-h5 font-weight-bold mb-3">Confirmar Exclusão</h3>
        <p class="text-body-1 text-grey mb-6">Tem certeza que deseja excluir esta troca? Esta ação não pode ser desfeita.</p>
        
        <div class="d-flex flex-wrap justify-center ga-3">
          <v-btn @click="handleCancel" color="secondary" variant="outlined">
            Cancelar
          </v-btn>
          <v-btn @click="handleConfirm" color="error" variant="elevated" :loading="loading" prepend-icon="mdi-delete">
            Excluir Troca
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: boolean;
  loading?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
});

const emit = defineEmits<Emits>();

const showModal = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

function handleConfirm() {
  emit('confirm');
}

function handleCancel() {
  emit('cancel');
}
</script>

<style scoped lang="scss">
@use '../../../styles/_variables.scss' as *;

.delete-confirmation {
  padding: 24px;
  text-align: center;

  .confirmation-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  h3 {
    margin: 0 0 12px 0;
    color: $black;
    font-size: 20px;
    font-weight: 600;
  }

  p {
    margin: 0 0 24px 0;
    color: $gray-600;
    font-size: 16px;
    line-height: 1.5;
  }

  .confirmation-actions {
    display: flex;
    gap: 12px;
    justify-content: center;

    @media (max-width: 480px) {
      flex-direction: column;
    }
  }
}
</style> 