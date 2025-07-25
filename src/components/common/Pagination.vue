<template>
  <div v-if="totalPages > 1" class="d-flex justify-center py-4 mt-2 border-t">
    <v-pagination
      v-model="internalPage"
      :length="totalPages"
      :total-visible="maxVisiblePages"
      color="primary"
      @update:model-value="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';

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
const internalPage = ref(props.currentPage);

watch(() => props.currentPage, (val) => {
  internalPage.value = val;
});

function handlePageChange(page: number) {
  if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
    emit('page-change', page);
  }
}
</script>

<style scoped>
.d-flex {
  display: flex;
}
.justify-center {
  justify-content: center;
}
.py-4 {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}
.mt-2 {
  margin-top: 0.5rem;
}
.border-t {
  border-top: 1px solid #e5e7eb;
}
</style> 