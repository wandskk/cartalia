import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useLoadingStore } from '../../../stores/loading';

describe('useLoadingStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('initial state', () => {
    it('should initialize with default values', () => {
      const loadingStore = useLoadingStore();
      
      expect(loadingStore.isLoading).toBe(false);
    });
  });

  describe('startLoading', () => {
    it('should set loading state to true', () => {
      const loadingStore = useLoadingStore();
      
      loadingStore.startLoading();
      
      expect(loadingStore.isLoading).toBe(true);
    });
  });

  describe('stopLoading', () => {
    it('should set loading state to false', () => {
      const loadingStore = useLoadingStore();
      
      loadingStore.startLoading();
      loadingStore.stopLoading();
      
      expect(loadingStore.isLoading).toBe(false);
    });
  });

  describe('loading state management', () => {
    it('should toggle loading state correctly', () => {
      const loadingStore = useLoadingStore();
      
      expect(loadingStore.isLoading).toBe(false);
      
      loadingStore.startLoading();
      expect(loadingStore.isLoading).toBe(true);
      
      loadingStore.stopLoading();
      expect(loadingStore.isLoading).toBe(false);
    });
  });
}); 