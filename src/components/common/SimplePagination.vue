<template>
  <div v-if="totalPages > 1 && totalItems > 0" class="pagination-container">
    <v-btn
      :disabled="currentPage === 1 || loading"
      variant="outlined"
      :size="isMobile ? 'default' : 'small'"
      @click="handlePageChange(currentPage - 1)"
    >
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>

    <div class="pagination-text">
      {{ currentPage }} / {{ totalPages }}
    </div>

    <v-btn
      :disabled="currentPage === totalPages || loading"
      variant="outlined"
      :size="isMobile ? 'default' : 'small'"
      @click="handlePageChange(currentPage + 1)"
    >
      <v-icon>mdi-chevron-right</v-icon>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";

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

const isMobile = ref(false);

const totalPages = computed(() => {
  return Math.ceil(props.totalItems / props.itemsPerPage);
});

function handlePageChange(page: number) {
  if (page >= 1 && page <= totalPages.value && page !== props.currentPage && !props.loading) {
    emit("page-change", page);
  }
}

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});
</script>

<style scoped>
.pagination-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px 0;
}

.pagination-text {
  font-weight: 500;
  min-width: 60px;
  text-align: center;
}

@media (max-width: 768px) {
  .pagination-container {
    gap: 12px;
    padding: 12px 0;
  }
  
  .pagination-text {
    font-size: 14px;
    min-width: 50px;
  }
}
</style>
