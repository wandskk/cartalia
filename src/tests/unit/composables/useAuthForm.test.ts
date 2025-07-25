import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock do vue-router
const mockRouter = {
  push: vi.fn()
};

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter
}));

// Mock das stores
const mockAuthStore = {
  login: vi.fn(),
  register: vi.fn()
};

const mockLoadingStore = {
  startLoading: vi.fn(),
  stopLoading: vi.fn()
};

const mockNotificationStore = {
  show: vi.fn()
};

vi.mock('../../../stores/auth', () => ({
  useAuthStore: () => mockAuthStore
}));

vi.mock('../../../stores/loading', () => ({
  useLoadingStore: () => mockLoadingStore
}));

vi.mock('../../../stores/notification', () => ({
  useNotificationStore: () => mockNotificationStore
}));

// Mock da utility
vi.mock('../../../utils/parseApiError', () => ({
  parseApiError: vi.fn()
}));

import { useAuthForm } from '../../../composables/useAuthForm';

describe('useAuthForm', () => {
  describe('login form', () => {
    let loginForm: ReturnType<typeof useAuthForm>;

    beforeEach(() => {
      loginForm = useAuthForm('login');
    });

    describe('initial state', () => {
      it('should initialize with default values', () => {
        expect(loginForm.loading.value).toBe(false);
        expect(loginForm.error.value).toBe('');
      });
    });

    describe('onSubmit', () => {
      it('should handle login successfully', async () => {
        const { useAuthStore } = await import('../../../stores/auth');
        const { useRouter } = await import('vue-router');
        
        const mockAuth = useAuthStore();
        const mockRouter = useRouter();
        
        vi.mocked(mockAuth.login).mockResolvedValue(undefined);
        
        const values = { email: 'test@example.com', password: 'password123' };
        
        await loginForm.onSubmit(values);
        
        expect(mockAuthStore.login).toHaveBeenCalledWith('test@example.com', 'password123');
        expect(mockNotificationStore.show).toHaveBeenCalledWith('Login realizado com sucesso!', 'success');
        expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
        expect(loginForm.loading.value).toBe(false);
        expect(loginForm.error.value).toBe('');
      });

      it('should handle login error', async () => {
        const { useAuthStore } = await import('../../../stores/auth');
        const { useNotificationStore } = await import('../../../stores/notification');
        const { parseApiError } = await import('../../../utils/parseApiError');
        
        const mockAuth = useAuthStore();
        const mockNotification = useNotificationStore();
        
        const mockError = new Error('Invalid credentials');
        vi.mocked(mockAuth.login).mockRejectedValue(mockError);
        vi.mocked(parseApiError).mockReturnValue('Credenciais inválidas');
        
        const values = { email: 'test@example.com', password: 'wrongpassword' };
        
        await loginForm.onSubmit(values);
        
        expect(mockAuth.login).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
        expect(parseApiError).toHaveBeenCalledWith(mockError, 'login');
        expect(mockNotification.show).toHaveBeenCalledWith('Credenciais inválidas', 'error');
        expect(loginForm.error.value).toBe('Credenciais inválidas');
        expect(loginForm.loading.value).toBe(false);
      });

      it('should clear error on new submission', async () => {
        const { useAuthStore } = await import('../../../stores/auth');
        
        const mockAuth = useAuthStore();
        vi.mocked(mockAuth.login).mockResolvedValue(undefined);
        
        // Set initial error
        loginForm.error.value = 'Previous error';
        
        const values = { email: 'test@example.com', password: 'password123' };
        
        await loginForm.onSubmit(values);
        
        expect(loginForm.error.value).toBe('');
      });

      it('should set loading state during submission', async () => {
        const { useAuthStore } = await import('../../../stores/auth');
        
        const mockAuth = useAuthStore();
        vi.mocked(mockAuth.login).mockImplementation(() => {
          expect(loginForm.loading.value).toBe(true);
          return Promise.resolve(undefined);
        });
        
        const values = { email: 'test@example.com', password: 'password123' };
        
        await loginForm.onSubmit(values);
        
        expect(loginForm.loading.value).toBe(false);
      });
    });
  });

  describe('register form', () => {
    let registerForm: ReturnType<typeof useAuthForm>;

    beforeEach(() => {
      registerForm = useAuthForm('register');
    });

    describe('initial state', () => {
      it('should initialize with default values', () => {
        expect(registerForm.loading.value).toBe(false);
        expect(registerForm.error.value).toBe('');
      });
    });

    describe('onSubmit', () => {
      it('should handle register successfully', async () => {
        const { useAuthStore } = await import('../../../stores/auth');
        const { useRouter } = await import('vue-router');
        
        const mockAuth = useAuthStore();
        const mockRouter = useRouter();
        
        vi.mocked(mockAuth.register).mockResolvedValue(undefined);
        
        const values = { 
          name: 'John Doe', 
          email: 'john@example.com', 
          password: 'password123' 
        };
        
        await registerForm.onSubmit(values);
        
        expect(mockAuthStore.register).toHaveBeenCalledWith('John Doe', 'john@example.com', 'password123');
        expect(mockNotificationStore.show).toHaveBeenCalledWith('Cadastro realizado com sucesso!', 'success');
        expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
        expect(registerForm.loading.value).toBe(false);
        expect(registerForm.error.value).toBe('');
      });

      it('should handle register error', async () => {
        const { useAuthStore } = await import('../../../stores/auth');
        const { useNotificationStore } = await import('../../../stores/notification');
        const { parseApiError } = await import('../../../utils/parseApiError');
        
        const mockAuth = useAuthStore();
        const mockNotification = useNotificationStore();
        
        const mockError = new Error('Email already exists');
        vi.mocked(mockAuth.register).mockRejectedValue(mockError);
        vi.mocked(parseApiError).mockReturnValue('Email já existe');
        
        const values = { 
          name: 'John Doe', 
          email: 'existing@example.com', 
          password: 'password123' 
        };
        
        await registerForm.onSubmit(values);
        
        expect(mockAuth.register).toHaveBeenCalledWith('John Doe', 'existing@example.com', 'password123');
        expect(parseApiError).toHaveBeenCalledWith(mockError, 'register');
        expect(mockNotification.show).toHaveBeenCalledWith('Email já existe', 'error');
        expect(registerForm.error.value).toBe('Email já existe');
        expect(registerForm.loading.value).toBe(false);
      });

      it('should clear error on new submission', async () => {
        const { useAuthStore } = await import('../../../stores/auth');
        
        const mockAuth = useAuthStore();
        vi.mocked(mockAuth.register).mockResolvedValue(undefined);
        
        // Set initial error
        registerForm.error.value = 'Previous error';
        
        const values = { 
          name: 'John Doe', 
          email: 'john@example.com', 
          password: 'password123' 
        };
        
        await registerForm.onSubmit(values);
        
        expect(registerForm.error.value).toBe('');
      });

      it('should set loading state during submission', async () => {
        const { useAuthStore } = await import('../../../stores/auth');
        
        const mockAuth = useAuthStore();
        vi.mocked(mockAuth.register).mockImplementation(() => {
          expect(registerForm.loading.value).toBe(true);
          return Promise.resolve(undefined);
        });
        
        const values = { 
          name: 'John Doe', 
          email: 'john@example.com', 
          password: 'password123' 
        };
        
        await registerForm.onSubmit(values);
        
        expect(registerForm.loading.value).toBe(false);
      });
    });
  });

  describe('global loading integration', () => {
    it('should start and stop global loading for login', async () => {
      const { useLoadingStore } = await import('../../../stores/loading');
      const { useAuthStore } = await import('../../../stores/auth');
      
      const mockLoading = useLoadingStore();
      const mockAuth = useAuthStore();
      
      vi.mocked(mockAuth.login).mockResolvedValue(undefined);
      
      const loginForm = useAuthForm('login');
      const values = { email: 'test@example.com', password: 'password123' };
      
      await loginForm.onSubmit(values);
      
      expect(mockLoading.startLoading).toHaveBeenCalledOnce();
      expect(mockLoading.stopLoading).toHaveBeenCalledOnce();
    });

    it('should start and stop global loading for register', async () => {
      const { useLoadingStore } = await import('../../../stores/loading');
      const { useAuthStore } = await import('../../../stores/auth');
      
      const mockLoading = useLoadingStore();
      const mockAuth = useAuthStore();
      
      vi.mocked(mockAuth.register).mockResolvedValue(undefined);
      
      const registerForm = useAuthForm('register');
      const values = { 
        name: 'John Doe', 
        email: 'john@example.com', 
        password: 'password123' 
      };
      
      await registerForm.onSubmit(values);
      
      expect(mockLoading.startLoading).toHaveBeenCalledOnce();
      expect(mockLoading.stopLoading).toHaveBeenCalledOnce();
    });

    it('should stop global loading even on error', async () => {
      const { useLoadingStore } = await import('../../../stores/loading');
      const { useAuthStore } = await import('../../../stores/auth');
      
      const mockLoading = useLoadingStore();
      const mockAuth = useAuthStore();
      
      vi.mocked(mockAuth.login).mockRejectedValue(new Error('Login failed'));
      
      const loginForm = useAuthForm('login');
      const values = { email: 'test@example.com', password: 'wrongpassword' };
      
      await loginForm.onSubmit(values);
      
      expect(mockLoading.startLoading).toHaveBeenCalledOnce();
      expect(mockLoading.stopLoading).toHaveBeenCalledOnce();
    });
  });
}); 