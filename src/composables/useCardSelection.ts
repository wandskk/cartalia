import { ref, computed } from 'vue';
import type { Card } from '../types/cards';

interface UseCardSelectionOptions {
  maxSelection?: number;
  allowMultiple?: boolean;
  initialSelection?: string[];
}

export function useCardSelection(options: UseCardSelectionOptions = {}) {
  const {
    maxSelection = Infinity,
    allowMultiple = true,
    initialSelection = []
  } = options;

  const selectedCards = ref<string[]>(initialSelection);

  const selectedCount = computed(() => selectedCards.value.length);
  const hasSelection = computed(() => selectedCards.value.length > 0);
  const isMaxReached = computed(() => selectedCards.value.length >= maxSelection);

  function selectCard(cardId: string): boolean {
    if (!allowMultiple && selectedCards.value.length > 0) {
      selectedCards.value = [cardId];
      return true;
    }

    if (isMaxReached.value && !selectedCards.value.includes(cardId)) {
      return false;
    }

    const index = selectedCards.value.indexOf(cardId);
    if (index > -1) {
      selectedCards.value.splice(index, 1);
    } else {
      selectedCards.value.push(cardId);
    }

    return true;
  }

  function toggleCard(cardId: string): boolean {
    return selectCard(cardId);
  }

  function isSelected(cardId: string): boolean {
    return selectedCards.value.includes(cardId);
  }

  function selectMultiple(cardIds: string[]): void {
    if (!allowMultiple) {
      selectedCards.value = cardIds.slice(0, 1);
      return;
    }

    const availableSlots = maxSelection - selectedCards.value.length;
    const newCards = cardIds.slice(0, availableSlots);
    
    selectedCards.value = [...selectedCards.value, ...newCards];
  }

  function clearSelection(): void {
    selectedCards.value = [];
  }

  function removeCard(cardId: string): void {
    const index = selectedCards.value.indexOf(cardId);
    if (index > -1) {
      selectedCards.value.splice(index, 1);
    }
  }

  function getSelectedCards(allCards: Card[]): Card[] {
    return allCards.filter(card => selectedCards.value.includes(card.id));
  }

  return {
    // State
    selectedCards,
    
    // Computed
    selectedCount,
    hasSelection,
    isMaxReached,
    
    // Methods
    selectCard,
    toggleCard,
    isSelected,
    selectMultiple,
    clearSelection,
    removeCard,
    getSelectedCards
  };
} 