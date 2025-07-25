<template>
  <v-card 
    :class="[
      'stat-card',
      variant,
      { 'with-icon': icon }
    ]"
    elevation="2"
    class="pa-6 d-flex align-center ga-4"
  >
    <v-avatar 
      v-if="icon" 
      size="48" 
      color="primary" 
      class="flex-shrink-0"
    >
      <span style="font-size: 24px;">{{ icon }}</span>
    </v-avatar>
    
    <div class="flex-grow-1">
      <div class="text-h4 font-weight-bold mb-1">{{ number }}</div>
      <div class="text-caption text-grey text-uppercase font-weight-medium letter-spacing-1">{{ label }}</div>
    </div>
  </v-card>
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

<style scoped>
.stat-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12) !important;
  border-color: rgba(var(--v-theme-primary), 0.2);
}

.stat-card.primary {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgba(var(--v-theme-primary), 0.9) 100%) !important;
  color: white;
}

.stat-card.primary .text-h4,
.stat-card.primary .text-caption {
  color: white !important;
}

.stat-card.primary .v-avatar {
  background: rgba(255, 255, 255, 0.2) !important;
}

.stat-card.secondary {
  background: linear-gradient(135deg, rgb(var(--v-theme-grey-lighten-4)) 0%, white 100%) !important;
  border: 1px solid rgb(var(--v-theme-grey-lighten-2));
}

.stat-card.default {
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
  .stat-card {
    padding: 20px !important;
    gap: 12px !important;
  }
  
  .stat-card .v-avatar {
    width: 40px !important;
    height: 40px !important;
  }
  
  .stat-card .text-h4 {
    font-size: 24px !important;
  }
}

@media (max-width: 480px) {
  .stat-card {
    padding: 16px !important;
    gap: 10px !important;
  }
  
  .stat-card .v-avatar {
    width: 36px !important;
    height: 36px !important;
  }
  
  .stat-card .text-h4 {
    font-size: 20px !important;
  }
}
</style> 