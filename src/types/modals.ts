/**
 * Tipos para modais e componentes de UI
 */

// Props base para modais
export interface BaseModalProps {
  modelValue: boolean;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  persistent?: boolean;
  closeOnOverlay?: boolean;
  showCloseButton?: boolean;
}

// Emits base para modais
export interface BaseModalEmits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close'): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}

// Props para modais de confirmação
export interface ConfirmationModalProps extends BaseModalProps {
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  cancelColor?: string;
  loading?: boolean;
}

// Props para modais de formulário
export interface FormModalProps extends BaseModalProps {
  loading?: boolean;
  disabled?: boolean;
  submitText?: string;
  cancelText?: string;
}

// Props para modais de lista
export interface ListModalProps extends BaseModalProps {
  items: any[];
  loading?: boolean;
  emptyMessage?: string;
  searchable?: boolean;
  selectable?: boolean;
  multiple?: boolean;
}

// Estados de loading para modais
export interface ModalLoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
  indeterminate?: boolean;
}

// Props para componentes de loading em modais
export interface ModalLoadingProps {
  loading: boolean;
  message?: string;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  overlay?: boolean;
  progress?: number;
  indeterminate?: boolean;
}

// Estados de erro para modais
export interface ModalErrorState {
  hasError: boolean;
  message?: string;
  details?: string;
  retryable?: boolean;
}

// Props para componentes de erro em modais
export interface ModalErrorProps {
  error?: string | null;
  retryable?: boolean;
  onRetry?: () => void;
  showDetails?: boolean;
}

// Estados vazios
export interface EmptyState {
  isEmpty: boolean;
  message?: string;
  icon?: string;
  actionText?: string;
  onAction?: () => void;
}

// Props para componentes de estado vazio
export interface EmptyProps {
  message?: string;
  icon?: string;
  actionText?: string;
  onAction?: () => void;
  showAction?: boolean;
}

// Estados de paginação para modais
export interface ModalPaginationState {
  page: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Props para componentes de paginação em modais
export interface ModalPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  showInfo?: boolean;
  showFirstLast?: boolean;
  disabled?: boolean;
}

// Estados de busca para modais
export interface ModalSearchState {
  query: string;
  isSearching: boolean;
  hasResults: boolean;
  totalResults: number;
}

// Props para componentes de busca em modais
export interface ModalSearchProps {
  modelValue: string;
  placeholder?: string;
  debounce?: number;
  minLength?: number;
  maxLength?: number;
  disabled?: boolean;
  loading?: boolean;
  clearable?: boolean;
}

// Estados de seleção
export interface SelectionState {
  selectedItems: string[];
  totalSelected: number;
  hasSelection: boolean;
  isAllSelected: boolean;
  isIndeterminate: boolean;
}

// Props para componentes de seleção
export interface SelectionProps {
  modelValue: string[];
  items: any[];
  multiple?: boolean;
  maxSelection?: number;
  disabled?: boolean;
}

// Estados de filtros para modais
export interface ModalFilterState {
  filters: Record<string, any>;
  hasActiveFilters: boolean;
  totalActiveFilters: number;
}

// Props para componentes de filtros em modais
export interface ModalFilterProps {
  modelValue: Record<string, any>;
  availableFilters: ModalFilterOption[];
  disabled?: boolean;
  collapsible?: boolean;
}

// Opções de filtro para modais
export interface ModalFilterOption {
  key: string;
  label: string;
  type: 'text' | 'select' | 'multiselect' | 'date' | 'range';
  options?: FilterOptionValue[];
  placeholder?: string;
  multiple?: boolean;
}

// Valores de opção de filtro
export interface FilterOptionValue {
  value: string | number;
  label: string;
  disabled?: boolean;
}

// Estados de notificação
export interface NotificationState {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  persistent?: boolean;
  actionText?: string;
  onAction?: () => void;
}

// Props para componentes de notificação
export interface NotificationProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  persistent?: boolean;
  actionText?: string;
  onAction?: () => void;
  closable?: boolean;
} 