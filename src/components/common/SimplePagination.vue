<template>
  <div v-if="totalPages > 1" class="d-flex align-center justify-center ga-4 py-4">
    <v-btn
      :disabled="currentPage === 1 || loading"
      variant="outlined"
      size="small"
      @click="handlePageChange(currentPage - 1)"
    >
      <v-icon class="mr-1">mdi-chevron-left</v-icon>
      Anterior
    </v-btn>

    <div class="text-body-2 text-grey font-weight-medium min-width-100 text-center">
      Página {{ currentPage }}
    </div>

    <v-btn
      :disabled="currentPage === totalPages || loading"
      variant="outlined"
      size="small"
      @click="handlePageChange(currentPage + 1)"
    >
      Próxima
      <v-icon class="ml-1">mdi-chevron-right</v-icon>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  loading?: boolean;
}

interface Emits {
  (e: "page-change", page: number): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
});
const emit = defineEmits<Emits>();

const totalPages = computed(() =>
  Math.ceil(props.totalItems / props.itemsPerPage)
);

function handlePageChange(page: number) {
  if (page >= 1 && page <= totalPages.value && page !== props.currentPage && !props.loading) {
    emit("page-change", page);
  }
}
</script>

<style scoped>
@media (max-width: 768px) {
  .d-flex {
    gap: 12px;
  }
  
  .text-body-2 {
    min-width: 80px;
  }
}
</style>
