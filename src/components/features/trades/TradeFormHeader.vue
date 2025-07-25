<template>
  <div class="text-center mb-8">
    <h2 class="text-h4 font-weight-bold mb-3">Criar Nova Troca</h2>
    <p class="text-body-1 text-grey">Selecione as cartas que você quer oferecer e as que você quer receber</p>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'TradeFormHeader'
});
</script>

<style scoped lang="scss">
@use "../../../styles/_variables.scss" as *;

.trade-form-header {
  margin-bottom: 32px;
  text-align: center;

  h2 {
    margin: 0 0 12px 0;
    color: $black;
    font-size: 2rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    color: $gray-600;
    font-size: 1.125rem;
    line-height: 1.5;
  }
}
</style> 
