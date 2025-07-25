<template>
  <div class="trade-actions">
    <v-btn
      @click="handleDelete"
      icon
      variant="text"
      size="small"
      color="error"
      title="Deletar"
    >
      <v-icon>mdi-delete</v-icon>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import type { Trade } from '../../../types';

interface Props {
  trade: Trade;
}

interface Emits {
  (e: 'delete', trade: Trade): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

function handleDelete() {
  if (confirm('Tem certeza que deseja deletar esta troca?')) {
    emit('delete', props.trade);
  }
}
</script> 
