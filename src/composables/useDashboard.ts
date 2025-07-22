import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useCardsStore } from '../stores/cards';
import { useTradesStore } from '../stores/trades';

export function useDashboard() {
  const router = useRouter();
  const authStore = useAuthStore();
  const cardsStore = useCardsStore();
  const tradesStore = useTradesStore();

  const loading = computed(() => cardsStore.loading || tradesStore.loading);
  const error = computed(() => cardsStore.error || tradesStore.error);

  const userCards = computed(() => cardsStore.userCards);
  const userTradesList = computed(() => tradesStore.userTrades);

  const totalCards = computed(() => cardsStore.totalUserCards);
  const totalTrades = computed(() => tradesStore.totalUserTrades);
  const activeTrades = computed(() => tradesStore.totalUserTrades);
  const userTrades = computed(() => tradesStore.totalUserTrades);
  const marketplaceTrades = computed(() => tradesStore.totalTrades);

  const uniqueCards = computed(() => {
    const uniqueNames = new Set(userCards.value.map((card) => card.name));
    return uniqueNames.size;
  });

  onMounted(() => {
    if (authStore.isAuthenticated) {
      fetchData();
    } else {
      router.push("/login");
    }
  });

  async function fetchData() {
    await Promise.all([
      cardsStore.fetchUserCards(),
      tradesStore.fetchAllTrades(),
    ]);
  }

  return {
    loading,
    error,
    userCards,
    userTradesList,
    totalCards,
    totalTrades,
    activeTrades,
    userTrades,
    marketplaceTrades,
    uniqueCards,
    fetchData
  };
} 
