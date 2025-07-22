import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface AppError {
  id: string;
  type: 'api' | 'validation' | 'network' | 'auth' | 'unknown';
  message: string;
  details?: string;
  timestamp: Date;
  component?: string;
  stack?: string;
}

export const useErrorStore = defineStore('error', () => {
  const errors = ref<AppError[]>([]);
  const isErrorModalOpen = ref(false);
  const currentError = ref<AppError | null>(null);

  const hasErrors = computed(() => errors.value.length > 0);
  const recentErrors = computed(() => 
    errors.value
      .slice()
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10)
  );

  function addError(error: Omit<AppError, 'id' | 'timestamp'>) {
    const newError: AppError = {
      ...error,
      id: generateErrorId(),
      timestamp: new Date()
    };

    errors.value.push(newError);
    
    if (error.type === 'api' || error.type === 'network') {
      showErrorModal(newError);
    }

    console.error('App Error:', newError);
  }

  function addApiError(message: string, details?: string, component?: string) {
    addError({
      type: 'api',
      message,
      details,
      component
    });
  }

  function addValidationError(message: string, details?: string, component?: string) {
    addError({
      type: 'validation',
      message,
      details,
      component
    });
  }

  function addNetworkError(message: string, details?: string, component?: string) {
    addError({
      type: 'network',
      message,
      details,
      component
    });
  }

  function addAuthError(message: string, details?: string, component?: string) {
    addError({
      type: 'auth',
      message,
      details,
      component
    });
  }

  function showErrorModal(error: AppError) {
    currentError.value = error;
    isErrorModalOpen.value = true;
  }

  function closeErrorModal() {
    isErrorModalOpen.value = false;
    currentError.value = null;
  }

  function clearError(errorId: string) {
    errors.value = errors.value.filter(error => error.id !== errorId);
  }

  function clearAllErrors() {
    errors.value = [];
    closeErrorModal();
  }

  function clearOldErrors() {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    errors.value = errors.value.filter(error => error.timestamp > oneHourAgo);
  }

  function generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  return {
    errors,
    isErrorModalOpen,
    currentError,
    hasErrors,
    recentErrors,
    addError,
    addApiError,
    addValidationError,
    addNetworkError,
    addAuthError,
    showErrorModal,
    closeErrorModal,
    clearError,
    clearAllErrors,
    clearOldErrors
  };
}); 
