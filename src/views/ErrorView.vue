<template>
  <div class="error-view">
    <Container>
      <div class="error-content">
        <div class="error-icon">
          <span v-if="errorCode === '404'">🔍</span>
          <span v-else-if="errorCode === '500'">⚡</span>
          <span v-else-if="errorCode === '403'">🔒</span>
          <span v-else>❌</span>
        </div>

        <h1 class="error-title">{{ title }}</h1>
        <p class="error-message">{{ message }}</p>

        <div class="error-actions">
          <BaseButton @click="goBack" color="secondary">
            ← Voltar
          </BaseButton>
          
          <BaseButton @click="goHome" color="primary">
            Ir para Home
          </BaseButton>
          
          <BaseButton 
            v-if="errorCode === '500'" 
            @click="retry" 
            color="accent"
          >
            Tentar Novamente
          </BaseButton>
        </div>

        <div v-if="errorCode === '404'" class="error-suggestions">
          <h3>Sugestões:</h3>
          <ul>
            <li>Verifique se o endereço está correto</li>
            <li>Use o menu de navegação para encontrar o que procura</li>
            <li>Volte para a página anterior</li>
          </ul>
        </div>
      </div>
    </Container>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Container from '../components/common/Container.vue';
import BaseButton from '../components/common/BaseButton.vue';

const route = useRoute();
const router = useRouter();

const errorCode = computed(() => route.params.code as string || '404');

const title = computed(() => {
  switch (errorCode.value) {
    case '404':
      return 'Página não encontrada';
    case '500':
      return 'Erro interno do servidor';
    case '403':
      return 'Acesso negado';
    default:
      return 'Erro desconhecido';
  }
});

const message = computed(() => {
  switch (errorCode.value) {
    case '404':
      return 'A página que você está procurando não existe ou foi movida.';
    case '500':
      return 'Ocorreu um erro interno no servidor. Tente novamente mais tarde.';
    case '403':
      return 'Você não tem permissão para acessar esta página.';
    default:
      return 'Ocorreu um erro inesperado. Tente novamente.';
  }
});

function goBack() {
  router.go(-1);
}

function goHome() {
  router.push('/');
}

function retry() {
  window.location.reload();
}
</script>

<style scoped lang="scss">
@use '../styles/_variables.scss' as *;

.error-view {
  min-height: 100vh;
  background: $gray-50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 0;

  .error-content {
    text-align: center;
    max-width: 600px;
    margin: 0 auto;

    .error-icon {
      font-size: 80px;
      margin-bottom: 24px;
      display: block;
    }

    .error-title {
      margin: 0 0 16px 0;
      color: $black;
      font-size: 36px;
      font-weight: 700;
      line-height: 1.2;
    }

    .error-message {
      margin: 0 0 32px 0;
      color: $gray-600;
      font-size: 18px;
      line-height: 1.5;
    }

    .error-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-bottom: 40px;
      flex-wrap: wrap;

      @media (max-width: 480px) {
        flex-direction: column;
        align-items: center;
      }
    }

    .error-suggestions {
      text-align: left;
      background: $white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      h3 {
        margin: 0 0 16px 0;
        color: $black;
        font-size: 18px;
        font-weight: 600;
      }

      ul {
        margin: 0;
        padding-left: 20px;
        color: $gray-700;
        font-size: 16px;
        line-height: 1.6;

        li {
          margin-bottom: 8px;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }

    @media (max-width: 768px) {
      .error-icon {
        font-size: 60px;
      }

      .error-title {
        font-size: 28px;
      }

      .error-message {
        font-size: 16px;
      }
    }
  }
}
</style> 