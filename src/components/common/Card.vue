<template>
  <div 
    class="card" 
    :class="[
      `card-${size}`,
      `card-${variant}`,
      { 
        'card-selectable': selectable,
        'card-selected': selected,
        'card-clickable': clickable,
        'card-loading': loading
      }
    ]"
    @click="handleClick"
  >
    <div class="card-image">
      <img 
        :src="card.imageUrl" 
        :alt="card.name" 
        @error="handleImageError"
        :class="{ 'card-image-loading': loading }"
      />
      
      <div v-if="selectable" class="card-selection">
        <input 
          type="checkbox" 
          :checked="selected" 
          @change="handleSelection"
          @click.stop
        />
      </div>

      <div v-if="loading" class="card-loading-overlay">
        <div class="loading-spinner"></div>
      </div>
    </div>

    <div class="card-content">
                  <div class="card-header">
              <h3 class="card-name">{{ card.name }}</h3>
            </div>
      
      <p v-if="showDescription" class="card-description">
        {{ truncatedDescription }}
      </p>

      <div v-if="showActions && $slots.actions" class="card-actions">
        <slot name="actions" :card="card" />
      </div>
    </div>

    <slot name="overlay" :card="card" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Card as CardType } from '../../types';

interface Props {
  card: CardType;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact' | 'detailed';
  selectable?: boolean;
  selected?: boolean;
  clickable?: boolean;
  loading?: boolean;
  showDescription?: boolean;
  showActions?: boolean;
  maxDescriptionLength?: number;
}

interface Emits {
  (e: 'click', card: CardType): void;
  (e: 'select', card: CardType, selected: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'default',
  selectable: false,
  selected: false,
  clickable: false,
  loading: false,
  showDescription: true,
  showActions: false,
  maxDescriptionLength: 100
});

const emit = defineEmits<Emits>();



const truncatedDescription = computed(() => {
  if (!props.showDescription) return '';
  
  const description = props.card.description;
  if (description.length <= props.maxDescriptionLength) {
    return description;
  }
  return description.substring(0, props.maxDescriptionLength) + '...';
});

function handleClick() {
  if (props.clickable && !props.loading) {
    emit('click', props.card);
  }
}

function handleSelection(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('select', props.card, target.checked);
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = '/placeholder-card.jpg';
}
</script>

<style scoped lang="scss">
@use '../../styles/_variables.scss' as *;

.card {
  background: $white;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  border: 1px solid $gray-200;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  &.card-clickable {
    cursor: pointer;

    &:hover {
      border-color: $primary;
    }
  }

  &.card-selectable {
    cursor: pointer;

    &:hover {
      border-color: $primary;
    }
  }

  &.card-selected {
    border-color: $primary;
    background: rgba($primary, 0.05);
    box-shadow: 0 0 0 2px rgba($primary, 0.2);
  }

  &.card-loading {
    pointer-events: none;
    opacity: 0.7;
  }

  .card-image {
    position: relative;
    width: 100%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.3s ease;

      &.card-image-loading {
        opacity: 0.5;
      }
    }

    .card-selection {
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 2;

      input[type="checkbox"] {
        width: 20px;
        height: 20px;
        accent-color: $primary;
        cursor: pointer;
      }
    }

    .card-loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba($white, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;

      .loading-spinner {
        width: 24px;
        height: 24px;
        border: 2px solid $gray-200;
        border-top: 2px solid $primary;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
    }
  }

  .card-content {
    padding: 16px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;

      .card-name {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: $black;
        line-height: 1.3;
        flex: 1;
        min-width: 0;
      }


    }

    .card-description {
      margin: 0;
      font-size: 14px;
      color: $gray-600;
      line-height: 1.4;
    }

    .card-actions {
      margin-top: 12px;
      display: flex;
      gap: 8px;
    }
  }

  // Tamanhos
  &.card-sm {
    .card-image {
      height: 120px;
    }

    .card-content {
      padding: 12px;

      .card-header .card-name {
        font-size: 14px;
      }

      .card-description {
        font-size: 12px;
      }
    }
  }

  &.card-md {
    .card-image {
      height: 200px;
    }
  }

  &.card-lg {
    .card-image {
      height: 280px;
    }

    .card-content {
      padding: 20px;

      .card-header .card-name {
        font-size: 18px;
      }

      .card-description {
        font-size: 15px;
      }
    }
  }

  // Variantes
  &.card-compact {
    .card-content {
      padding: 12px;

      .card-header {
        margin-bottom: 4px;

        .card-name {
          font-size: 14px;
        }


      }

      .card-description {
        font-size: 12px;
      }
    }
  }

  &.card-detailed {
    .card-content {
      padding: 20px;

      .card-header {
        margin-bottom: 12px;

        .card-name {
          font-size: 18px;
        }


      }

      .card-description {
        font-size: 15px;
        line-height: 1.5;
      }
    }
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .card {
    &.card-md {
      .card-image {
        height: 160px;
      }
    }

    &.card-lg {
      .card-image {
        height: 220px;
      }
    }
  }
}
</style> 
