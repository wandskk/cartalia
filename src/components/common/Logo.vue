<template>
  <div class="logo-section">
    <div class="logo-icon">C</div>
    <div class="logo-text">
      <h3 class="logo-title">Cartália</h3>
      <p class="logo-subtitle">Marketplace</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Componente Logo reutilizável
</script>

<style scoped lang="scss">
@use "../../styles/_variables.scss" as *;

.logo-section {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  flex: 1;
  min-width: 0;
}

.logo-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.125rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  flex-shrink: 0;
}

.logo-text {
  flex: 1;
  min-width: 0;

  .logo-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .logo-subtitle {
    margin: 0;
    font-size: 0.75rem;
    color: #64748b;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

@media (max-width: 768px) {
  .logo-section {
    gap: 0.75rem;
  }

  .logo-icon {
    width: 2.25rem;
    height: 2.25rem;
    font-size: 1rem;
  }

  .logo-text {
    .logo-title {
      font-size: 1.125rem;
    }

    .logo-subtitle {
      font-size: 0.6875rem;
    }
  }
}

@media (max-width: 480px) {
  .logo-icon {
    width: 2rem;
    height: 2rem;
    font-size: 0.9375rem;
  }

  .logo-text {
    .logo-title {
      font-size: 1rem;
    }
  }
}
</style> 
