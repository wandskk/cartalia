import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationStore = defineStore('notification', () => {
  const message = ref<string | null>(null);
  const type = ref<'success' | 'error' | null>(null);

  function show(msg: string, msgType: 'success' | 'error' = 'success') {
    message.value = msg;
    type.value = msgType;
    setTimeout(() => clear(), 3000);
  }

  function clear() {
    message.value = null;
    type.value = null;
  }

  return { message, type, show, clear };
}); 