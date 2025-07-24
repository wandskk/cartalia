<template>
  <div v-if="totalPages > 1" class="pagination">
    <button
      class="pagination-btn"
      :class="{ disabled: currentPage === 1 }"
      :disabled="currentPage === 1"
      @click="handlePageChange(currentPage - 1)"
    >
      <span class="pagination-icon">‹</span>
      Anterior
    </button>

    <div class="pagination-pages">
      <button
        v-for="page in visiblePages"
        :key="page"
        class="pagination-page"
        :class="{ active: page === currentPage, ellipsis: page === '...' }"
        :disabled="page === '...'"
        @click="typeof page === 'number' && handlePageChange(page)"
      >
        {{ page }}
      </button>
    </div>

    <button
      class="pagination-btn"
      :class="{ disabled: currentPage === totalPages }"
      :disabled="currentPage === totalPages"
      @click="handlePageChange(currentPage + 1)"
    >
      Próxima
      <span class="pagination-icon">›</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  maxVisiblePages?: number;
}

interface Emits {
  (e: 'page-change', page: number): void;
}

const props = withDefaults(defineProps<Props>(), {
  maxVisiblePages: 5
});

const emit = defineEmits<Emits>();

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage));

const visiblePages = computed(() => {
  if (totalPages.value <= props.maxVisiblePages) {
    return Array.from({ length: totalPages.value }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [];
  const halfVisible = Math.floor(props.maxVisiblePages / 2);

  if (props.currentPage <= halfVisible + 1) {
    for (let i = 1; i <= props.maxVisiblePages - 1; i++) {
      pages.push(i);
    }
    pages.push('...');
    pages.push(totalPages.value);
  } else if (props.currentPage >= totalPages.value - halfVisible) {
    pages.push(1);
    pages.push('...');
    for (let i = totalPages.value - (props.maxVisiblePages - 2); i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    pages.push('...');
    for (let i = props.currentPage - halfVisible; i <= props.currentPage + halfVisible; i++) {
      pages.push(i);
    }
    pages.push('...');
    pages.push(totalPages.value);
  }

  return pages;
});

function handlePageChange(page: number) {
  if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
    emit('page-change', page);
  }
}
</script>

<style scoped lang="scss">
@use '../../styles/_variables.scss' as *;

.pagination {
  display: flex;  
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 0;
  margin-top: 16px;
  border-top: 1px solid $gray-200;

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

  .pagination-pages {
    display: flex;
    align-items: center;
    gap: 4px;

    .pagination-page {
      min-width: 36px;
      height: 36px;
      padding: 0 8px;
      border: 1px solid $gray-300;
      border-radius: 6px;
      background: $white;
      color: $gray-700;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover:not(.disabled) {
        background: $gray-50;
        border-color: $gray-400;
        color: $gray-900;
      }

      &:active:not(.disabled) {
        transform: translateY(1px);
      }

      &.active {
        background: $primary;
        border-color: $primary;
        color: $white;
        font-weight: 600;

        &:hover {
          background: color-mix(in srgb, $primary 90%, black);
        }
      }

      &.ellipsis {
        border: none;
        background: transparent;
        cursor: default;
        min-width: 24px;
        padding: 0 4px;

        &:hover {
          background: transparent;
          color: $gray-700;
        }
      }

      &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background: $gray-100;
        color: $gray-500;
      }
    }
  }
}

@media (max-width: 768px) {
  .pagination {
    gap: 4px;

    .pagination-btn {
      padding: 6px 12px;
      font-size: 13px;

      .pagination-icon {
        font-size: 14px;
      }
    }

    .pagination-pages {
      gap: 2px;

      .pagination-page {
        min-width: 32px;
        height: 32px;
        font-size: 13px;
      }
    }
  }
}
</style> 