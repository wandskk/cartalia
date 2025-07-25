export interface BaseState {
  loading: boolean;
  error: string | null;
}

export interface PaginatedState<T> extends BaseState {
  items: T[];
  pagination: {
    page: number;
    rpp: number;
    total: number;
    more: boolean;
  };
}

export interface SingleEntityState<T> extends BaseState {
  item: T | null;
}

export interface SimpleListState<T> extends BaseState {
  items: T[];
}

export interface BaseActions {
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export interface PaginatedActions<T> extends BaseActions {
  fetchItems: (page?: number, rpp?: number) => Promise<void>;
  setItems: (items: T[]) => void;
  addItem: (item: T) => void;
  updateItem: (id: string, updates: Partial<T>) => void;
  removeItem: (id: string) => void;
  setPagination: (pagination: { page: number; rpp: number; total: number; more: boolean }) => void;
}

export interface SingleEntityActions<T> extends BaseActions {
  fetchItem: (id: string) => Promise<void>;
  setItem: (item: T | null) => void;
  updateItem: (updates: Partial<T>) => void;
  clearItem: () => void;
}

export interface SimpleListActions<T> extends BaseActions {
  fetchItems: () => Promise<void>;
  setItems: (items: T[]) => void;
  addItem: (item: T) => void;
  updateItem: (id: string, updates: Partial<T>) => void;
  removeItem: (id: string) => void;
}

export interface BaseGetters {
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

export interface PaginatedGetters<T> extends BaseGetters {
  items: T[];
  pagination: {
    page: number;
    rpp: number;
    total: number;
    more: boolean;
  };
  hasItems: boolean;
  isEmpty: boolean;
  canLoadMore: boolean;
}

export interface SingleEntityGetters<T> extends BaseGetters {
  item: T | null;
  hasItem: boolean;
}

export interface SimpleListGetters<T> extends BaseGetters {
  items: T[];
  hasItems: boolean;
  isEmpty: boolean;
} 
