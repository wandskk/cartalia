export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface PaginationParams {
  page: number;
  rpp: number;
}

export interface PaginationResponse {
  page: number;
  rpp: number;
  more: boolean;
}

export interface BaseFilters {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  list: T[];
  rpp: number;
  page: number;
  more: boolean;
}

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

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
