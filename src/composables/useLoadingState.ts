import { ref, computed } from 'vue';

interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

export function useLoadingState(initialState: Partial<LoadingState> = {}) {
  const loadingState = ref<LoadingState>({
    isLoading: false,
    message: '',
    progress: 0,
    ...initialState
  });

  const isLoading = computed(() => loadingState.value.isLoading);
  const message = computed(() => loadingState.value.message);
  const progress = computed(() => loadingState.value.progress);

  function startLoading(message?: string) {
    loadingState.value = {
      isLoading: true,
      message: message || 'Carregando...',
      progress: 0
    };
  }

  function stopLoading() {
    loadingState.value = {
      isLoading: false,
      message: '',
      progress: 0
    };
  }

  function updateProgress(progress: number, message?: string) {
    if (loadingState.value.isLoading) {
      loadingState.value.progress = Math.min(100, Math.max(0, progress));
      if (message) {
        loadingState.value.message = message;
      }
    }
  }

  function setMessage(message: string) {
    if (loadingState.value.isLoading) {
      loadingState.value.message = message;
    }
  }

  // Async wrapper for automatic loading state
  async function withLoading<T>(
    operation: () => Promise<T>,
    loadingMessage?: string
  ): Promise<T> {
    startLoading(loadingMessage);
    
    try {
      const result = await operation();
      return result;
    } finally {
      stopLoading();
    }
  }

  // Progress-based loading
  async function withProgress<T>(
    operation: (updateProgress: (progress: number, message?: string) => void) => Promise<T>,
    loadingMessage?: string
  ): Promise<T> {
    startLoading(loadingMessage);
    
    try {
      const result = await operation(updateProgress);
      return result;
    } finally {
      stopLoading();
    }
  }

  return {
    // State
    loadingState,
    isLoading,
    message,
    progress,
    
    // Methods
    startLoading,
    stopLoading,
    updateProgress,
    setMessage,
    withLoading,
    withProgress
  };
} 