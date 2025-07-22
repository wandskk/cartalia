// Tipos relacionados aos stores

// Estado base para stores
export interface BaseStoreState {
  loading: boolean;
  error: string | null;
}

// Estado paginado
export interface PaginatedStoreState<T> extends BaseStoreState {
  data: T[];
  pagination: {
    page: number;
    rpp: number;
    more: boolean;
  };
}

// Estado de entidade única
export interface SingleEntityStoreState<T> extends BaseStoreState {
  data: T | null;
}

// Estado de lista simples
export interface ListStoreState<T> extends BaseStoreState {
  data: T[];
}

// Ações base para stores
export interface BaseStoreActions {
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Ações para stores paginados
export interface PaginatedStoreActions<T> extends BaseStoreActions {
  setData: (data: T[]) => void;
  setPagination: (pagination: { page: number; rpp: number; more: boolean }) => void;
  appendData: (data: T[]) => void;
  clearData: () => void;
}

// Ações para entidade única
export interface SingleEntityStoreActions<T> extends BaseStoreActions {
  setData: (data: T | null) => void;
  clearData: () => void;
}

// Ações para lista simples
export interface ListStoreActions<T> extends BaseStoreActions {
  setData: (data: T[]) => void;
  addItem: (item: T) => void;
  removeItem: (predicate: (item: T) => boolean) => void;
  updateItem: (predicate: (item: T) => boolean, updates: Partial<T>) => void;
  clearData: () => void;
}

// Getters base
export interface BaseStoreGetters {
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

// Getters para stores paginados
export interface PaginatedStoreGetters<T> extends BaseStoreGetters {
  items: T[];
  totalItems: number;
  currentPage: number;
  hasMore: boolean;
  isEmpty: boolean;
}

// Getters para entidade única
export interface SingleEntityStoreGetters<T> extends BaseStoreGetters {
  data: T | null;
  hasData: boolean;
}

// Getters para lista simples
export interface ListStoreGetters<T> extends BaseStoreGetters {
  items: T[];
  totalItems: number;
  isEmpty: boolean;
} 
