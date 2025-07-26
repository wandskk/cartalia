<template>
  <v-fade-transition>
    <v-btn
      v-show="showButton"
      @click="scrollToTop"
      class="back-to-top-btn"
      color="primary"
      variant="elevated"
      size="large"
      :icon="'mdi-chevron-up'"
      :aria-label="'Voltar ao topo'"
    />
  </v-fade-transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const showButton = ref(false);
const scrollThreshold = 300;

function handleScroll() {
  showButton.value = window.scrollY > scrollThreshold;
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.back-to-top-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}

.back-to-top-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .back-to-top-btn {
    bottom: 20px;
    right: 20px;
    width: 52px;
    height: 52px;
  }
}

@media (max-width: 480px) {
  .back-to-top-btn {
    bottom: 16px;
    right: 16px;
    width: 48px;
    height: 48px;
  }
}
</style> 