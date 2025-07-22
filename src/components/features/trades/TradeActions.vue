<template>
  <div class="trade-actions">
    <div class="actions-menu">
      <button 
        @click="toggleMenu"
        class="menu-trigger"
        type="button"
        :aria-expanded="isMenuOpen"
      >
        <span class="dots">•••</span>
      </button>
      
      <div v-if="isMenuOpen" class="menu-dropdown">
        <button 
          @click="handleEdit"
          class="menu-item"
          type="button"
        >
          <span class="icon">✏️</span>
          Editar
        </button>
        
        <button 
          @click="handleDelete"
          class="menu-item delete"
          type="button"
        >
          <span class="icon">🗑️</span>
          Deletar
        </button>
      </div>
    </div>

    <div v-if="isMenuOpen" class="menu-overlay" @click="closeMenu"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Emits {
  (e: 'edit'): void;
  (e: 'delete'): void;
}

const emit = defineEmits<Emits>();

const isMenuOpen = ref(false);

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

function closeMenu() {
  isMenuOpen.value = false;
}

function handleEdit() {
  closeMenu();
  emit('edit');
}

function handleDelete() {
  closeMenu();
  if (confirm('Tem certeza que deseja deletar esta troca?')) {
    emit('delete');
  }
}

function handleClickOutside(event: Event) {
  const target = event.target as Element;
  if (!target.closest('.trade-actions')) {
    closeMenu();
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped lang="scss">
@use '../../../styles/_variables.scss' as *;

.trade-actions {
  position: relative;

  .actions-menu {
    position: relative;

    .menu-trigger {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 4px;
      transition: background-color 0.2s;

      &:hover {
        background: $gray-100;
      }

      .dots {
        font-size: 16px;
        color: $gray-600;
        font-weight: bold;
        line-height: 1;
      }
    }

    .menu-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      background: $white;
      border: 1px solid $gray-200;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      min-width: 140px;
      overflow: hidden;

      .menu-item {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        padding: 12px 16px;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 14px;
        color: $black;
        transition: background-color 0.2s;

        &:hover {
          background: $gray-50;
        }

        &.delete {
          color: $error;

          &:hover {
            background: rgba($error, 0.1);
          }
        }

        .icon {
          font-size: 16px;
        }
      }
    }
  }

  .menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
  }
}
</style> 