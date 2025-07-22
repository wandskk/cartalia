<template>
  <router-link to="/marketplace" class="logo">
    <div class="logo-content">
      <div class="logo-icon">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="6" width="12" height="20" rx="2" fill="#6366F1" stroke="#4F46E5" stroke-width="1"/>
          <rect x="3" y="9" width="10" height="6" rx="1" fill="#FFFFFF" opacity="0.9"/>
          <rect x="3" y="17" width="7" height="1.5" rx="0.5" fill="#FFFFFF" opacity="0.7"/>
          <rect x="3" y="20" width="5" height="1.5" rx="0.5" fill="#FFFFFF" opacity="0.5"/>
          <rect x="6" y="4" width="12" height="20" rx="2" fill="#8B5CF6" stroke="#7C3AED" stroke-width="1"/>
          <rect x="7" y="7" width="10" height="6" rx="1" fill="#FFFFFF" opacity="0.9"/>
          <rect x="7" y="15" width="7" height="1.5" rx="0.5" fill="#FFFFFF" opacity="0.7"/>
          <rect x="7" y="18" width="5" height="1.5" rx="0.5" fill="#FFFFFF" opacity="0.5"/>
          <path d="M14 16 L17 16 M15.5 14.5 L17 16 L15.5 17.5" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <span class="logo-text">Cartália</span>
    </div>
  </router-link>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
@use '../../styles/_variables.scss' as *;

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
}

.logo-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: $gray-900;
  letter-spacing: 0.5px;
  font-family: 'Inter', system-ui, sans-serif;
}

@media (max-width: 768px) {
  .logo-text {
    font-size: 1.1rem;
  }
}
</style> 
