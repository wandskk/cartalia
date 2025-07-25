<template>
  <v-btn
    icon
    variant="text"
    size="small"
    class="hamburger-btn d-none d-md-none d-lg-none"
    @click="$emit('toggle')"
    :title="isOpen ? 'Fechar menu' : 'Abrir menu'"
  >
    <div class="hamburger-icon" :class="{ 'is-active': isOpen }">
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </div>
  </v-btn>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean;
}

defineProps<Props>();
defineEmits<{
  toggle: [];
}>();
</script>

<style scoped lang="scss">
@use "../../styles/_variables.scss" as *;

.hamburger-icon {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 20px;
  height: 20px;
  position: relative;
}

.hamburger-line {
  width: 100%;
  height: 2px;
  background: $gray-700;
  border-radius: 1px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.hamburger-icon.is-active {
  .hamburger-line {
    &:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }

    &:nth-child(2) {
      opacity: 0;
    }

    &:nth-child(3) {
      transform: rotate(-45deg) translate(5px, -5px);
    }
  }
}
</style> 