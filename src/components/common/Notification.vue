<template>
  <v-snackbar
    v-model="isVisible"
    :color="notificationStore.type || 'info'"
    :timeout="3000"
    location="top right"
    class="notification"
  >
    <div class="notification-content">
      <v-icon 
        :icon="getIcon(notificationStore.type || 'info')"
        class="notification-icon"
      />
      <div class="notification-text">
        <div class="notification-message">
          {{ notificationStore.message || '' }}
        </div>
      </div>
    </div>

    <template v-slot:actions>
      <v-btn
        icon
        variant="text"
        @click="closeNotification"
        size="small"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useNotificationStore } from '../../stores/notification';

const notificationStore = useNotificationStore();

const isVisible = computed({
  get: () => !!notificationStore.message,
  set: (value) => {
    if (!value) {
      notificationStore.clear();
    }
  }
});

const getIcon = (type: string | null) => {
  switch (type) {
    case 'success':
      return 'mdi-check-circle';
    case 'error':
      return 'mdi-alert-circle';
    case 'warning':
      return 'mdi-alert';
    case 'info':
    default:
      return 'mdi-information';
  }
};

const closeNotification = () => {
  notificationStore.clear();
};
</script>

<style scoped lang="scss">
.notification {
  z-index: 10000;
}

.notification-content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  flex: 1;
}

.notification-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.notification-text {
  flex: 1;
  min-width: 0;
}

.notification-message {
  font-size: 0.875rem;
  line-height: 1.4;
  color: inherit;
  font-weight: 500;
}
</style> 
