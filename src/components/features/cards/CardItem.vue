<template>
  <div class="card-item" @click="handleClick">
    <div class="card-image">
      <img :src="card.imageUrl" :alt="card.name" @error="handleImageError" />
    </div>
    <div class="card-content">
      <h3 class="card-name">{{ card.name }}</h3>
      <p class="card-description">{{ truncatedDescription }}</p>
      <div class="card-meta">
        <span class="card-date">{{ formattedDate }}</span>
      </div>
    </div>
    <div v-if="selectable" class="card-selection">
      <input 
        type="checkbox" 
        :checked="isSelected" 
        @change="handleSelection"
        @click.stop
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Card } from '../../../types';

interface Props {
  card: Card;
  selectable?: boolean;
  selected?: boolean;
  clickable?: boolean;
}

interface Emits {
  (e: 'click', card: Card): void;
  (e: 'select', card: Card, selected: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
  selectable: false,
  selected: false,
  clickable: true
});

const emit = defineEmits<Emits>();

const truncatedDescription = computed(() => {
  if (props.card.description.length <= 100) {
    return props.card.description;
  }
  return props.card.description.substring(0, 100) + '...';
});

const formattedDate = computed(() => {
  return new Date(props.card.createdAt).toLocaleDateString('pt-BR');
});

const isSelected = computed(() => props.selected);

function handleClick() {
  if (props.clickable) {
    emit('click', props.card);
  }
}

function handleSelection(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('select', props.card, target.checked);
}

function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement;
  target.src = '/placeholder-card.jpg';
}
</script>

<style scoped lang="scss">
@use '../../../styles/_variables.scss' as *;

.card-item {
  background: $white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  .card-image {
    width: 100%;
    height: 200px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    &:hover img {
      transform: scale(1.05);
    }
  }

  .card-content {
    padding: 16px;

    .card-name {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 600;
      color: $black;
      line-height: 1.2;
    }

    .card-description {
      margin: 0 0 12px 0;
      font-size: 14px;
      color: $gray-600;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-meta {
      .card-date {
        font-size: 12px;
        color: $gray-500;
      }
    }
  }

  .card-selection {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 4px;
    padding: 4px;

    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }
  }
}
</style> 
