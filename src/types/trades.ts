export interface CreateTradeForm {
  cards: TradeCard[];
}

export interface TradeCard {
  cardId: string;
  type: 'OFFERING' | 'RECEIVING';
}

export interface Trade {
  id: string;
  userId: string;
  createdAt: string;
  user: {
    name: string;
  };
  tradeCards: TradeCardDetail[];
}

export interface TradeCardDetail {
  id: string;
  cardId: string;
  tradeId: string;
  type: 'OFFERING' | 'RECEIVING';
  card: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    createdAt: string;
  };
}

export interface TradeListResponse {
  list: Trade[];
  rpp: number;
  page: number;
  more: boolean;
}

export interface CreateTradeResponse {
  tradeId: string;
}

export interface TradeFilters {
  search?: string;
  type?: 'OFFERING' | 'RECEIVING';
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface TradeSortOptions {
  field: 'createdAt' | 'user.name' | 'cardCount';
  order: 'asc' | 'desc';
}

export interface TradeStats {
  totalTrades: number;
  activeTrades: number;
  completedTrades: number;
  cancelledTrades: number;
}

export interface TradeState {
  trades: Trade[];
  selectedTrade: Trade | null;
  filters: TradeFilters;
  sortOptions: TradeSortOptions;
  stats: TradeStats;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    rpp: number;
    total: number;
    more: boolean;
  };
}

export interface TradeActions {
  fetchTrades: (page?: number, rpp?: number) => Promise<void>;
  createTrade: (tradeData: CreateTradeForm) => Promise<void>;
  deleteTrade: (tradeId: string) => Promise<void>;
  selectTrade: (trade: Trade) => void;
  clearSelectedTrade: () => void;
  setFilters: (filters: Partial<TradeFilters>) => void;
  clearFilters: () => void;
  setSortOptions: (sortOptions: TradeSortOptions) => void;
  clearError: () => void;
}

export interface TradeGetters {
  filteredTrades: Trade[];
  sortedTrades: Trade[];
  paginatedTrades: Trade[];
  hasTrades: boolean;
  isLoading: boolean;
  hasError: boolean;
  canLoadMore: boolean;
}

export interface TradeModalProps {
  trade?: Trade;
  loading?: boolean;
  error?: string | null;
  onConfirm?: (tradeData: CreateTradeForm) => void;
  onCancel?: () => void;
}

export interface TradeListProps {
  trades: Trade[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  onTradeClick?: (trade: Trade) => void;
  onTradeDelete?: (tradeId: string) => void;
  showUserInfo?: boolean;
  showActions?: boolean;
}

export interface TradeItemProps {
  trade: Trade;
  clickable?: boolean;
  showUserInfo?: boolean;
  showActions?: boolean;
  onTradeClick?: (trade: Trade) => void;
  onTradeDelete?: (tradeId: string) => void;
} 
