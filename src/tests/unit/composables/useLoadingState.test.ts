import { describe, it, expect, beforeEach } from 'vitest';
import { useLoadingState } from '../../../composables/useLoadingState';

describe('useLoadingState', () => {
  let loading: ReturnType<typeof useLoadingState>;

  beforeEach(() => {
    loading = useLoadingState();
  });

  it('should initialize with not loading', () => {
    expect(loading.isLoading.value).toBe(false);
    expect(loading.message.value).toBe('');
    expect(loading.progress.value).toBe(0);
  });

  it('should start loading with default message', () => {
    loading.startLoading();
    expect(loading.isLoading.value).toBe(true);
    expect(loading.message.value).toBe('Carregando...');
    expect(loading.progress.value).toBe(0);
  });

  it('should start loading with custom message', () => {
    loading.startLoading('Processando dados...');
    expect(loading.isLoading.value).toBe(true);
    expect(loading.message.value).toBe('Processando dados...');
    expect(loading.progress.value).toBe(0);
  });

  it('should stop loading', () => {
    loading.startLoading('Processando');
    loading.stopLoading();
    expect(loading.isLoading.value).toBe(false);
    expect(loading.message.value).toBe('');
    expect(loading.progress.value).toBe(0);
  });

  it('should update progress', () => {
    loading.startLoading('Carregando');
    loading.updateProgress(50, 'Metade concluída');
    expect(loading.progress.value).toBe(50);
    expect(loading.message.value).toBe('Metade concluída');
  });

  it('should set message', () => {
    loading.startLoading('Iniciando');
    loading.setMessage('Nova mensagem');
    expect(loading.message.value).toBe('Nova mensagem');
  });

  it('should not update progress when not loading', () => {
    loading.updateProgress(50, 'Teste');
    expect(loading.progress.value).toBe(0);
    expect(loading.message.value).toBe('');
  });

  it('should not set message when not loading', () => {
    loading.setMessage('Teste');
    expect(loading.message.value).toBe('');
  });

  it('should clamp progress between 0 and 100', () => {
    loading.startLoading();
    loading.updateProgress(-10);
    expect(loading.progress.value).toBe(0);
    
    loading.updateProgress(150);
    expect(loading.progress.value).toBe(100);
  });

  it('should initialize with custom state', () => {
    const customLoading = useLoadingState({
      isLoading: true,
      message: 'Inicializado',
      progress: 25
    });
    
    expect(customLoading.isLoading.value).toBe(true);
    expect(customLoading.message.value).toBe('Inicializado');
    expect(customLoading.progress.value).toBe(25);
  });
}); 