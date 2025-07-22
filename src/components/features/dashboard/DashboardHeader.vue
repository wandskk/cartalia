<template>
  <div class="dashboard-header">
    <div class="header-content">
      <h1>Bem-vindo(a) ao Cartália</h1>
      <p>Gerencie sua coleção de cartas e descubra novas trocas no marketplace</p>
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
  margin-bottom: 3rem;
  text-align: center;

  @media (max-width: 768px) {
    margin-bottom: 2.5rem;
  }

  @media (max-width: 480px) {
    margin-bottom: 2rem;
  }

  .header-content {
    max-width: 600px;
    margin: 0 auto;

    h1 {
      margin: 0 0 1rem 0;
      color: #1e293b;
      font-size: 3rem;
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;

      @media (max-width: 1024px) {
        font-size: 2.5rem;
      }

      @media (max-width: 768px) {
        font-size: 2.25rem;
        margin-bottom: 0.75rem;
      }

      @media (max-width: 480px) {
        font-size: 2rem;
        margin-bottom: 0.5rem;
      }
    }

    p {
      margin: 0;
      color: #64748b;
      font-size: 1.25rem;
      line-height: 1.6;
      font-weight: 400;

      @media (max-width: 768px) {
        font-size: 1.125rem;
        line-height: 1.5;
      }

      @media (max-width: 480px) {
        font-size: 1rem;
        line-height: 1.4;
      }
    }
  }
}
</style> 
