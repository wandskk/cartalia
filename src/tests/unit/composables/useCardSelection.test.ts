import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCardSelection } from '../../../composables/useCardSelection';
import { mockCards } from '../../mocks/data';

describe('useCardSelection', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with empty selection', () => {
    const cardSelection = useCardSelection();
    
    expect(cardSelection.selectedCards.value).toEqual([]);
    expect(cardSelection.selectedCount.value).toBe(0);
    expect(cardSelection.hasSelection.value).toBe(false);
  });

  it('should select a card', () => {
    const cardSelection = useCardSelection();
    const cardId = mockCards[0].id;
    
    cardSelection.selectCard(cardId);
    
    expect(cardSelection.selectedCards.value).toContain(cardId);
    expect(cardSelection.selectedCount.value).toBe(1);
    expect(cardSelection.hasSelection.value).toBe(true);
  });

  it('should deselect a card', () => {
    const cardSelection = useCardSelection();
    const cardId = mockCards[0].id;
    
    cardSelection.selectCard(cardId);
    cardSelection.removeCard(cardId);
    
    expect(cardSelection.selectedCards.value).not.toContain(cardId);
    expect(cardSelection.selectedCount.value).toBe(0);
    expect(cardSelection.hasSelection.value).toBe(false);
  });

  it('should toggle card selection', () => {
    const cardSelection = useCardSelection();
    const cardId = mockCards[0].id;
    
    cardSelection.toggleCard(cardId);
    expect(cardSelection.selectedCards.value).toContain(cardId);
    
    cardSelection.toggleCard(cardId);
    expect(cardSelection.selectedCards.value).not.toContain(cardId);
  });

  it('should select multiple cards', () => {
    const cardSelection = useCardSelection();
    
    cardSelection.selectCard(mockCards[0].id);
    cardSelection.selectCard(mockCards[1].id);
    
    expect(cardSelection.selectedCards.value).toHaveLength(2);
    expect(cardSelection.selectedCount.value).toBe(2);
  });

  it('should clear selection', () => {
    const cardSelection = useCardSelection();
    
    cardSelection.selectCard(mockCards[0].id);
    cardSelection.selectCard(mockCards[1].id);
    cardSelection.clearSelection();
    
    expect(cardSelection.selectedCards.value).toEqual([]);
    expect(cardSelection.selectedCount.value).toBe(0);
    expect(cardSelection.hasSelection.value).toBe(false);
  });

  it('should check if card is selected', () => {
    const cardSelection = useCardSelection();
    const cardId = mockCards[0].id;
    
    expect(cardSelection.isSelected(cardId)).toBe(false);
    
    cardSelection.selectCard(cardId);
    expect(cardSelection.isSelected(cardId)).toBe(true);
  });

  it('should get selected cards', () => {
    const cardSelection = useCardSelection();
    
    cardSelection.selectCard(mockCards[0].id);
    cardSelection.selectCard(mockCards[1].id);
    
    const selectedCards = cardSelection.getSelectedCards(mockCards);
    expect(selectedCards).toEqual([mockCards[0], mockCards[1]]);
  });
}); 