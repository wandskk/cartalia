import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'
import { AuthServices } from '../../services/modules/auth'

// Mock dos serviços
vi.mock('../../services/modules/auth', () => ({
  AuthServices: {
    login: vi.fn(),
    register: vi.fn(),
  },
}))

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    vi.mocked(localStorage.getItem).mockReturnValue(null)
  })

  describe('Estado inicial', () => {
    it('deve ter estado inicial correto', () => {
      const store = useAuthStore()
      
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('Login', () => {
    it('deve fazer login com sucesso', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com'
      }
      const mockToken = 'mock-token'

      vi.mocked(AuthServices.login).mockResolvedValue({
        token: mockToken,
        user: mockUser
      })

      const store = useAuthStore()
      
      await store.login('test@example.com', 'password')

      expect(AuthServices.login).toHaveBeenCalledWith('test@example.com', 'password')
      expect(store.user).toEqual(mockUser)
      expect(store.token).toBe(mockToken)
      expect(store.isAuthenticated).toBe(true)
      expect(localStorage.setItem).toHaveBeenCalledWith('tokenCartalia', mockToken)
      expect(localStorage.setItem).toHaveBeenCalledWith('userCartalia', JSON.stringify(mockUser))
    })

    it('deve lidar com erro de login', async () => {
      const error = new Error('Invalid credentials')
      vi.mocked(AuthServices.login).mockRejectedValue(error)

      const store = useAuthStore()
      
      await expect(store.login('test@example.com', 'wrong-password')).rejects.toThrow('Invalid credentials')
      
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('Register', () => {
    it('deve fazer registro com sucesso', async () => {
      const mockUser = {
        id: '1',
        name: 'New User',
        email: 'new@example.com'
      }
      const mockToken = 'mock-token'

      vi.mocked(AuthServices.register).mockResolvedValue({
        token: mockToken,
        user: mockUser
      })
      vi.mocked(AuthServices.login).mockResolvedValue({
        token: mockToken,
        user: mockUser
      })

      const store = useAuthStore()
      
      await store.register('New User', 'new@example.com', 'password')

      expect(AuthServices.register).toHaveBeenCalledWith('New User', 'new@example.com', 'password')
      expect(AuthServices.login).toHaveBeenCalledWith('new@example.com', 'password')
      expect(store.user).toEqual(mockUser)
      expect(store.token).toBe(mockToken)
      expect(store.isAuthenticated).toBe(true)
    })

    it('deve lidar com erro de registro', async () => {
      const error = new Error('Email already exists')
      vi.mocked(AuthServices.register).mockRejectedValue(error)

      const store = useAuthStore()
      
      await expect(store.register('User', 'existing@example.com', 'password')).rejects.toThrow('Email already exists')
      
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('Logout', () => {
    it('deve fazer logout corretamente', () => {
      const store = useAuthStore()
      
      // Simular usuário logado
      store.user = { id: '1', name: 'Test', email: 'test@example.com' }
      store.token = 'mock-token'
      
      store.logout()

      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(localStorage.removeItem).toHaveBeenCalledWith('tokenCartalia')
      expect(localStorage.removeItem).toHaveBeenCalledWith('userCartalia')
    })
  })

  describe('Persistência', () => {
    it('deve carregar dados do localStorage na inicialização', () => {
      const mockUser = { id: '1', name: 'Test', email: 'test@example.com' }
      const mockToken = 'mock-token'

      vi.mocked(localStorage.getItem).mockImplementation((key: string) => {
        if (key === 'tokenCartalia') return mockToken
        if (key === 'userCartalia') return JSON.stringify(mockUser)
        return null
      })

      const store = useAuthStore()

      expect(store.user).toEqual(mockUser)
      expect(store.token).toBe(mockToken)
      expect(store.isAuthenticated).toBe(true)
    })

    it('deve lidar com localStorage vazio', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null)

      const store = useAuthStore()

      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })
  })
}) 
