<template>
  <BaseModal v-model="showModal">
    <div class="delete-confirmation">
      <div class="confirmation-icon">⚠️</div>
      <h3>Confirmar Exclusão</h3>
      <p>Tem certeza que deseja excluir esta troca? Esta ação não pode ser desfeita.</p>
      
      <div class="confirmation-actions">
        <BaseButton @click="handleCancel" color="secondary" variant="outline">
          Cancelar
        </BaseButton>
        <BaseButton @click="handleConfirm" color="error" :loading="loading">
          Excluir Troca
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BaseModal from '../../common/BaseModal.vue';
import BaseButton from '../../common/BaseButton.vue';

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