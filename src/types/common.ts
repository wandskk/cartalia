// Tipos comuns reutilizáveis

// Estados de loading
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Paginação
export interface Pagination {
  page: number;
  rpp: number;
  more: boolean;
}

// Filtros básicos
export interface BaseFilters {
  search?: string;
  page: number;
  rpp: number;
}

// Respostas paginadas
export interface PaginatedResponse<T> {
  list: T[];
  rpp: number;
  page: number;
  more: boolean;
}

// Tipos de notificação
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

// Tipos de erro
export type ErrorType = 'api' | 'validation' | 'network' | 'auth' | 'unknown';

export interface AppError {
  id: string;
  type: ErrorType;
  message: string;
  details?: string;
  timestamp: Date;
  component?: string;
  stack?: string;
}

// Tipos de eventos
export interface FormEvent {
  target: {
    value: string;
    name: string;
  };
}

export interface ClickEvent {
  preventDefault: () => void;
  stopPropagation: () => void;
} 
