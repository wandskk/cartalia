import { ref, computed } from 'vue';

export interface ModalState {
  isOpen: boolean;
  data?: any;
}

export function useModal<T = any>(initialData?: T) {
  const state = ref<ModalState>({
    isOpen: false,
    data: initialData
  });

  const isOpen = computed(() => state.value.isOpen);
  const data = computed(() => state.value.data);

  function open(data?: T) {
    state.value.isOpen = true;
    if (data !== undefined) {
      state.value.data = data;
    }
  }

  function close() {
    state.value.isOpen = false;
    state.value.data = initialData;
  }

  function toggle() {
    state.value.isOpen = !state.value.isOpen;
  }

  function setData(data: T) {
    state.value.data = data;
  }

  return {
    state,
    isOpen,
    data,
    open,
    close,
    toggle,
    setData
  };
} 