import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../../../stores/auth';
import { AuthServices } from '../../../services/modules/auth';
import { mockUsers, mockApiResponses } from '../../mocks/data';

// Mock dos serviços
vi.mock('../../../services/modules/auth', () => ({
  AuthServices: {
    login: vi.fn(),
    register: vi.fn(),
    getUserProfile: vi.fn(),
  },
}));

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    vi.mocked(localStorage.getItem).mockReturnValue(null);
  });

  describe('Estado inicial', () => {
    it('deve ter estado inicial correto', () => {
      const store = useAuthStore();
      
      expect(store.user).toBeNull();
      expect(store.token).toBeNull();
      expect(store.isAuthenticated).toBe(false);
    });
  });

  describe('Login', () => {
    it('deve fazer login com sucesso', async () => {
      vi.mocked(AuthServices.login).mockResolvedValue(mockApiResponses.login);

      const store = useAuthStore();
      
      await store.login('test@example.com', 'password');

      expect(AuthServices.login).toHaveBeenCalledWith('test@example.com', 'password');
      expect(store.user).toEqual(mockUsers[0]);
      expect(store.token).toBe(mockApiResponses.login.token);
      expect(store.isAuthenticated).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledWith('tokenCartalia', mockApiResponses.login.token);
      expect(localStorage.setItem).toHaveBeenCalledWith('userCartalia', JSON.stringify(mockUsers[0]));
    });

    it('deve lidar com erro de login', async () => {
      const error = new Error('Invalid credentials');
      vi.mocked(AuthServices.login).mockRejectedValue(error);

      const store = useAuthStore();
      
      await expect(store.login('test@example.com', 'wrong-password')).rejects.toThrow('Invalid credentials');
      
      expect(store.user).toBeNull();
      expect(store.token).toBeNull();
      expect(store.isAuthenticated).toBe(false);
    });
  });

  describe('Register', () => {
    it('deve fazer registro com sucesso', async () => {
      vi.mocked(AuthServices.register).mockResolvedValue(mockApiResponses.register);
      vi.mocked(AuthServices.login).mockResolvedValue(mockApiResponses.login);

      const store = useAuthStore();
      
      await store.register('New User', 'new@example.com', 'password');

      expect(AuthServices.register).toHaveBeenCalledWith('New User', 'new@example.com', 'password');
      expect(AuthServices.login).toHaveBeenCalledWith('new@example.com', 'password');
      expect(store.user).toEqual(mockUsers[0]);
      expect(store.token).toBe(mockApiResponses.login.token);
      expect(store.isAuthenticated).toBe(true);
    });

    it('deve lidar com erro de registro', async () => {
      const error = new Error('Email already exists');
      vi.mocked(AuthServices.register).mockRejectedValue(error);

      const store = useAuthStore();
      
      await expect(store.register('User', 'existing@example.com', 'password')).rejects.toThrow('Email already exists');
      
      expect(store.user).toBeNull();
      expect(store.token).toBeNull();
      expect(store.isAuthenticated).toBe(false);
    });
  });

  describe('Fetch User Profile', () => {
    it('deve buscar perfil do usuário com sucesso', async () => {
      vi.mocked(AuthServices.getUserProfile).mockResolvedValue(mockUsers[0]);

      const store = useAuthStore();
      
      await store.fetchUserProfile();

      expect(AuthServices.getUserProfile).toHaveBeenCalled();
      expect(store.user).toEqual(mockUsers[0]);
    });

    it('deve lidar com erro ao buscar perfil', async () => {
      const error = new Error('Unauthorized');
      vi.mocked(AuthServices.getUserProfile).mockRejectedValue(error);

      const store = useAuthStore();
      
      await expect(store.fetchUserProfile()).rejects.toThrow('Unauthorized');
    });
  });

  describe('Logout', () => {
    it('deve fazer logout corretamente', () => {
      const store = useAuthStore();
      
      // Simular usuário logado
      store.user = mockUsers[0];
      store.token = 'mock-token';
      
      store.logout();

      expect(store.user).toBeNull();
      expect(store.token).toBeNull();
      expect(store.isAuthenticated).toBe(false);
      expect(localStorage.removeItem).toHaveBeenCalledWith('tokenCartalia');
      expect(localStorage.removeItem).toHaveBeenCalledWith('userCartalia');
    });
  });

  describe('Persistência', () => {
    it('deve carregar dados do localStorage na inicialização', () => {
      const mockToken = 'mock-token';

      vi.mocked(localStorage.getItem).mockImplementation((key: string) => {
        if (key === 'tokenCartalia') return mockToken;
        if (key === 'userCartalia') return JSON.stringify(mockUsers[0]);
        return null;
      });

      const store = useAuthStore();

      expect(store.user).toEqual(mockUsers[0]);
      expect(store.token).toBe(mockToken);
      expect(store.isAuthenticated).toBe(true);
    });

    it('deve lidar com localStorage vazio', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);

      const store = useAuthStore();

      expect(store.user).toBeNull();
      expect(store.token).toBeNull();
      expect(store.isAuthenticated).toBe(false);
    });

    it('deve lidar com JSON inválido no localStorage', () => {
      vi.mocked(localStorage.getItem).mockImplementation((key: string) => {
        if (key === 'tokenCartalia') return 'mock-token';
        if (key === 'userCartalia') return 'invalid-json';
        return null;
      });

      const store = useAuthStore();

      expect(store.user).toBeNull();
      expect(store.token).toBe('mock-token');
      expect(store.isAuthenticated).toBe(false);
    });
  });

  describe('Computed Properties', () => {
    it('deve calcular isAuthenticated corretamente', () => {
      const store = useAuthStore();
      
      expect(store.isAuthenticated).toBe(false);
      
      store.user = mockUsers[0];
      store.token = 'mock-token';
      
      expect(store.isAuthenticated).toBe(true);
    });

    it('deve calcular isAuthenticated como false quando não há token', () => {
      const store = useAuthStore();
      
      store.user = mockUsers[0];
      store.token = null;
      
      expect(store.isAuthenticated).toBe(false);
    });

    it('deve calcular isAuthenticated como false quando não há usuário', () => {
      const store = useAuthStore();
      
      store.user = null;
      store.token = 'mock-token';
      
      expect(store.isAuthenticated).toBe(false);
    });
  });
}); 