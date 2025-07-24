<template>
  <div v-if="totalPages > 1" class="simple-pagination">
    <button
      class="pagination-btn"
      :class="{ disabled: currentPage === 1 || loading }"
      :disabled="currentPage === 1 || loading"
      @click="handlePageChange(currentPage - 1)"
    >
      <span class="pagination-icon">‹</span>
      Anterior
    </button>

    <div class="page-info">Página {{ currentPage }}</div>

    <button
      class="pagination-btn"
      :class="{ disabled: currentPage === totalPages || loading }"
      :disabled="currentPage === totalPages || loading"
      @click="handlePageChange(currentPage + 1)"
    >
      Próxima
      <span class="pagination-icon">›</span>
    </button>
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

<style scoped lang="scss">
@use "../../styles/_variables.scss" as *;

.simple-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px 0;

  .pagination-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border: 1px solid $gray-300;
    border-radius: 8px;
    background: $white;
    color: $gray-700;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(.disabled) {
      background: $gray-50;
      border-color: $gray-400;
      color: $gray-900;
    }

    &:active:not(.disabled) {
      transform: translateY(1px);
    }

    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: $gray-100;
      color: $gray-500;
    }

    .pagination-icon {
      font-size: 16px;
      font-weight: bold;
    }
  }

  .page-info {
    font-size: 14px;
    color: $gray-600;
    font-weight: 500;
    min-width: 100px;
    text-align: center;
  }
}

@media (max-width: 768px) {
  .simple-pagination {
    gap: 12px;

    .pagination-btn {
      padding: 6px 12px;
      font-size: 13px;

      .pagination-icon {
        font-size: 14px;
      }
    }

    .page-info {
      font-size: 13px;
      min-width: 80px;
    }
  }
}
</style>
