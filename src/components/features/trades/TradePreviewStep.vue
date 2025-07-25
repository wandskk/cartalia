<template>
  <div class="step-content flex-grow-1 d-flex flex-column overflow-hidden pa-6">
    <div class="step-header text-center mb-6">
      <h3 class="text-h5 mb-2">
        <v-icon color="primary" class="mr-2">mdi-eye</v-icon>
        Revisar Troca
      </h3>
      <p class="text-body-2 text-grey">
        Confirme os detalhes da sua troca antes de criar
      </p>
    </div>

    <div class="trade-preview">
      <v-row class="align-start">
        <!-- Offering Cards -->
        <v-col cols="12" md="5">
          <div class="offering-section">
            <h4 class="d-flex align-center mb-4 text-subtitle-1 font-weight-medium">
              <v-icon color="primary" class="mr-2">mdi-export</v-icon>
              Oferecendo
            </h4>
            <div class="cards-preview">
              <CardPreview
                v-for="card in offeringCards" 
                :key="card.id"
                :card="card"
                size="sm"
                class="mb-3"
                @click="handleCardClick"
              />
            </div>
            <div v-if="offeringCards.length === 0" class="text-center py-4 text-grey">
              <v-icon size="32" class="mb-2">mdi-alert-circle</v-icon>
              <p>Nenhuma carta selecionada</p>
            </div>
          </div>
        </v-col>

        <!-- Trade Arrow -->
        <v-col cols="12" md="2" class="d-flex justify-center align-center">
          <div class="trade-arrow">
            <v-avatar color="primary" size="48">
              <v-icon color="white" size="20">mdi-swap-horizontal</v-icon>
            </v-avatar>
          </div>
        </v-col>

        <!-- Receiving Cards -->
        <v-col cols="12" md="5">
          <div class="receiving-section">
            <h4 class="d-flex align-center mb-4 text-subtitle-1 font-weight-medium">
              <v-icon color="primary" class="mr-2">mdi-import</v-icon>
              Recebendo
            </h4>
            <div class="cards-preview">
              <CardPreview
                v-for="card in receivingCards" 
                :key="card.id"
                :card="card"
                size="sm"
                class="mb-3"
                @click="handleCardClick"
              />
            </div>
            <div v-if="receivingCards.length === 0" class="text-center py-4 text-grey">
              <v-icon size="32" class="mb-2">mdi-alert-circle</v-icon>
              <p>Nenhuma carta selecionada</p>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- Trade Summary -->
    <div class="trade-summary mt-6">
      <v-card variant="outlined" class="pa-4">
        <h5 class="text-subtitle-1 font-weight-medium mb-3">Resumo da Troca</h5>
        <div class="d-flex justify-space-between align-center">
          <div class="d-flex align-center">
            <v-icon size="16" color="grey" class="mr-2">mdi-cards</v-icon>
            <span class="text-caption text-grey">
              {{ offeringCards.length }} carta{{ offeringCards.length !== 1 ? 's' : '' }} oferecendo
            </span>
          </div>
          <div class="d-flex align-center">
            <v-icon size="16" color="grey" class="mr-2">mdi-cards</v-icon>
            <span class="text-caption text-grey">
              {{ receivingCards.length }} carta{{ receivingCards.length !== 1 ? 's' : '' }} recebendo
            </span>
          </div>
        </div>
      </v-card>
    </div>

    <!-- Validation Messages -->
    <div v-if="validationMessages.length > 0" class="validation-messages mt-4">
      <v-alert
        v-for="message in validationMessages"
        :key="message.id"
        :type="message.type"
        variant="tonal"
        class="mb-2"
      >
        {{ message.text }}
      </v-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CardPreview from '../../common/CardPreview.vue';
import type { Card } from '../../../types/cards';

interface ValidationMessage {
  id: string;
  type: 'warning' | 'error' | 'info';
  text: string;
}

interface Props {
  offeringCards: Card[];
  receivingCards: Card[];
  onCardClick?: (card: Card) => void;
}

const props = withDefaults(defineProps<Props>(), {
  onCardClick: undefined
});

const validationMessages = computed((): ValidationMessage[] => {
  const messages: ValidationMessage[] = [];

  if (props.offeringCards.length === 0) {
    messages.push({
      id: 'no-offering',
      type: 'error',
      text: 'Você deve selecionar pelo menos uma carta para oferecer'
    });
  }

  if (props.receivingCards.length === 0) {
    messages.push({
      id: 'no-receiving',
      type: 'error',
      text: 'Você deve selecionar pelo menos uma carta para receber'
    });
  }

  if (props.offeringCards.length > 0 && props.receivingCards.length > 0) {
    messages.push({
      id: 'ready',
      type: 'info',
      text: 'Troca pronta para ser criada!'
    });
  }

  return messages;
});

function handleCardClick(card: Card) {
  if (props.onCardClick) {
    props.onCardClick(card);
  }
}
</script>

<style scoped>
.trade-preview {
  flex-grow: 1;
}

.trade-arrow {
  padding: 16px 0;
}

.trade-summary {
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  padding-top: 16px;
}

.validation-messages {
  margin-top: 16px;
}

@media (max-width: 960px) {
  .trade-arrow .v-avatar {
    transform: rotate(90deg);
  }
}
</style> 