<template>
  <div class="dashboard-header">
    <div class="header-content">
      <h1>Bem-vindo ao Cartalia!</h1>
      <p>Gerencie suas cartas e faça trocas no marketplace.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'DashboardHeader'
});
</script>

<style scoped lang="scss">
@use "../../../styles/_variables.scss" as *;

.dashboard-header {
  margin-bottom: 32px;

  .header-content {
    h1 {
      margin: 0 0 16px 0;
      color: $black;
      font-size: 2.5rem;
      font-weight: 700;
      line-height: 1.2;
    }

    p {
      margin: 0;
      color: $gray-600;
      font-size: 1.125rem;
      line-height: 1.5;
    }
  }
}
</style> 
