<template>
  <div class="error-view">
    <Container>
      <div class="d-flex flex-column align-center justify-center text-center max-width-600 mx-auto">
        <div class="mb-6">
          <v-icon 
            size="80" 
            :color="iconColor"
            class="mb-6"
          >
            {{ iconName }}
          </v-icon>
        </div>

        <h1 class="text-h3 font-weight-bold mb-4">{{ title }}</h1>
        <p class="text-body-1 text-grey mb-8">{{ message }}</p>

        <div class="d-flex flex-wrap justify-center ga-4 mb-10">
          <v-btn @click="goBack" color="secondary" variant="outlined" prepend-icon="mdi-arrow-left">
            Voltar
          </v-btn>
          
          <v-btn @click="goHome" color="primary" variant="elevated" prepend-icon="mdi-home">
            Ir para Home
          </v-btn>
          
          <v-btn 
            v-if="errorCode === '500'" 
            @click="retry" 
            color="warning"
            variant="elevated"
            prepend-icon="mdi-refresh"
          >
            Tentar Novamente
          </v-btn>
        </div>

        <v-card v-if="errorCode === '404'" class="error-suggestions" elevation="2">
          <v-card-text class="pa-6">
            <h3 class="text-h6 font-weight-bold mb-4">Sugestões:</h3>
            <ul class="text-body-1 text-grey">
              <li class="mb-2">Verifique se o endereço está correto</li>
              <li class="mb-2">Use o menu de navegação para encontrar o que procura</li>
              <li>Volte para a página anterior</li>
            </ul>
          </v-card-text>
        </v-card>
      </div>
    </Container>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Container from '../components/common/Container.vue';

const route = useRoute();
const router = useRouter();

const errorCode = computed(() => route.params.code as string || '404');

const iconName = computed(() => {
  switch (errorCode.value) {
    case '404': return 'mdi-magnify';
    case '500': return 'mdi-lightning-bolt';
    case '403': return 'mdi-lock';
    default: return 'mdi-alert-circle';
  }
});

const iconColor = computed(() => {
  switch (errorCode.value) {
    case '404': return 'warning';
    case '500': return 'error';
    case '403': return 'error';
    default: return 'error';
  }
});

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

<style scoped>
.error-view {
  min-height: 100vh;
  background: linear-gradient(135deg, rgb(var(--v-theme-grey-lighten-5)) 0%, white 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 0;
}

.error-suggestions {
  border-radius: 12px;
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

@media (max-width: 768px) {
  .error-view {
    padding: 16px 0;
  }
}
</style> 
