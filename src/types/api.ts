// Tipos relacionados à API

// Configuração da API
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

// Estados de requisição
export interface ApiState<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Tipos de requisição
export interface ApiRequest<T = any> {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: T;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

// Tipos de resposta
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

// Tipos de erro da API
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

// Interceptors
export interface RequestInterceptor {
  onRequest?: (config: ApiRequest) => ApiRequest | Promise<ApiRequest>;
  onRequestError?: (error: ApiError) => ApiError | Promise<ApiError>;
}

export interface ResponseInterceptor {
  onResponse?: <T>(response: ApiResponse<T>) => ApiResponse<T> | Promise<ApiResponse<T>>;
  onResponseError?: (error: ApiError) => ApiError | Promise<ApiError>;
}

// Cache
export interface CacheConfig {
  enabled: boolean;
  ttl: number; // Time to live in milliseconds
  maxSize: number;
}

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
} 
