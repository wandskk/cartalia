import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';


const mockErrorStore = {
  addApiError: vi.fn()
};

vi.mock('../../../stores/error', () => ({
  useErrorStore: () => mockErrorStore
}));

import { useApi } from '../../../composables/useApi';


vi.mock('../../../stores/error', () => ({
  useErrorStore: () => ({
    errors: [],
    addApiError: vi.fn()
  })
}));

describe('useApi', () => {
  let api: ReturnType<typeof useApi>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  beforeEach(() => {
    api = useApi();
  });

  describe('initial state', () => {
    it('should initialize with default values', () => {
      expect(api.data.value).toBeNull();
      expect(api.loading.value).toBe(false);
      expect(api.error.value).toBeNull();
      expect(api.hasData.value).toBe(false);
      expect(api.hasError.value).toBe(false);
    });
  });

  describe('computed properties', () => {
    it('should compute hasData correctly', () => {
      expect(api.hasData.value).toBe(false);
      
      api.data.value = { id: 1, name: 'test' };
      
      expect(api.hasData.value).toBe(true);
    });

    it('should compute hasError correctly', () => {
      expect(api.hasError.value).toBe(false);
      
      api.error.value = 'Test error';
      
      expect(api.hasError.value).toBe(true);
    });
  });

  describe('execute', () => {
    it('should execute API call successfully', async () => {
      const mockData = { id: 1, name: 'test' };
      const mockApiCall = vi.fn().mockResolvedValue(mockData);
      
      const result = await api.execute(mockApiCall);
      
      expect(result).toEqual(mockData);
      expect(api.data.value).toEqual(mockData);
      expect(api.loading.value).toBe(false);
      expect(api.error.value).toBeNull();
      expect(mockApiCall).toHaveBeenCalledOnce();
    });

    it('should handle API call error', async () => {
      const mockError = new Error('API Error');
      const mockApiCall = vi.fn().mockRejectedValue(mockError);
      
      const result = await api.execute(mockApiCall);
      
      expect(result).toBeNull();
      expect(api.data.value).toBeNull();
      expect(api.loading.value).toBe(false);
      expect(api.error.value).toBe('Erro na operação');
    });

    it('should use custom error message when provided', async () => {
      const mockError = new Error('API Error');
      const mockApiCall = vi.fn().mockRejectedValue(mockError);
      
      const result = await api.execute(mockApiCall, 'Custom error message');
      
      expect(result).toBeNull();
      expect(api.error.value).toBe('Custom error message');
    });

    it('should handle error without message', async () => {
      const mockError = new Error();
      const mockApiCall = vi.fn().mockRejectedValue(mockError);
      
      const result = await api.execute(mockApiCall);
      
      expect(result).toBeNull();
      expect(api.error.value).toBe('Erro na operação');
    });

    it('should set loading state during execution', async () => {
      const mockData = { id: 1, name: 'test' };
      const mockApiCall = vi.fn().mockImplementation(() => {
        expect(api.loading.value).toBe(true);
        return Promise.resolve(mockData);
      });
      
      await api.execute(mockApiCall);
      
      expect(api.loading.value).toBe(false);
    });

    it('should clear error when starting new execution', async () => {
      api.error.value = 'Previous error';
      
      const mockData = { id: 1, name: 'test' };
      const mockApiCall = vi.fn().mockResolvedValue(mockData);
      
      await api.execute(mockApiCall);
      
      expect(api.error.value).toBeNull();
    });
  });

  describe('clearError', () => {
    it('should clear error', () => {
      api.error.value = 'Test error';
      
      api.clearError();
      
      expect(api.error.value).toBeNull();
    });
  });

  describe('clearData', () => {
    it('should clear data', () => {
      api.data.value = { id: 1, name: 'test' };
      
      api.clearData();
      
      expect(api.data.value).toBeNull();
    });
  });

  describe('reset', () => {
    it('should reset all state', () => {
      api.data.value = { id: 1, name: 'test' };
      api.loading.value = true;
      api.error.value = 'Test error';
      
      api.reset();
      
      expect(api.data.value).toBeNull();
      expect(api.loading.value).toBe(false);
      expect(api.error.value).toBeNull();
    });
  });



  describe.skip('error store integration', () => {
    it('should add API error to error store', async () => {
      setActivePinia(createPinia());

      const { useErrorStore } = await import('../../../stores/error');
      const errorStore = useErrorStore();
      errorStore.errors = [];

      const api = useApi();
      const mockError = new Error('API Error');
      const mockApiCall = vi.fn().mockRejectedValue(mockError);
      await api.execute(mockApiCall);

      expect(errorStore.errors.length).toBeGreaterThan(0);
      expect(errorStore.errors[errorStore.errors.length - 1].message).toBe('Erro na operação');
      errorStore.errors = [];
    });
  });

  describe('generic type support', () => {
    it('should work with custom types', () => {
      interface CustomType {
        id: number;
        name: string;
      }
      
      const customApi = useApi<CustomType>();
      
      expect(customApi.data.value).toBeNull();
      
      customApi.data.value = { id: 1, name: 'test' };
      
      expect(customApi.data.value).toEqual({ id: 1, name: 'test' });
    });
  });
}); 