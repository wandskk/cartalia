<template>
  <div class="mb-0">
    <h3 class="text-h4 font-weight-bold text-center mb-8">Ações Rápidas</h3>

    <div class="actions-grid">
      <v-card
        v-for="action in actions"
        :key="action.title"
        @click="action.handler"
        class="action-card d-flex align-center pa-6 ga-6"
        elevation="2"
      >
        <div class="d-flex align-center justify-center mb-3">
          <v-icon :icon="action.icon" size="28" color="primary"></v-icon>
        </div>

        <div class="flex-grow-1 min-width-0">
          <h4 class="text-h6 font-weight-bold mb-2">{{ action.title }}</h4>
          <p class="text-body-2 text-grey mb-3">{{ action.description }}</p>
          <v-chip :color="action.chipColor" variant="tonal" size="small">
            {{ action.meta }}
          </v-chip>
        </div>

        <v-icon size="20" color="grey">mdi-chevron-right</v-icon>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

interface Props {
  totalCards: number;
  userTrades: number;
  marketplaceTrades: number;
}

const props = defineProps<Props>();
const router = useRouter();

const actions = [
  {
    title: "Adicionar Cartas",
    description: "Adicione cartas à sua coleção",
    icon: "mdi-cards",
    meta: `${props.totalCards} cart${props.totalCards !== 1 ? "as" : "a"}`,
    action: () => router.push("/cards"),
  },
  {
    icon: "mdi-store",
    title: "Marketplace",
    description: "Explore trocas disponíveis no marketplace",
    meta: `${props.marketplaceTrades} troca${
      props.marketplaceTrades !== 1 ? "s" : ""
    } disponíve${props.marketplaceTrades !== 1 ? "is" : "l"}`,
    chipColor: "secondary",
    handler: () => router.push("/marketplace"),
  },
  {
    icon: "mdi-clipboard-list",
    title: "Minhas Trocas",
    description: "Gerencie suas solicitações de troca",
    meta: `${props.userTrades} troca${props.userTrades !== 1 ? "s" : ""} ativa${
      props.userTrades !== 1 ? "s" : ""
    }`,
    chipColor: "info",
    handler: () => router.push("/my-trades"),
  },
  {
    icon: "mdi-plus-circle",
    title: "Nova Troca",
    description: "Crie uma nova solicitação de troca",
    meta: "Criar agora",
    chipColor: "success",
    handler: () => router.push("/my-trades"),
  },
];
</script>

<style scoped>
.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  width: 100%;
}

.action-card {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.action-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.95) !important;
  border-color: rgba(var(--v-theme-primary), 0.2);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
}

.action-card:hover .v-icon {
  transform: translateX(6px);
  color: rgb(var(--v-theme-primary)) !important;
}

@media (max-width: 1024px) {
  .actions-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .actions-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .action-card {
    padding: 20px !important;
    gap: 16px !important;
  }

  .action-card .v-avatar {
    width: 56px !important;
    height: 56px !important;
  }

  .action-card .v-avatar span {
    font-size: 24px !important;
  }
}

@media (max-width: 480px) {
  .actions-grid {
    gap: 14px;
  }

  .action-card {
    padding: 16px !important;
    gap: 12px !important;
  }

  .action-card .v-avatar {
    width: 48px !important;
    height: 48px !important;
  }

  .action-card .v-avatar span {
    font-size: 20px !important;
  }
}
</style>
