<template>
  <PageHeader 
    :title="title"
    :subtitle="subtitle"
  >
    <template #actions>
      <BaseButton @click="$emit('add-cards')" color="primary" class="add-button">
        <span class="button-icon">+</span>
        {{ buttonText }}
      </BaseButton>
    </template>
  </PageHeader>
</template>

<script setup lang="ts">
import BaseButton from '../../common/BaseButton.vue';
import PageHeader from '../../common/PageHeader.vue';

interface Props {
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

interface Emits {
  (e: 'add-cards'): void;
}

withDefaults(defineProps<Props>(), {
  title: 'Minhas Cartas',
  subtitle: 'Gerencie sua coleção de cartas',
  buttonText: 'Adicionar Cartas'
});

defineEmits<Emits>();
</script>

<style scoped lang="scss">
@use '../../../styles/_variables.scss' as *;

.add-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.3s ease;

  .button-icon {
    font-size: 18px;
    font-weight: 700;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
}
</style> 