import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useLoadingStore } from '../stores/loading';
import { useNotificationStore } from '../stores/notification';
import { parseApiError } from '../utils/parseApiError';

export function useAuthForm(type: 'login' | 'register') {
  const loading = ref(false);
  const error = ref('');
  const auth = useAuthStore();
  const globalLoading = useLoadingStore();
  const notification = useNotificationStore();
  const router = useRouter();

  async function onSubmit(values: any) {
    error.value = '';
    loading.value = true;
    globalLoading.startLoading();
    try {
      if (type === 'login') {
        await auth.login(values.email, values.password);
        notification.show('Login realizado com sucesso!', 'success');
      } else {
        await auth.register(values.name, values.email, values.password);
        notification.show('Cadastro realizado com sucesso!', 'success');
      }
      router.push('/dashboard');
    } catch (e: any) {
      error.value = parseApiError(e, type);
      notification.show(error.value, 'error');
    } finally {
      loading.value = false;
      globalLoading.stopLoading();
    }
  }

  return { onSubmit, loading, error };
} 