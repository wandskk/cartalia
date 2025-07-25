import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useCardsStore } from "../stores/cards";
import { useTradesStore } from "../stores/trades";

export function useDashboard() {
  const router = useRouter();
  const authStore = useAuthStore();
  const cardsStore = useCardsStore();
  const tradesStore = useTradesStore();
  const isInitialized = ref(false);

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

  onMounted(async () => {
    // Se já temos token mas não temos dados do usuário, vamos buscar o perfil primeiro
    if (authStore.token && !authStore.user) {
      try {
        await authStore.fetchUserProfile();
      } catch (error) {
        console.error('Erro ao buscar perfil do usuário:', error);
        router.push("/login");
        return;
      }
    }

    if (authStore.isAuthenticated) {
      await fetchData();
      isInitialized.value = true;
    } else {
      router.push("/login");
    }
  });

  async function fetchData() {
    try {
      await Promise.all([
        authStore.fetchUserProfile(),
        cardsStore.fetchUserCards(),
        tradesStore.fetchAllTrades(),
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      // Se houver erro na autenticação, redirecionar para login
      if (error instanceof Error && error.message.includes('token')) {
        router.push("/login");
      }
    }
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
    isInitialized,
    fetchData,
  };
}
