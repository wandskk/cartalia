import { useErrorStore } from '../stores/error';

export interface ApiErrorResponse {
  message: string;
  details?: string;
  status?: number;
  code?: string;
}

export function handleApiError(error: any, component?: string): string {
  const errorStore = useErrorStore();
  
  let message = 'Erro interno do servidor';
  let details: string | undefined;

  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        message = 'Dados inválidos';
        details = data?.message || 'Verifique os dados enviados';
        break;
      case 401:
        message = 'Não autorizado';
        details = 'Faça login para continuar';
        errorStore.addAuthError(message, details, component);
        return message;
      case 403:
        message = 'Acesso negado';
        details = 'Você não tem permissão para esta ação';
        break;
      case 404:
        message = 'Recurso não encontrado';
        details = 'O item solicitado não existe';
        break;
      case 409:
        message = 'Conflito';
        details = data?.message || 'O recurso já existe';
        break;
      case 422:
        message = 'Dados inválidos';
        details = data?.message || 'Verifique os dados enviados';
        errorStore.addValidationError(message, details, component);
        return message;
      case 429:
        message = 'Muitas requisições';
        details = 'Aguarde um momento antes de tentar novamente';
        break;
      case 500:
        message = 'Erro interno do servidor';
        details = 'Tente novamente mais tarde';
        break;
      default:
        message = data?.message || `Erro ${status}`;
        details = data?.details;
    }
  } else if (error.request) {
    message = 'Erro de conexão';
    details = 'Verifique sua conexão com a internet';
    errorStore.addNetworkError(message, details, component);
    return message;
  } else {
    message = error.message || 'Erro desconhecido';
    details = error.stack;
  }

  errorStore.addApiError(message, details, component);
  return message;
}

export function handleValidationError(errors: any, component?: string): string {
  const errorStore = useErrorStore();
  
  let message = 'Erro de validação';
  let details = '';

  if (typeof errors === 'string') {
    details = errors;
  } else if (Array.isArray(errors)) {
    details = errors.join(', ');
  } else if (typeof errors === 'object') {
    details = Object.values(errors).join(', ');
  }

  errorStore.addValidationError(message, details, component);
  return message;
}

export function handleNetworkError(_error: any, component?: string): string {
  const errorStore = useErrorStore();
  
  const message = 'Erro de conexão';
  const details = 'Verifique sua conexão com a internet e tente novamente';

  errorStore.addNetworkError(message, details, component);
  return message;
}

export function handleAuthError(error: any, component?: string): string {
  const errorStore = useErrorStore();
  
  let message = 'Erro de autenticação';
  let details = 'Faça login para continuar';

  if (error.response?.status === 401) {
    message = 'Sessão expirada';
    details = 'Faça login novamente para continuar';
  } else if (error.message) {
    message = error.message;
  }

  errorStore.addAuthError(message, details, component);
  return message;
}

export function isNetworkError(error: any): boolean {
  return !error.response && error.request;
}

export function isApiError(error: any): boolean {
  return error.response && error.response.status;
}

export function isValidationError(error: any): boolean {
  return error.response?.status === 422 || error.response?.status === 400;
}

export function isAuthError(error: any): boolean {
  return error.response?.status === 401 || error.response?.status === 403;
}

export function getErrorMessage(error: any): string {
  if (isNetworkError(error)) {
    return 'Erro de conexão. Verifique sua internet.';
  }
  
  if (isAuthError(error)) {
    return 'Erro de autenticação. Faça login novamente.';
  }
  
  if (isValidationError(error)) {
    return 'Dados inválidos. Verifique as informações.';
  }
  
  if (isApiError(error)) {
    return error.response?.data?.message || 'Erro interno do servidor.';
  }
  
  return error.message || 'Erro desconhecido.';
} 