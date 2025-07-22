// Tipos específicos para componentes

// Props base para componentes
export interface BaseComponentProps {
  class?: string;
  id?: string;
  'data-testid'?: string;
}

// Props para componentes de loading
export interface LoadingProps extends BaseComponentProps {
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

// Props para componentes de erro
export interface ErrorProps extends BaseComponentProps {
  error?: string | null;
  showIcon?: boolean;
  retry?: () => void;
}

// Props para componentes de lista
export interface ListProps<T> extends BaseComponentProps {
  items: T[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  renderItem: (item: T, index: number) => any;
  keyExtractor?: (item: T, index: number) => string | number;
}

// Props para componentes de formulário
export interface FormProps extends BaseComponentProps {
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

// Props para componentes de modal
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

// Props para componentes de card
export interface CardProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  actions?: any[];
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

// Props para componentes de tabela
export interface TableProps<T> extends BaseComponentProps {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  sortable?: boolean;
  onSort?: (column: keyof T, direction: 'asc' | 'desc') => void;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, item: T) => any;
}

// Props para componentes de paginação
export interface PaginationProps extends BaseComponentProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
}

// Props para componentes de filtro
export interface FilterProps extends BaseComponentProps {
  filters: FilterOption[];
  values: Record<string, any>;
  onChange: (filters: Record<string, any>) => void;
  onClear?: () => void;
}

export interface FilterOption {
  key: string;
  label: string;
  type: 'text' | 'select' | 'checkbox' | 'date';
  options?: { value: any; label: string }[];
  placeholder?: string;
}

// Props para componentes de busca
export interface SearchProps extends BaseComponentProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  debounce?: number;
  clearable?: boolean;
}

// Props para componentes de seleção
export interface SelectProps<T> extends BaseComponentProps {
  value: T | null;
  options: SelectOption<T>[];
  onChange: (value: T | null) => void;
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  searchable?: boolean;
}

export interface SelectOption<T> {
  value: T;
  label: string;
  disabled?: boolean;
}

// Props para componentes de sidebar
export interface SidebarProps extends BaseComponentProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

// Props para itens de navegação
export interface NavigationItem {
  path: string;
  label: string;
  icon: string;
  requiresAuth: boolean;
}

// Props para componente de navegação
export interface NavigationProps extends BaseComponentProps {
  items: NavigationItem[];
  activePath: string;
  collapsed?: boolean;
}

// Props para componente de usuário
export interface UserInfoProps extends BaseComponentProps {
  user: {
    name?: string;
    email?: string;
  } | null;
  collapsed?: boolean;
} 
