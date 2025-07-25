import { describe, it, expect, beforeEach } from 'vitest';
import { ref } from 'vue';
import { useCardStates } from '../../../composables/useCardStates';

describe('useCardStates', () => {
  let loading: ReturnType<typeof ref<boolean>>;
  let error: ReturnType<typeof ref<string | null>>;
  let cards: ReturnType<typeof ref<any[]>>;
  let cardStates: ReturnType<typeof useCardStates>;

  beforeEach(() => {
    loading = ref<boolean>(false);
    error = ref<string | null>(null);
    cards = ref<any[]>([]);
    cardStates = useCardStates(loading, error, cards);
  });

  describe('isLoading', () => {
    it('should return true when loading is true', () => {
      loading.value = true;
      
      expect(cardStates.isLoading.value).toBe(true);
    });

    it('should return false when loading is false', () => {
      loading.value = false;
      
      expect(cardStates.isLoading.value).toBe(false);
    });

    it('should update reactively when loading changes', () => {
      expect(cardStates.isLoading.value).toBe(false);
      
      loading.value = true;
      expect(cardStates.isLoading.value).toBe(true);
      
      loading.value = false;
      expect(cardStates.isLoading.value).toBe(false);
    });
  });

  describe('hasError', () => {
    it('should return true when error is not null', () => {
      error.value = 'Test error';
      
      expect(cardStates.hasError.value).toBe(true);
    });

    it('should return false when error is empty string', () => {
      error.value = '';
      
      expect(cardStates.hasError.value).toBe(false);
    });

    it('should return false when error is null', () => {
      error.value = null;
      
      expect(cardStates.hasError.value).toBe(false);
    });

    it('should update reactively when error changes', () => {
      expect(cardStates.hasError.value).toBe(false);
      
      error.value = 'New error';
      expect(cardStates.hasError.value).toBe(true);
      
      error.value = null;
      expect(cardStates.hasError.value).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('should return true when not loading, no error, and no cards', () => {
      loading.value = false;
      error.value = null;
      cards.value = [];
      
      expect(cardStates.isEmpty.value).toBe(true);
    });

    it('should return false when loading', () => {
      loading.value = true;
      error.value = null;
      cards.value = [];
      
      expect(cardStates.isEmpty.value).toBe(false);
    });

    it('should return false when there is an error', () => {
      loading.value = false;
      error.value = 'Test error';
      cards.value = [];
      
      expect(cardStates.isEmpty.value).toBe(false);
    });

    it('should return false when there are cards', () => {
      loading.value = false;
      error.value = null;
      cards.value = [{ id: '1', name: 'Card 1' }];
      
      expect(cardStates.isEmpty.value).toBe(false);
    });

    it('should return false when loading and there are cards', () => {
      loading.value = true;
      error.value = null;
      cards.value = [{ id: '1', name: 'Card 1' }];
      
      expect(cardStates.isEmpty.value).toBe(false);
    });

    it('should return false when there is an error and there are cards', () => {
      loading.value = false;
      error.value = 'Test error';
      cards.value = [{ id: '1', name: 'Card 1' }];
      
      expect(cardStates.isEmpty.value).toBe(false);
    });

    it('should update reactively when state changes', () => {
      // Initial state: not loading, no error, no cards
      expect(cardStates.isEmpty.value).toBe(true);
      
      // Add cards
      cards.value = [{ id: '1', name: 'Card 1' }];
      expect(cardStates.isEmpty.value).toBe(false);
      
      // Remove cards
      cards.value = [];
      expect(cardStates.isEmpty.value).toBe(true);
      
      // Set loading
      loading.value = true;
      expect(cardStates.isEmpty.value).toBe(false);
      
      // Stop loading
      loading.value = false;
      expect(cardStates.isEmpty.value).toBe(true);
      
      // Set error
      error.value = 'Test error';
      expect(cardStates.isEmpty.value).toBe(false);
      
      // Clear error
      error.value = null;
      expect(cardStates.isEmpty.value).toBe(true);
    });
  });

  describe('edge cases', () => {


    it('should handle cards array with null values', () => {
      cards.value = [null, undefined, { id: '1', name: 'Card 1' }];
      loading.value = false;
      error.value = null;
      
      expect(cardStates.isEmpty.value).toBe(false);
    });

    it('should handle empty string error', () => {
      error.value = '';
      loading.value = false;
      cards.value = [];
      
      expect(cardStates.hasError.value).toBe(false);
      expect(cardStates.isEmpty.value).toBe(true);
    });

    it('should handle whitespace error', () => {
      error.value = '   ';
      loading.value = false;
      cards.value = [];
      
      expect(cardStates.hasError.value).toBe(true);
      expect(cardStates.isEmpty.value).toBe(false);
    });
  });

  describe('computed properties reactivity', () => {
    it('should maintain reactivity across all properties', () => {
      // Test all properties update when loading changes
      loading.value = true;
      expect(cardStates.isLoading.value).toBe(true);
      expect(cardStates.hasError.value).toBe(false);
      expect(cardStates.isEmpty.value).toBe(false);
      
      // Test all properties update when error changes
      loading.value = false;
      error.value = 'Error occurred';
      expect(cardStates.isLoading.value).toBe(false);
      expect(cardStates.hasError.value).toBe(true);
      expect(cardStates.isEmpty.value).toBe(false);
      
      // Test all properties update when cards change
      error.value = null;
      cards.value = [{ id: '1' }];
      expect(cardStates.isLoading.value).toBe(false);
      expect(cardStates.hasError.value).toBe(false);
      expect(cardStates.isEmpty.value).toBe(false);
      
      // Test empty state
      cards.value = [];
      expect(cardStates.isLoading.value).toBe(false);
      expect(cardStates.hasError.value).toBe(false);
      expect(cardStates.isEmpty.value).toBe(true);
    });
  });
}); 