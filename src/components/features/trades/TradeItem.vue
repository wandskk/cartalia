<template>
  <div class="trade-item">
    <div class="trade-header">
      <div class="trade-meta">
        <div class="trade-date">
          <span class="date-icon">📅</span>
          {{ formattedDate }}
        </div>
        <div class="trade-id">
          <span class="id-icon">🆔</span>
          #{{ trade.id.slice(0, 8) }}
        </div>
      </div>
      
      <div v-if="showActions" class="trade-actions">
        <div class="actions-menu">
          <button 
            class="menu-trigger" 
            type="button" 
            aria-expanded="false"
            @click="toggleMenu"
          >
            <span class="dots">•••</span>
          </button>
          
          <div v-if="menuOpen" class="menu-dropdown">
            <button 
              v-if="canEdit"
              @click="handleEdit"
              class="menu-item"
            >
              <span class="menu-icon">✏️</span>
              Editar
            </button>
            <button 
              v-if="canDelete"
              @click="handleDelete"
              class="menu-item delete"
            >
              <span class="menu-icon">🗑️</span>
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="trade-content">
      <div class="cards-section">
        <div class="offering-section">
          <h4>
            <span class="section-icon">📤</span>
            Oferecendo
          </h4>
          <div class="cards-preview">
            <div 
              v-for="tradeCard in offeringCards" 
              :key="tradeCard.id"
              class="card-preview"
            >
              <div class="card-image">
                <img :src="tradeCard.card.imageUrl" :alt="tradeCard.card.name" />
                <div class="card-overlay">
                  <span class="card-name">{{ tradeCard.card.name }}</span>
                </div>
              </div>
              <div class="card-info">
                <span class="card-name">{{ tradeCard.card.name }}</span>
                <span class="card-description">{{ tradeCard.card.description }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="trade-arrow">
          <div class="arrow-container">
            <span class="arrow-icon">⇄</span>
          </div>
        </div>

        <div class="receiving-section">
          <h4>
            <span class="section-icon">📥</span>
            Recebendo
          </h4>
          <div class="cards-preview">
            <div 
              v-for="tradeCard in receivingCards" 
              :key="tradeCard.id"
              class="card-preview"
            >
              <div class="card-image">
                <img :src="tradeCard.card.imageUrl" :alt="tradeCard.card.name" />
                <div class="card-overlay">
                  <span class="card-name">{{ tradeCard.card.name }}</span>
                </div>
              </div>
              <div class="card-info">
                <span class="card-name">{{ tradeCard.card.name }}</span>
                <span class="card-description">{{ tradeCard.card.description }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="trade-footer">
      <div class="trade-stats">
        <span class="stat-item">
          <span class="stat-icon">🃏</span>
          {{ trade.tradeCards.length }} cartas
        </span>
        <span class="stat-item">
          <span class="stat-icon">👤</span>
          {{ trade.user.name }}
        </span>
      </div>
      <div v-if="showStatus" class="trade-status">
        <span :class="['status-badge', statusClass]">{{ statusText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '../../../stores/auth';
import type { Trade } from '../../../types';

interface Props {
  trade: Trade;
  showActions?: boolean;
  showStatus?: boolean;
  status?: 'active' | 'completed' | 'expired' | 'pending';
}

interface Emits {
  (e: 'edit', trade: Trade): void;
  (e: 'delete', trade: Trade): void;
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
  showStatus: true,
  status: 'active'
});

const emit = defineEmits<Emits>();

const authStore = useAuthStore();
const menuOpen = ref(false);

const formattedDate = computed(() => {
  return new Date(props.trade.createdAt).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

const offeringCards = computed(() => {
  return props.trade.tradeCards.filter(tradeCard => tradeCard.type === 'OFFERING');
});

const receivingCards = computed(() => {
  return props.trade.tradeCards.filter(tradeCard => tradeCard.type === 'RECEIVING');
});

const isOwner = computed(() => {
  return authStore.user?.id === props.trade.userId;
});

const canEdit = computed(() => {
  return isOwner.value;
});

const canDelete = computed(() => {
  return isOwner.value;
});

const statusText = computed(() => {
  switch (props.status) {
    case 'active': return 'Ativa';
    case 'completed': return 'Concluída';
    case 'expired': return 'Expirada';
    case 'pending': return 'Pendente';
    default: return 'Ativa';
  }
});

const statusClass = computed(() => {
  switch (props.status) {
    case 'active': return 'active';
    case 'completed': return 'completed';
    case 'expired': return 'expired';
    case 'pending': return 'pending';
    default: return 'active';
  }
});

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

function handleEdit() {
  menuOpen.value = false;
  emit('edit', props.trade);
}

function handleDelete() {
  menuOpen.value = false;
  emit('delete', props.trade);
}

// Close menu when clicking outside
function handleClickOutside(event: Event) {
  const target = event.target as HTMLElement;
  if (!target.closest('.actions-menu')) {
    menuOpen.value = false;
  }
}

// Add click outside listener
if (typeof window !== 'undefined') {
  document.addEventListener('click', handleClickOutside);
}
</script>

<style scoped lang="scss">
@use '../../../styles/_variables.scss' as *;

.trade-item {
  background: $white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba($primary, 0.1);
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }

  .trade-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;

    .trade-meta {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .trade-date,
      .trade-id {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: $gray-600;

        .date-icon,
        .id-icon {
          font-size: 14px;
        }
      }
    }

    .trade-actions {
      position: relative;

      .actions-menu {
        .menu-trigger {
          background: none;
          border: none;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            background: $gray-100;
          }

          .dots {
            font-size: 16px;
            color: $gray-600;
            font-weight: bold;
          }
        }

        .menu-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: $white;
          border: 1px solid $gray-200;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          min-width: 120px;
          overflow: hidden;

          .menu-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 16px;
            border: none;
            background: none;
            width: 100%;
            text-align: left;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 14px;

            &:hover {
              background: $gray-50;
            }

            &.delete {
              color: $error;

              &:hover {
                background: rgba($error, 0.1);
              }
            }

            .menu-icon {
              font-size: 16px;
            }
          }
        }
      }
    }
  }

  .trade-content {
    .cards-section {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 24px;
      align-items: start;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .offering-section,
      .receiving-section {
        h4 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: $black;

          .section-icon {
            font-size: 18px;
          }
        }

        .cards-preview {
          display: flex;
          flex-direction: column;
          gap: 12px;

          .card-preview {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: $gray-50;
            border-radius: 12px;
            border: 2px solid $gray-200;
            transition: all 0.2s ease;
            position: relative;

            &:hover {
              border-color: $primary;
              background: rgba($primary, 0.05);

              .card-overlay {
                opacity: 1;
              }
            }

            .card-image {
              width: 48px;
              height: 68px;
              border-radius: 8px;
              overflow: hidden;
              flex-shrink: 0;
              position: relative;

              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }

              .card-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.2s ease;

                .card-name {
                  color: $white;
                  font-size: 10px;
                  font-weight: 600;
                  text-align: center;
                  padding: 4px;
                  line-height: 1.2;
                }
              }
            }

            .card-info {
              flex: 1;
              display: flex;
              flex-direction: column;
              gap: 4px;

              .card-name {
                font-size: 14px;
                font-weight: 600;
                color: $black;
                line-height: 1.2;
              }

              .card-description {
                font-size: 12px;
                color: $gray-600;
                line-height: 1.3;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
              }
            }
          }
        }
      }

      .trade-arrow {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px 0;

        .arrow-container {
          width: 48px;
          height: 48px;
          background: $primary;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba($primary, 0.3);

          .arrow-icon {
            font-size: 20px;
            color: $white;
            font-weight: bold;
          }
        }

        @media (max-width: 768px) {
          .arrow-container {
            transform: rotate(90deg);
          }
        }
      }
    }
  }

  .trade-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid $gray-200;

    .trade-stats {
      display: flex;
      gap: 16px;

      .stat-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: $gray-600;

        .stat-icon {
          font-size: 14px;
        }
      }
    }

    .trade-status {
      .status-badge {
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;

        &.active {
          background: rgba($success, 0.1);
          color: $success;
        }

        &.completed {
          background: rgba($primary, 0.1);
          color: $primary;
        }

        &.expired {
          background: rgba($error, 0.1);
          color: $error;
        }

        &.pending {
          background: rgba($warning, 0.1);
          color: $warning;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .trade-item {
    padding: 16px;

    .trade-header {
      .trade-meta {
        .trade-date,
        .trade-id {
          font-size: 11px;
        }
      }
    }

    .trade-content {
      .cards-section {
        .offering-section,
        .receiving-section {
          .cards-preview {
            .card-preview {
              .card-image {
                width: 40px;
                height: 56px;
              }

              .card-info {
                .card-name {
                  font-size: 13px;
                }

                .card-description {
                  font-size: 11px;
                }
              }
            }
          }
        }
      }
    }

    .trade-footer {
      flex-direction: column;
      gap: 12px;
      align-items: stretch;

      .trade-stats {
        justify-content: center;
        flex-wrap: wrap;
      }

      .trade-status {
        text-align: center;
      }
    }
  }
}

@media (max-width: 480px) {
  .trade-item {
    padding: 12px;

    .trade-content {
      .cards-section {
        .offering-section,
        .receiving-section {
          .cards-preview {
            .card-preview {
              flex-direction: column;
              text-align: center;
              gap: 8px;

              .card-image {
                width: 60px;
                height: 84px;
              }

              .card-info {
                .card-name {
                  font-size: 14px;
                }

                .card-description {
                  font-size: 12px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style> 