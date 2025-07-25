import { ref, computed } from 'vue';
import { useErrorStore } from '../stores/error';

export function useApi<T = any>() {
  const data = ref<T | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const errorStore = useErrorStore();

  const hasData = computed(() => data.value !== null);
  const hasError = computed(() => error.value !== null);

  async function execute<TResult = T>(
    apiCall: () => Promise<TResult>,
    errorMessage = 'Erro na operação'
  ): Promise<TResult | null> {
    loading.value = true;
    error.value = null;
    
    try {
      const result = await apiCall();
      data.value = result as T;
      return result;
    } catch (err: any) {
      const errorMsg = errorMessage;
      error.value = errorMsg;
      errorStore.addApiError(errorMsg);
      return null;
    } finally {
      loading.value = false;
    }
  }

  function clearError() {
    error.value = null;
  }

  function clearData() {
    data.value = null;
  }

  function reset() {
    data.value = null;
    loading.value = false;
    error.value = null;
  }

  return {
    data,
    loading,
    error,
    hasData,
    hasError,
    execute,
    clearError,
    clearData,
    reset
  };
} 
