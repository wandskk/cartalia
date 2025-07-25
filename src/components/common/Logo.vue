<template>
  <div class="logo">
    <div class="logo-icon">
      <v-icon size="32" color="primary">mdi-cards</v-icon>
    </div>
    <div class="logo-text">
      <span class="logo-title">Cartália</span>
      <span class="logo-subtitle">Trading Cards</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// Componente de logo
</script>

<style scoped lang="scss">
@use "sass:color";
.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: inherit;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, $primary 0%, color.adjust($primary, $lightness: -10%) 100%);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba($primary, 0.3);
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.logo-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: $gray-900;
  letter-spacing: -0.025em;
}

.logo-subtitle {
  font-size: 0.75rem;
  font-weight: 500;
  color: $gray-600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

@media (max-width: 768px) {
  .logo {
    gap: 0.5rem;
  }

  .logo-icon {
    width: 32px;
    height: 32px;
  }

  .logo-title {
    font-size: 1.125rem;
  }

  .logo-subtitle {
    font-size: 0.6875rem;
  }
}
</style> 
