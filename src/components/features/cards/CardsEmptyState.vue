<template>
  <div class="cards-empty-state">
    <div class="empty-content">
      <div class="empty-icon-wrapper">
        <v-icon size="64" color="grey-lighten-1" class="empty-icon">mdi-cards</v-icon>
      </div>
      <h3 class="empty-title">Nenhuma carta encontrada</h3>
      <p class="empty-description">
        Parece que não há cartas disponíveis no momento. Tente ajustar os filtros
        ou volte mais tarde.
      </p>
      <div class="empty-actions">
        <v-btn
          color="primary"
          variant="outlined"
          size="large"
          class="action-btn"
          @click="clearFilters"
        >
          <v-icon left>mdi-filter-remove</v-icon>
          Limpar Filtros
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Emits {
  (e: 'clear-filters'): void;
}

const emit = defineEmits<Emits>();

function clearFilters() {
  emit('clear-filters');
}
</script>

<style scoped lang="scss">
@use "../../../styles/_variables.scss" as *;

.cards-empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  min-height: 300px;
}

.empty-content {
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.empty-icon-wrapper {
  margin-bottom: 24px;
}

.empty-icon {
  opacity: 0.6;
  transition: all 0.3s ease;
}

.empty-title {
  margin: 0 0 16px 0;
  color: rgba(0, 0, 0, 0.87);
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
}

.empty-description {
  margin: 0 0 32px 0;
  color: rgba(0, 0, 0, 0.6);
  font-size: 16px;
  line-height: 1.5;
}

.empty-actions {
  display: flex;
  justify-content: center;
}

.action-btn {
  min-width: 160px;
  height: 48px;
  font-weight: 500;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .cards-empty-state {
    padding: 40px 16px;
    min-height: 250px;
  }
  
  .empty-icon-wrapper {
    margin-bottom: 20px;
  }
  
  .empty-title {
    font-size: 22px;
    margin-bottom: 12px;
  }
  
  .empty-description {
    font-size: 15px;
    margin-bottom: 28px;
  }
  
  .action-btn {
    min-width: 140px;
    height: 44px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .cards-empty-state {
    padding: 32px 12px;
    min-height: 200px;
  }
  
  .empty-icon {
    font-size: 56px !important;
  }
  
  .empty-title {
    font-size: 20px;
    margin-bottom: 10px;
  }
  
  .empty-description {
    font-size: 14px;
    margin-bottom: 24px;
  }
  
  .action-btn {
    min-width: 120px;
    height: 40px;
    font-size: 13px;
  }
}

@media (max-width: 360px) {
  .cards-empty-state {
    padding: 24px 8px;
  }
  
  .empty-icon {
    font-size: 48px !important;
  }
  
  .empty-title {
    font-size: 18px;
  }
  
  .empty-description {
    font-size: 13px;
  }
}
</style>
