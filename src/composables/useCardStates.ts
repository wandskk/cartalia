import { computed, type Ref } from 'vue';

export function useCardStates(
  loading: Ref<boolean | undefined>,
  error: Ref<string | null | undefined>,
  cards: Ref<any[] | undefined>
) {
  const isLoading = computed(() => loading.value);
  const hasError = computed(() => !!error.value);
  const isEmpty = computed(() => !loading.value && !error.value && (!cards.value || cards.value.length === 0));

  return {
    isLoading,
    hasError,
    isEmpty
  };
} 