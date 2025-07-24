<template>
  <div 
    class="stat-card" 
    :class="[
      variant,
      { 'with-icon': icon }
    ]"
  >
    <div v-if="icon" class="stat-icon">
      <span class="icon">{{ icon }}</span>
    </div>
    <div class="stat-content">
      <span class="stat-number">{{ number }}</span>
      <span class="stat-label">{{ label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  number: number | string;
  label: string;
  icon?: string;
  variant?: 'default' | 'primary' | 'secondary';
}

withDefaults(defineProps<Props>(), {
  variant: 'default'
});
</script>

<style scoped lang="scss">
@use '../../styles/_variables.scss' as *;

.stat-card {
  background: $white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba($primary, 0.1);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 16px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    border-color: rgba($primary, 0.2);
  }

  &.primary {
    background: linear-gradient(
      135deg,
      $primary 0%,
      color-mix(in srgb, $primary 90%, black) 100%
    );
    color: $white;

    .stat-number {
      color: $white;
    }

    .stat-label {
      color: rgba(255, 255, 255, 0.9);
    }

    .stat-icon {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  &.secondary {
    background: linear-gradient(135deg, $gray-100 0%, $white 100%);
    border: 1px solid $gray-200;
  }

  &.default {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: linear-gradient(135deg, $primary 0%, color-mix(in srgb, $primary 85%, white) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    .icon {
      font-size: 24px;
    }
  }

  .stat-content {
    flex: 1;

    .stat-number {
      display: block;
      font-size: 32px;
      font-weight: 700;
      color: $black;
      line-height: 1;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 14px;
      color: $gray-600;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }

  @media (max-width: 768px) {
    padding: 20px;
    gap: 12px;

    .stat-icon {
      width: 40px;
      height: 40px;

      .icon {
        font-size: 20px;
      }
    }

    .stat-content .stat-number {
      font-size: 24px;
    }
  }

  @media (max-width: 480px) {
    padding: 16px;
    gap: 10px;

    .stat-icon {
      width: 36px;
      height: 36px;

      .icon {
        font-size: 18px;
      }
    }

    .stat-content .stat-number {
      font-size: 20px;
    }
  }
}
</style> 