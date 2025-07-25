<template>
  <v-card
    class="card-preview"
    variant="outlined"
    hover
    :clickable="clickable"
    @click="handleClick"
  >
    <div class="d-flex align-center pa-3">
      <div class="card-image mr-3">
        <v-img
          :src="card.imageUrl"
          :alt="card.name"
          :width="imageWidth"
          :height="imageHeight"
          class="rounded"
          cover
        />
      </div>
      <div class="flex-grow-1">
        <div class="text-subtitle-2 font-weight-medium mb-1">
          {{ card.name }}
        </div>
        <div v-if="showDescription" class="text-caption text-grey line-clamp-2">
          {{ truncatedDescription }}
        </div>
        <div v-if="showMeta" class="text-caption text-grey mt-1">
          {{ metaText }}
        </div>
      </div>
      <div v-if="showActions" class="card-actions ml-2">
        <slot name="actions" />
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatDate, truncateText } from '../../utils/formatters';
import type { Card } from '../../types';

interface Props {
  card: Card;
  size?: 'sm' | 'md' | 'lg';
  clickable?: boolean;
  showDescription?: boolean;
  showMeta?: boolean;
  maxDescriptionLength?: number;
  metaText?: string;
  showActions?: boolean;
}

interface Emits {
  (e: 'click', card: Card): void;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  clickable: true,
  showDescription: true,
  showMeta: false,
  maxDescriptionLength: 80,
  showActions: false
});

const emit = defineEmits<Emits>();

const imageWidth = computed(() => {
  switch (props.size) {
    case 'sm': return 40;
    case 'lg': return 64;
    default: return 48;
  }
});

const imageHeight = computed(() => {
  switch (props.size) {
    case 'sm': return 56;
    case 'lg': return 90;
    default: return 68;
  }
});

const truncatedDescription = computed(() => {
  if (!props.showDescription) return '';
  return truncateText(props.card.description, props.maxDescriptionLength);
});

const defaultMetaText = computed(() => {
  if (props.card.createdAt) {
    return formatDate(props.card.createdAt);
  }
  return '';
});

const metaText = computed(() => {
  return props.metaText || defaultMetaText.value;
});

function handleClick() {
  if (props.clickable) {
    emit('click', props.card);
  }
}
</script>

<style scoped>
.card-preview {
  transition: border-color 0.2s ease, transform 0.2s ease;
  cursor: pointer;
}

.card-preview:hover {
  border-color: rgb(var(--v-theme-primary)) !important;
  transform: translateY(-1px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
}

.card-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style> 