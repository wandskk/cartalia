import { describe, it, expect, beforeEach } from 'vitest';
import { useCardSelection } from '../../../composables/useCardSelection';
import { createMockCard } from '../../mocks/data';

describe('useCardSelection', () => {
  let cardSelection: ReturnType<typeof useCardSelection>;
  const mockCard1 = createMockCard({ id: 'card-1', name: 'Card 1' });
  const mockCard2 = createMockCard({ id: 'card-2', name: 'Card 2' });
  const mockCard3 = createMockCard({ id: 'card-3', name: 'Card 3' });
  const mockCards = [mockCard1, mockCard2, mockCard3];

  beforeEach(() => {
    cardSelection = useCardSelection();
  });

  describe('initialization', () => {
    it('should initialize with default values', () => {
      expect(cardSelection.selectedCards.value).toEqual([]);
      expect(cardSelection.selectedCount.value).toBe(0);
      expect(cardSelection.hasSelection.value).toBe(false);
      expect(cardSelection.isMaxReached.value).toBe(false);
    });

    it('should initialize with custom options', () => {
      const customSelection = useCardSelection({
        maxSelection: 2,
        allowMultiple: true,
        initialSelection: ['card-1']
      });

      expect(customSelection.selectedCards.value).toEqual(['card-1']);
      expect(customSelection.selectedCount.value).toBe(1);
      expect(customSelection.hasSelection.value).toBe(true);
      expect(customSelection.isMaxReached.value).toBe(false);
    });

    it('should handle single selection mode', () => {
      const singleSelection = useCardSelection({
        allowMultiple: false
      });

      singleSelection.selectCard('card-1');
      singleSelection.selectCard('card-2');

      expect(singleSelection.selectedCards.value).toEqual(['card-2']);
      expect(singleSelection.selectedCount.value).toBe(1);
    });
  });

  describe('selectCard', () => {
    it('should select a card', () => {
      const result = cardSelection.selectCard('card-1');
      
      expect(result).toBe(true);
      expect(cardSelection.selectedCards.value).toContain('card-1');
      expect(cardSelection.selectedCount.value).toBe(1);
      expect(cardSelection.hasSelection.value).toBe(true);
    });

    it('should not select the same card twice', () => {
      cardSelection.selectCard('card-1');
      const result = cardSelection.selectCard('card-1');
      
      expect(result).toBe(false);
      expect(cardSelection.selectedCount.value).toBe(1);
    });

    it('should respect max selection limit', () => {
      const limitedSelection = useCardSelection({ maxSelection: 2 });
      
      limitedSelection.selectCard('card-1');
      limitedSelection.selectCard('card-2');
      const result = limitedSelection.selectCard('card-3');
      
      expect(result).toBe(false);
      expect(limitedSelection.selectedCards.value).toEqual(['card-1', 'card-2']);
      expect(limitedSelection.isMaxReached.value).toBe(true);
    });

    it('should replace selection in single selection mode', () => {
      const singleSelection = useCardSelection({ allowMultiple: false });
      
      singleSelection.selectCard('card-1');
      singleSelection.selectCard('card-2');
      
      expect(singleSelection.selectedCards.value).toEqual(['card-2']);
      expect(singleSelection.selectedCount.value).toBe(1);
    });
  });

  describe('toggleCard', () => {
    it('should add card when not selected', () => {
      const result = cardSelection.toggleCard('card-1');
      
      expect(result).toBe(true);
      expect(cardSelection.selectedCards.value).toContain('card-1');
    });

    it('should remove card when already selected', () => {
      cardSelection.selectCard('card-1');
      const result = cardSelection.toggleCard('card-1');
      
      expect(result).toBe(false);
      expect(cardSelection.selectedCards.value).not.toContain('card-1');
      expect(cardSelection.selectedCount.value).toBe(0);
    });

    it('should respect max selection limit', () => {
      const limitedSelection = useCardSelection({ maxSelection: 1 });
      
      limitedSelection.toggleCard('card-1');
      const result = limitedSelection.toggleCard('card-2');
      
      expect(result).toBe(false);
      expect(limitedSelection.selectedCards.value).toEqual(['card-1']);
    });
  });

  describe('isSelected', () => {
    it('should return true for selected card', () => {
      cardSelection.selectCard('card-1');
      
      expect(cardSelection.isSelected('card-1')).toBe(true);
    });

    it('should return false for unselected card', () => {
      expect(cardSelection.isSelected('card-1')).toBe(false);
    });
  });

  describe('selectMultiple', () => {
    it('should select multiple cards', () => {
      cardSelection.selectMultiple(['card-1', 'card-2']);
      
      expect(cardSelection.selectedCards.value).toEqual(['card-1', 'card-2']);
      expect(cardSelection.selectedCount.value).toBe(2);
    });

    it('should respect max selection limit', () => {
      const limitedSelection = useCardSelection({ maxSelection: 2 });
      
      limitedSelection.selectMultiple(['card-1', 'card-2', 'card-3']);
      
      expect(limitedSelection.selectedCards.value).toEqual(['card-1', 'card-2']);
      expect(limitedSelection.selectedCount.value).toBe(2);
    });

    it('should handle empty array', () => {
      cardSelection.selectCard('card-1');
      cardSelection.selectMultiple([]);
      
      expect(cardSelection.selectedCards.value).toEqual(['card-1']);
    });
  });

  describe('clearSelection', () => {
    it('should clear all selected cards', () => {
      cardSelection.selectCard('card-1');
      cardSelection.selectCard('card-2');
      
      cardSelection.clearSelection();
      
      expect(cardSelection.selectedCards.value).toEqual([]);
      expect(cardSelection.selectedCount.value).toBe(0);
      expect(cardSelection.hasSelection.value).toBe(false);
    });
  });

  describe('removeCard', () => {
    it('should remove specific card', () => {
      cardSelection.selectCard('card-1');
      cardSelection.selectCard('card-2');
      
      cardSelection.removeCard('card-1');
      
      expect(cardSelection.selectedCards.value).toEqual(['card-2']);
      expect(cardSelection.selectedCount.value).toBe(1);
    });

    it('should do nothing if card is not selected', () => {
      cardSelection.selectCard('card-1');
      
      cardSelection.removeCard('card-2');
      
      expect(cardSelection.selectedCards.value).toEqual(['card-1']);
      expect(cardSelection.selectedCount.value).toBe(1);
    });
  });

  describe('getSelectedCards', () => {
    it('should return selected card objects', () => {
      cardSelection.selectCard('card-1');
      cardSelection.selectCard('card-2');
      
      const selectedCards = cardSelection.getSelectedCards(mockCards);
      
      expect(selectedCards).toEqual([mockCard1, mockCard2]);
    });

    it('should return empty array when no cards selected', () => {
      const selectedCards = cardSelection.getSelectedCards(mockCards);
      
      expect(selectedCards).toEqual([]);
    });

    it('should handle cards not found in array', () => {
      cardSelection.selectCard('card-1');
      cardSelection.selectCard('non-existent');
      
      const selectedCards = cardSelection.getSelectedCards(mockCards);
      
      expect(selectedCards).toEqual([mockCard1]);
    });
  });

  describe('computed properties', () => {
    it('should update selectedCount correctly', () => {
      expect(cardSelection.selectedCount.value).toBe(0);
      
      cardSelection.selectCard('card-1');
      expect(cardSelection.selectedCount.value).toBe(1);
      
      cardSelection.selectCard('card-2');
      expect(cardSelection.selectedCount.value).toBe(2);
    });

    it('should update hasSelection correctly', () => {
      expect(cardSelection.hasSelection.value).toBe(false);
      
      cardSelection.selectCard('card-1');
      expect(cardSelection.hasSelection.value).toBe(true);
      
      cardSelection.clearSelection();
      expect(cardSelection.hasSelection.value).toBe(false);
    });

    it('should update isMaxReached correctly', () => {
      const limitedSelection = useCardSelection({ maxSelection: 2 });
      
      expect(limitedSelection.isMaxReached.value).toBe(false);
      
      limitedSelection.selectCard('card-1');
      expect(limitedSelection.isMaxReached.value).toBe(false);
      
      limitedSelection.selectCard('card-2');
      expect(limitedSelection.isMaxReached.value).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle undefined card IDs', () => {
      expect(() => cardSelection.selectCard(undefined as any)).not.toThrow();
      expect(cardSelection.selectedCards.value).toEqual([]);
    });

    it('should handle empty string card IDs', () => {
      cardSelection.selectCard('');
      expect(cardSelection.selectedCards.value).toEqual(['']);
    });

    it('should handle duplicate card IDs in selectMultiple', () => {
      cardSelection.selectMultiple(['card-1', 'card-1', 'card-2']);
      expect(cardSelection.selectedCards.value).toEqual(['card-1', 'card-2']);
    });
  });
}); 