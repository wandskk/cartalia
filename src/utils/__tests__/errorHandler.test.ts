import { describe, it, expect, beforeEach, vi } from 'vitest'
import { handleApiError, handleValidationError, isNetworkError, isApiError, isValidationError, isAuthError, getErrorMessage } from '../errorHandler'
import { useErrorStore } from '../../stores/error'

// Mock do store de erro
vi.mock('../../stores/error', () => ({
  useErrorStore: vi.fn(() => ({
    addApiError: vi.fn(),
    addValidationError: vi.fn(),
    addNetworkError: vi.fn(),
    addAuthError: vi.fn(),
  })),
}))

describe('Error Handler', () => {
  let mockErrorStore: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockErrorStore = {
      addApiError: vi.fn(),
      addValidationError: vi.fn(),
      addNetworkError: vi.fn(),
      addAuthError: vi.fn(),
    }
    vi.mocked(useErrorStore).mockReturnValue(mockErrorStore)
  })

  describe('handleApiError', () => {
    it('deve lidar com erro 400', () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Dados inválidos' }
        }
      }

      const result = handleApiError(error, 'TestComponent')

      expect(result).toBe('Dados inválidos')
      expect(mockErrorStore.addApiError).toHaveBeenCalledWith('Dados inválidos', 'Dados inválidos', 'TestComponent')
    })

    it('deve lidar com erro 401', () => {
      const error = {
        response: {
          status: 401,
          data: { message: 'Não autorizado' }
        }
      }

      const result = handleApiError(error, 'TestComponent')

      expect(result).toBe('Não autorizado')
      expect(mockErrorStore.addAuthError).toHaveBeenCalledWith('Não autorizado', 'Faça login para continuar', 'TestComponent')
    })

    it('deve lidar com erro 404', () => {
      const error = {
        response: {
          status: 404,
          data: { message: 'Recurso não encontrado' }
        }
      }

      const result = handleApiError(error, 'TestComponent')

      expect(result).toBe('Recurso não encontrado')
      expect(mockErrorStore.addApiError).toHaveBeenCalledWith('Recurso não encontrado', 'O item solicitado não existe', 'TestComponent')
    })

    it('deve lidar com erro 422', () => {
      const error = {
        response: {
          status: 422,
          data: { message: 'Erro de validação' }
        }
      }

      const result = handleApiError(error, 'TestComponent')

      expect(result).toBe('Dados inválidos')
      expect(mockErrorStore.addValidationError).toHaveBeenCalledWith('Dados inválidos', 'Erro de validação', 'TestComponent')
    })

    it('deve lidar com erro de rede', () => {
      const error = {
        request: {},
        message: 'Network Error'
      }

      const result = handleApiError(error, 'TestComponent')

      expect(result).toBe('Erro de conexão')
      expect(mockErrorStore.addNetworkError).toHaveBeenCalledWith('Erro de conexão', 'Verifique sua conexão com a internet', 'TestComponent')
    })

    it('deve lidar com erro desconhecido', () => {
      const error = {
        message: 'Erro desconhecido'
      }

      const result = handleApiError(error, 'TestComponent')

      expect(result).toBe('Erro desconhecido')
      expect(mockErrorStore.addApiError).toHaveBeenCalledWith('Erro desconhecido', undefined, 'TestComponent')
    })
  })

  describe('handleValidationError', () => {
    it('deve lidar com string de erro', () => {
      const result = handleValidationError('Campo obrigatório', 'TestComponent')

      expect(result).toBe('Erro de validação')
      expect(mockErrorStore.addValidationError).toHaveBeenCalledWith('Erro de validação', 'Campo obrigatório', 'TestComponent')
    })

    it('deve lidar com array de erros', () => {
      const result = handleValidationError(['Erro 1', 'Erro 2'], 'TestComponent')

      expect(result).toBe('Erro de validação')
      expect(mockErrorStore.addValidationError).toHaveBeenCalledWith('Erro de validação', 'Erro 1, Erro 2', 'TestComponent')
    })

    it('deve lidar com objeto de erros', () => {
      const result = handleValidationError({ field1: 'Erro 1', field2: 'Erro 2' }, 'TestComponent')

      expect(result).toBe('Erro de validação')
      expect(mockErrorStore.addValidationError).toHaveBeenCalledWith('Erro de validação', 'Erro 1, Erro 2', 'TestComponent')
    })
  })

  describe('Error type detection', () => {
    it('deve detectar erro de rede', () => {
      const error = { request: {}, response: undefined }
      expect(isNetworkError(error)).toStrictEqual({})
    })

    it('deve detectar erro de API', () => {
      const error = { response: { status: 500 } }
      expect(isApiError(error)).toBe(500)
    })

    it('deve detectar erro de validação', () => {
      const error = { response: { status: 422 } }
      expect(isValidationError(error)).toBe(true)
    })

    it('deve detectar erro de autenticação', () => {
      const error = { response: { status: 401 } }
      expect(isAuthError(error)).toBe(true)
    })
  })

  describe('getErrorMessage', () => {
    it('deve retornar mensagem para erro de rede', () => {
      const error = { request: {}, response: undefined }
      expect(getErrorMessage(error)).toBe('Erro de conexão. Verifique sua internet.')
    })

    it('deve retornar mensagem para erro de autenticação', () => {
      const error = { response: { status: 401 } }
      expect(getErrorMessage(error)).toBe('Erro de autenticação. Faça login novamente.')
    })

    it('deve retornar mensagem para erro de validação', () => {
      const error = { response: { status: 422 } }
      expect(getErrorMessage(error)).toBe('Dados inválidos. Verifique as informações.')
    })

    it('deve retornar mensagem para erro de API', () => {
      const error = { response: { status: 500, data: { message: 'Erro interno' } } }
      expect(getErrorMessage(error)).toBe('Erro interno')
    })

    it('deve retornar mensagem padrão para erro desconhecido', () => {
      const error = { message: 'Erro desconhecido' }
      expect(getErrorMessage(error)).toBe('Erro desconhecido')
    })
  })
}) 
