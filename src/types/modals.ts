export interface BaseModalProps {
  modelValue: boolean;
  title?: string;
  width?: string | number;
  persistent?: boolean;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

export interface BaseModalEmits {
  'update:modelValue': [value: boolean];
  close: [];
  confirm: [];
  cancel: [];
}

export interface ConfirmationModalProps extends BaseModalProps {
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'error' | 'info' | 'success';
  loading?: boolean;
}

export interface FormModalProps extends BaseModalProps {
  loading?: boolean;
  error?: string | null;
  submitText?: string;
  cancelText?: string;
  onConfirm?: (data: any) => void;
  onCancel?: () => void;
}

export interface ListModalProps extends BaseModalProps {
  items: any[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  onItemClick?: (item: any) => void;
  onRetry?: () => void;
}

export interface LoadingModalProps {
  loading: boolean;
  text?: string;
  showSpinner?: boolean;
  showProgress?: boolean;
  progress?: number;
}

export interface LoadingModalState {
  isLoading: boolean;
  loadingText: string;
  showSpinner: boolean;
  showProgress: boolean;
  progressValue: number;
}

export interface ErrorModalProps {
  error: string | null;
  showIcon?: boolean;
  retryText?: string;
  onRetry?: () => void;
}

export interface ErrorModalState {
  hasError: boolean;
  errorMessage: string | null;
  showRetryButton: boolean;
}

export interface EmptyModalProps {
  isEmpty: boolean;
  emptyMessage: string;
  emptyIcon?: string;
  showAction?: boolean;
  actionText?: string;
  onAction?: () => void;
}

export interface EmptyModalState {
  isEmpty: boolean;
  message: string;
  icon: string;
  showAction: boolean;
  actionText: string;
}

export interface PaginationModalProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

export interface PaginationModalState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SearchModalProps {
  searchQuery: string;
  placeholder?: string;
  loading?: boolean;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  debounce?: number;
}

export interface SearchModalState {
  query: string;
  isSearching: boolean;
  hasResults: boolean;
}

export interface SelectionModalProps {
  items: any[];
  selectedItems: any[];
  multiple?: boolean;
  loading?: boolean;
  error?: string | null;
  onSelectionChange?: (items: any[]) => void;
  itemKey?: string;
  itemLabel?: string | ((item: any) => string);
}

export interface SelectionModalState {
  items: any[];
  selectedItems: any[];
  isMultiple: boolean;
  isLoading: boolean;
  hasError: boolean;
}

export interface FilterModalProps {
  filters: FilterOption[];
  selectedFilters: Record<string, any>;
  onFilterChange?: (filters: Record<string, any>) => void;
  onClearFilters?: () => void;
  onApplyFilters?: () => void;
}

export interface FilterOption {
  key: string;
  label: string;
  type: 'text' | 'select' | 'multiselect' | 'date' | 'range';
  options?: FilterOptionValue[];
  placeholder?: string;
  required?: boolean;
}

export interface FilterOptionValue {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface FilterModalState {
  filters: FilterOption[];
  selectedFilters: Record<string, any>;
  hasChanges: boolean;
  isValid: boolean;
}

export interface NotificationModalProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  showIcon?: boolean;
  showCloseButton?: boolean;
  onClose?: () => void;
}

export interface NotificationModalState {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  isVisible: boolean;
  showIcon: boolean;
  showCloseButton: boolean;
} 