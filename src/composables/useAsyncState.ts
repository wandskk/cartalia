import { ref, computed } from 'vue';

export interface AsyncState<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useAsyncState<T = any>(initialData: T | null = null) {
  const state = ref<AsyncState<T>>({
    data: initialData,
    loading: false,
    error: null
  });

  const isLoading = computed(() => state.value.loading);
  const hasError = computed(() => !!state.value.error);
  const data = computed(() => state.value.data);
  const error = computed(() => state.value.error);

  function setLoading(loading: boolean) {
    state.value.loading = loading;
    if (loading) {
      state.value.error = null;
    }
  }

  function setData(data: T) {
    state.value.data = data as any;
    state.value.loading = false;
    state.value.error = null;
  }

  function setError(error: string) {
    state.value.error = error;
    state.value.loading = false;
  }

  function reset() {
    state.value = {
      data: initialData,
      loading: false,
      error: null
    };
  }

  async function execute<TResult = T>(
    operation: () => Promise<TResult>,
    loadingMessage?: string
  ): Promise<TResult> {
    setLoading(true);
    
    try {
      const result = await operation();
      setData(result as T);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro inesperado';
      setError(errorMessage);
      throw err;
    }
  }

  return {
    state,
    isLoading,
    hasError,
    data,
    error,
    setLoading,
    setData,
    setError,
    reset,
    execute
  };
} 