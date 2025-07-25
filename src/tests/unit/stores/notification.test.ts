import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useNotificationStore } from '../../../stores/notification';

describe('Notification Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('should initialize with null message and type', () => {
    const notificationStore = useNotificationStore();
    expect(notificationStore.message).toBe(null);
    expect(notificationStore.type).toBe(null);
  });

  it('should show success notification', () => {
    const notificationStore = useNotificationStore();
    
    notificationStore.show('Operação realizada com sucesso!', 'success');
    
    expect(notificationStore.message).toBe('Operação realizada com sucesso!');
    expect(notificationStore.type).toBe('success');
  });

  it('should show error notification', () => {
    const notificationStore = useNotificationStore();
    
    notificationStore.show('Erro ao processar solicitação', 'error');
    
    expect(notificationStore.message).toBe('Erro ao processar solicitação');
    expect(notificationStore.type).toBe('error');
  });

  it('should show info notification', () => {
    const notificationStore = useNotificationStore();
    
    notificationStore.show('Nova funcionalidade disponível', 'info');
    
    expect(notificationStore.message).toBe('Nova funcionalidade disponível');
    expect(notificationStore.type).toBe('info');
  });

  it('should default to success type when not specified', () => {
    const notificationStore = useNotificationStore();
    
    notificationStore.show('Test message');
    
    expect(notificationStore.message).toBe('Test message');
    expect(notificationStore.type).toBe('success');
  });

  it('should clear notification', () => {
    const notificationStore = useNotificationStore();
    
    notificationStore.show('Test message', 'success');
    expect(notificationStore.message).toBe('Test message');
    expect(notificationStore.type).toBe('success');
    
    notificationStore.clear();
    expect(notificationStore.message).toBe(null);
    expect(notificationStore.type).toBe(null);
  });

  it('should auto-clear notification after 3 seconds', async () => {
    vi.useFakeTimers();
    const notificationStore = useNotificationStore();
    
    notificationStore.show('Auto-clear test', 'success');
    expect(notificationStore.message).toBe('Auto-clear test');
    
    // Fast-forward time by 3 seconds
    vi.advanceTimersByTime(3000);
    await vi.runAllTimersAsync();
    
    expect(notificationStore.message).toBe(null);
    expect(notificationStore.type).toBe(null);
    
    vi.useRealTimers();
  });

  it('should not clear error notification automatically', async () => {
    vi.useFakeTimers();
    const notificationStore = useNotificationStore();
    
    notificationStore.show('Test message', 'error');
    expect(notificationStore.message).toBe('Test message');
    
    // Fast-forward time by 5 seconds (more than 3 seconds)
    vi.advanceTimersByTime(5000);
    await vi.runAllTimersAsync();
    
    expect(notificationStore.message).toBe('Test message');
    expect(notificationStore.type).toBe('error');
    
    vi.useRealTimers();
  });

  it('should override previous notification when showing new one', () => {
    const notificationStore = useNotificationStore();
    
    notificationStore.show('First message', 'success');
    expect(notificationStore.message).toBe('First message');
    expect(notificationStore.type).toBe('success');
    
    notificationStore.show('Second message', 'error');
    expect(notificationStore.message).toBe('Second message');
    expect(notificationStore.type).toBe('error');
  });
}); 