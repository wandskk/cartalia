<template>
  <div class="page-header">
    <div class="header-content">
      <h1>{{ title }}</h1>
      <p>{{ subtitle }}</p>
    </div>
    
    <div v-if="$slots.actions" class="header-actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  subtitle: string;
}

defineProps<Props>();
</script>

<style scoped lang="scss">
@use '../../styles/_variables.scss' as *;

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 24px;

  .header-content {
    flex: 1;

    h1 {
      margin: 0 0 8px 0;
      color: $black;
      font-size: 36px;
      font-weight: 700;
      background: linear-gradient(135deg, $primary 0%, color-mix(in srgb, $primary 90%, black) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    p {
      margin: 0;
      color: $gray-600;
      font-size: 18px;
      line-height: 1.5;
    }
  }

  .header-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      width: 100%;
      justify-content: center;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    align-items: stretch;

    .header-content {
      h1 {
        font-size: 28px;
      }

      p {
        font-size: 16px;
      }
    }
  }
}
</style> 