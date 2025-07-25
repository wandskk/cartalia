<template>
  <div v-if="hasError" class="error-boundary">
    <v-card class="error-card" elevation="3">
      <v-card-title class="error-title">
        <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
        Ops! Algo deu errado
      </v-card-title>
      
      <v-card-text class="error-content">
        <p class="error-message">
          {{ errorMessage }}
        </p>
        
        <div v-if="errorDetails" class="error-details">
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-title>
                Detalhes do Erro
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <pre class="error-stack">{{ errorDetails }}</pre>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-card-text>
      
      <v-card-actions class="error-actions">
        <v-btn 
          @click="handleRetry" 
          color="primary" 
          variant="elevated"
          :loading="retrying"
        >
          Tentar Novamente
        </v-btn>
        
        <v-btn 
          @click="handleReload" 
          variant="outlined"
        >
          Recarregar Página
        </v-btn>
        
        <v-btn 
          @click="handleGoHome" 
          variant="text"
        >
          Ir para o Início
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
  
  <div v-else>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useErrorStore } from '../../stores/error';
import { useNotificationStore } from '../../stores/notification';

interface Props {
  fallback?: string;
  showDetails?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  fallback: 'Ocorreu um erro inesperado. Tente novamente.',
  showDetails: false
});

const router = useRouter();
const errorStore = useErrorStore();
const notification = useNotificationStore();

const hasError = ref(false);
const error = ref<Error | null>(null);
const errorMessage = ref('');
const errorDetails = ref('');
const retrying = ref(false);

// Capture errors from child components
onErrorCaptured((err: Error, instance, info) => {
  console.error('ErrorBoundary captured error:', err, info);
  
  error.value = err;
  hasError.value = true;
  errorMessage.value = err.message || props.fallback;
  errorDetails.value = err.stack || info;
  
  // Log to error store
  errorStore.addError({
    type: 'unknown',
    message: err.message,
    stack: err.stack,
    component: instance?.$options.name || 'Unknown',
    details: info
  });
  
  // Show notification
  notification.show('Ocorreu um erro inesperado', 'error');
  
  // Prevent error from propagating
  return false;
});

// Handle retry
async function handleRetry() {
  retrying.value = true;
  
  try {
    // Clear error state
    hasError.value = false;
    error.value = null;
    errorMessage.value = '';
    errorDetails.value = '';
    
    // Wait a bit to show loading state
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Force component re-render
    await router.go(0);
  } catch (err) {
    console.error('Retry failed:', err);
    notification.show('Falha ao tentar novamente', 'error');
  } finally {
    retrying.value = false;
  }
}

// Handle page reload
function handleReload() {
  window.location.reload();
}

// Handle go home
function handleGoHome() {
  router.push('/');
}

// Global error handlers
onMounted(() => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    error.value = new Error(event.reason?.message || 'Promise rejection');
    hasError.value = true;
    errorMessage.value = 'Erro de processamento inesperado';
    errorDetails.value = event.reason?.stack || '';
    
    event.preventDefault();
  });
  
  // Handle global errors
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    
    error.value = event.error || new Error('Erro global');
    hasError.value = true;
    errorMessage.value = 'Erro de sistema inesperado';
    errorDetails.value = event.error?.stack || '';
  });
});
</script>

<style scoped lang="scss">
.error-boundary {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.error-card {
  max-width: 600px;
  width: 100%;
  border-radius: 12px;
}

.error-title {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 600;
  color: #d32f2f;
  border-bottom: 1px solid #e0e0e0;
}

.error-content {
  padding: 1.5rem;
}

.error-message {
  font-size: 1.1rem;
  color: #424242;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.error-details {
  margin-top: 1rem;
}

.error-stack {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  color: #666;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 200px;
  overflow-y: auto;
}

.error-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e0e0e0;
}

@media (max-width: 600px) {
  .error-boundary {
    padding: 1rem;
  }
  
  .error-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style> 