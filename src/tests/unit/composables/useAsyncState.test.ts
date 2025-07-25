import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAsyncState } from '../../../composables/useAsyncState';

describe('useAsyncState', () => {
  let asyncState: ReturnType<typeof useAsyncState>;

  beforeEach(() => {
    asyncState = useAsyncState();
  });

  describe('initial state', () => {
    it('should initialize with default values', () => {
      expect(asyncState.isLoading.value).toBe(false);
      expect(asyncState.hasError.value).toBe(false);
      expect(asyncState.data.value).toBeNull();
      expect(asyncState.error.value).toBeNull();
    });

    it('should initialize with custom initial data', () => {
      const initialData = { id: 1, name: 'test' };
      const stateWithData = useAsyncState(initialData);
      
      expect(stateWithData.data.value).toEqual(initialData);
      expect(stateWithData.isLoading.value).toBe(false);
      expect(stateWithData.hasError.value).toBe(false);
    });
  });

  describe('setLoading', () => {
    it('should set loading state to true', () => {
      asyncState.setLoading(true);
      
      expect(asyncState.isLoading.value).toBe(true);
    });

    it('should set loading state to false', () => {
      asyncState.setLoading(true);
      asyncState.setLoading(false);
      
      expect(asyncState.isLoading.value).toBe(false);
    });

    it('should clear error when setting loading to true', () => {
      asyncState.setError('Test error');
      asyncState.setLoading(true);
      
      expect(asyncState.error.value).toBeNull();
    });
  });

  describe('setData', () => {
    it('should set data and clear loading and error', () => {
      const testData = { id: 1, name: 'test' };
      
      asyncState.setLoading(true);
      asyncState.setError('Test error');
      asyncState.setData(testData);
      
      expect(asyncState.data.value).toEqual(testData);
      expect(asyncState.isLoading.value).toBe(false);
      expect(asyncState.error.value).toBeNull();
    });
  });

  describe('setError', () => {
    it('should set error and clear loading', () => {
      const errorMessage = 'Test error message';
      
      asyncState.setLoading(true);
      asyncState.setError(errorMessage);
      
      expect(asyncState.error.value).toBe(errorMessage);
      expect(asyncState.isLoading.value).toBe(false);
      expect(asyncState.hasError.value).toBe(true);
    });
  });

  describe('reset', () => {
    it('should reset to initial state', () => {
      const testData = { id: 1, name: 'test' };
      
      asyncState.setData(testData);
      asyncState.setError('Test error');
      asyncState.reset();
      
      expect(asyncState.data.value).toBeNull();
      expect(asyncState.error.value).toBeNull();
      expect(asyncState.isLoading.value).toBe(false);
      expect(asyncState.hasError.value).toBe(false);
    });

    it('should reset to custom initial data', () => {
      const initialData = { id: 1, name: 'initial' };
      const stateWithData = useAsyncState(initialData);
      
      stateWithData.setData({ id: 2, name: 'new' });
      stateWithData.setError('Test error');
      stateWithData.reset();
      
      expect(stateWithData.data.value).toEqual(initialData);
      expect(stateWithData.error.value).toBeNull();
      expect(stateWithData.isLoading.value).toBe(false);
    });
  });

  describe('execute', () => {
    it('should execute operation and set data on success', async () => {
      const testData = { id: 1, name: 'test' };
      const operation = vi.fn().mockResolvedValue(testData);
      
      const result = await asyncState.execute(operation);
      
      expect(result).toEqual(testData);
      expect(asyncState.data.value).toEqual(testData);
      expect(asyncState.isLoading.value).toBe(false);
      expect(asyncState.error.value).toBeNull();
      expect(operation).toHaveBeenCalledOnce();
    });

    it('should handle operation error', async () => {
      const errorMessage = 'Operation failed';
      const operation = vi.fn().mockRejectedValue(new Error(errorMessage));
      
      await expect(asyncState.execute(operation)).rejects.toThrow(errorMessage);
      
      expect(asyncState.error.value).toBe(errorMessage);
      expect(asyncState.isLoading.value).toBe(false);
      expect(asyncState.data.value).toBeNull();
    });

    it('should set loading state during operation', async () => {
      const operation = vi.fn().mockImplementation(() => {
        expect(asyncState.isLoading.value).toBe(true);
        return Promise.resolve({ id: 1 });
      });
      
      await asyncState.execute(operation);
      
      expect(asyncState.isLoading.value).toBe(false);
    });

    it('should execute operation successfully', async () => {
      const operation = vi.fn().mockResolvedValue({ id: 1 });
      
      await asyncState.execute(operation);
      
      expect(operation).toHaveBeenCalledOnce();
    });
  });

  describe('computed properties', () => {
    it('should compute hasError correctly', () => {
      expect(asyncState.hasError.value).toBe(false);
      
      asyncState.setError('Test error');
      expect(asyncState.hasError.value).toBe(true);
      
      asyncState.setData({ id: 1 });
      expect(asyncState.hasError.value).toBe(false);
    });

    it('should compute isLoading correctly', () => {
      expect(asyncState.isLoading.value).toBe(false);
      
      asyncState.setLoading(true);
      expect(asyncState.isLoading.value).toBe(true);
      
      asyncState.setData({ id: 1 });
      expect(asyncState.isLoading.value).toBe(false);
    });
  });

  describe('state reactivity', () => {
    it('should update computed properties when state changes', () => {
      const testData = { id: 1, name: 'test' };
      
      asyncState.state.value = {
        data: testData,
        loading: true,
        error: 'Test error'
      };
      
      expect(asyncState.data.value).toEqual(testData);
      expect(asyncState.isLoading.value).toBe(true);
      expect(asyncState.error.value).toBe('Test error');
      expect(asyncState.hasError.value).toBe(true);
    });
  });
}); 