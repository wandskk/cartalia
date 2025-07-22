export function parseApiError(e: any, type: 'login' | 'register'): string {
  if (e?.response?.data?.message) {
    return e.response.data.message;
  }
  if (type === 'login') {
    return 'E-mail ou senha inválidos';
  }
  if (type === 'register') {
    return 'Erro ao registrar. Tente novamente.';
  }
  return 'Erro inesperado. Tente novamente.';
} 
