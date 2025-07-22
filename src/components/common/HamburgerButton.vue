<template>
  <button
    class="hamburger-btn"
    @click="$emit('toggle')"
    :class="{ 'is-active': isOpen }"
    :title="isOpen ? 'Fechar menu' : 'Abrir menu'"
  >
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
  </button>
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

.hamburger-btn {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  border-radius: 6px;
  transition: background-color 0.2s;

  &:hover {
    background: $gray-100;
  }

  @media (max-width: 768px) {
    display: flex;
  }
}

.hamburger-line {
  width: 100%;
  height: 2px;
  background: $gray-700;
  border-radius: 1px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.hamburger-btn.is-active {
  .hamburger-line {
    &:nth-child(1) {
      transform: rotate(45deg) translate(6px, 6px);
    }

    &:nth-child(2) {
      opacity: 0;
    }

    &:nth-child(3) {
      transform: rotate(-45deg) translate(6px, -6px);
    }
  }
}
</style> 