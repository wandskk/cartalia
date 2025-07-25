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
import { ref } from 'vue';

interface Emits {
  (e: 'delete'): void;
}

const emit = defineEmits<Emits>();

function handleDelete() {
  if (confirm('Tem certeza que deseja deletar esta troca?')) {
    emit('delete');
  }
}
</script> 
