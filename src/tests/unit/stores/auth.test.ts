import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../../../stores/auth';
import { mockUser, mockAuthResponse } from '../../mocks/data';

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with default state', () => {
    const authStore = useAuthStore();
    
    expect(authStore.user).toBeNull();
    expect(authStore.token).toBeNull();
    expect(authStore.isAuthenticated).toBe(false);
  });

  it('should set user and token', () => {
    const authStore = useAuthStore();
    
    authStore.setUser(mockUser, mockAuthResponse.token);
    
    expect(authStore.user).toEqual(mockUser);
    expect(authStore.token).toBe(mockAuthResponse.token);
    expect(authStore.isAuthenticated).toBe(true);
  });

  it('should clear state on logout', () => {
    const authStore = useAuthStore();
    
    authStore.setUser(mockUser, mockAuthResponse.token);
    authStore.logout();
    
    expect(authStore.user).toBeNull();
    expect(authStore.token).toBeNull();
    expect(authStore.isAuthenticated).toBe(false);
  });

  it('should calculate isAuthenticated correctly', () => {
    const authStore = useAuthStore();
    
    expect(authStore.isAuthenticated).toBe(false);
    
    authStore.setUser(mockUser, mockAuthResponse.token);
    expect(authStore.isAuthenticated).toBe(true);
    
    authStore.logout();
    expect(authStore.isAuthenticated).toBe(false);
  });
});
