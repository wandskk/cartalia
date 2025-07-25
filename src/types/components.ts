export interface BaseComponentProps {
  class?: string;
  id?: string;
}

export interface LoadingProps extends BaseComponentProps {
  loading?: boolean;
  text?: string;
}

export interface ErrorProps extends BaseComponentProps {
  error?: string | null;
  onRetry?: () => void;
}

export interface ListProps<T> extends BaseComponentProps {
  items: T[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  onRetry?: () => void;
}

export interface FormProps extends BaseComponentProps {
  loading?: boolean;
  error?: string | null;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export interface ModalProps extends BaseComponentProps {
  modelValue: boolean;
  title?: string;
  loading?: boolean;
  error?: string | null;
  onClose?: () => void;
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  image?: string;
  loading?: boolean;
  error?: string | null;
  onClick?: () => void;
}

export interface TableProps<T> extends BaseComponentProps {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  error?: string | null;
  sortable?: boolean;
  onSort?: (column: keyof T, order: 'asc' | 'desc') => void;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface PaginationProps extends BaseComponentProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

export interface FilterProps extends BaseComponentProps {
  filters: FilterOption[];
  selectedFilters: Record<string, any>;
  onFilterChange?: (filters: Record<string, any>) => void;
  onClearFilters?: () => void;
}

export interface FilterOption {
  key: string;
  label: string;
  type: 'text' | 'select' | 'multiselect' | 'date' | 'range';
  options?: FilterOptionValue[];
  placeholder?: string;
}

export interface FilterOptionValue {
  value: string | number;
  label: string;
}

export interface SearchProps extends BaseComponentProps {
  value: string;
  placeholder?: string;
  loading?: boolean;
  onSearch?: (query: string) => void;
  onClear?: () => void;
}

export interface SelectionProps<T> extends BaseComponentProps {
  items: T[];
  selectedItems: T[];
  multiple?: boolean;
  loading?: boolean;
  error?: string | null;
  onSelectionChange?: (items: T[]) => void;
  itemKey?: keyof T;
  itemLabel?: keyof T | ((item: T) => string);
}

export interface SelectionItem<T> {
  item: T;
  selected: boolean;
  disabled?: boolean;
}

export interface SidebarProps extends BaseComponentProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export interface NavItem {
  label: string;
  icon?: string;
  to?: string;
  children?: NavItem[];
}

export interface NavigationProps extends BaseComponentProps {
  items: NavItem[];
  activeItem?: string;
  onItemClick?: (item: NavItem) => void;
}

export interface UserProps extends BaseComponentProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout?: () => void;
} 
