import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useErrorStore } from '../../../stores/error';

describe('useErrorStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('initial state', () => {
    it('should initialize with default values', () => {
      const errorStore = useErrorStore();
      
      expect(errorStore.errors).toEqual([]);
      expect(errorStore.hasErrors).toBe(false);
      expect(errorStore.isErrorModalOpen).toBe(false);
      expect(errorStore.currentError).toBeNull();
    });
  });

  describe('addError', () => {
    it('should add error to errors array', () => {
      const errorStore = useErrorStore();
      
      errorStore.addError({
        type: 'api',
        message: 'API Error',
        details: 'Something went wrong'
      });
      
      expect(errorStore.errors).toHaveLength(1);
      expect(errorStore.errors[0].message).toBe('API Error');
      expect(errorStore.errors[0].type).toBe('api');
      expect(errorStore.hasErrors).toBe(true);
    });

    it('should generate unique id and timestamp', () => {
      const errorStore = useErrorStore();
      
      errorStore.addError({
        type: 'validation',
        message: 'Validation Error'
      });
      
      expect(errorStore.errors[0].id).toBeDefined();
      expect(errorStore.errors[0].timestamp).toBeInstanceOf(Date);
    });
  });

  describe('addApiError', () => {
    it('should add API error', () => {
      const errorStore = useErrorStore();
      
      errorStore.addApiError('API Error', 'Details', 'Component');
      
      expect(errorStore.errors).toHaveLength(1);
      expect(errorStore.errors[0].type).toBe('api');
      expect(errorStore.errors[0].message).toBe('API Error');
      expect(errorStore.errors[0].details).toBe('Details');
      expect(errorStore.errors[0].component).toBe('Component');
    });
  });

  describe('addValidationError', () => {
    it('should add validation error', () => {
      const errorStore = useErrorStore();
      
      errorStore.addValidationError('Validation Error');
      
      expect(errorStore.errors).toHaveLength(1);
      expect(errorStore.errors[0].type).toBe('validation');
      expect(errorStore.errors[0].message).toBe('Validation Error');
    });
  });

  describe('addNetworkError', () => {
    it('should add network error', () => {
      const errorStore = useErrorStore();
      
      errorStore.addNetworkError('Network Error');
      
      expect(errorStore.errors).toHaveLength(1);
      expect(errorStore.errors[0].type).toBe('network');
      expect(errorStore.errors[0].message).toBe('Network Error');
    });
  });

  describe('addAuthError', () => {
    it('should add auth error', () => {
      const errorStore = useErrorStore();
      
      errorStore.addAuthError('Auth Error');
      
      expect(errorStore.errors).toHaveLength(1);
      expect(errorStore.errors[0].type).toBe('auth');
      expect(errorStore.errors[0].message).toBe('Auth Error');
    });
  });

  describe('clearError', () => {
    it('should clear specific error by id', () => {
      const errorStore = useErrorStore();
      
      errorStore.addError({
        type: 'api',
        message: 'Error 1'
      });
      errorStore.addError({
        type: 'validation',
        message: 'Error 2'
      });
      
      const errorId = errorStore.errors[0].id;
      errorStore.clearError(errorId);
      
      expect(errorStore.errors).toHaveLength(1);
      expect(errorStore.errors[0].message).toBe('Error 2');
    });
  });

  describe('clearAllErrors', () => {
    it('should clear all errors', () => {
      const errorStore = useErrorStore();
      
      errorStore.addError({
        type: 'api',
        message: 'Error 1'
      });
      errorStore.addError({
        type: 'validation',
        message: 'Error 2'
      });
      
      errorStore.clearAllErrors();
      
      expect(errorStore.errors).toEqual([]);
      expect(errorStore.hasErrors).toBe(false);
      expect(errorStore.isErrorModalOpen).toBe(false);
      expect(errorStore.currentError).toBeNull();
    });
  });

  describe('error modal', () => {
    it('should show error modal for API errors', () => {
      const errorStore = useErrorStore();
      
      errorStore.addApiError('API Error');
      
      expect(errorStore.isErrorModalOpen).toBe(true);
      expect(errorStore.currentError).toBeDefined();
      expect(errorStore.currentError?.message).toBe('API Error');
    });

    it('should close error modal', () => {
      const errorStore = useErrorStore();
      
      errorStore.addApiError('API Error');
      errorStore.closeErrorModal();
      
      expect(errorStore.isErrorModalOpen).toBe(false);
      expect(errorStore.currentError).toBeNull();
    });
  });
}); 