import { vi, type Mock, beforeEach, afterEach, expect } from 'vitest';
import { nextTick } from 'vue';

// Helper para aguardar próximos ticks do Vue
export async function waitForNextTick() {
  await nextTick();
}

// Helper para aguardar múltiplos ticks
export async function waitForTicks(count: number = 1) {
  for (let i = 0; i < count; i++) {
    await nextTick();
  }
}

// Helper para aguardar promises
export async function waitForPromise<T>(promise: Promise<T>): Promise<T> {
  return await promise;
}

// Helper para aguardar timeout
export async function waitForTimeout(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper para aguardar até que uma condição seja verdadeira
export async function waitFor(
  condition: () => boolean | Promise<boolean>,
  timeout: number = 5000,
  interval: number = 100
): Promise<void> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const result = await condition();
    if (result) return;
    await waitForTimeout(interval);
  }
  
  throw new Error(`Timeout waiting for condition after ${timeout}ms`);
}

// Helper para aguardar até que um elemento exista
export async function waitForElement(
  selector: string,
  timeout: number = 5000
): Promise<Element> {
  return await waitFor(
    () => !!document.querySelector(selector),
    timeout
  ).then(() => document.querySelector(selector)!);
}

// Helper para aguardar até que um texto apareça
export async function waitForText(
  text: string,
  timeout: number = 5000
): Promise<void> {
  return await waitFor(
    () => document.body.textContent?.includes(text) || false,
    timeout
  );
}

// Helper para simular eventos do usuário
export function simulateUserEvent(element: Element, eventType: string, options: any = {}) {
  const event = new Event(eventType, { bubbles: true, cancelable: true, ...options });
  element.dispatchEvent(event);
}

// Helper para simular clique
export function simulateClick(element: Element) {
  simulateUserEvent(element, 'click');
}

// Helper para simular input
export function simulateInput(element: HTMLInputElement, value: string) {
  element.value = value;
  simulateUserEvent(element, 'input');
}

// Helper para simular keydown
export function simulateKeydown(element: Element, key: string, options: any = {}) {
  simulateUserEvent(element, 'keydown', { key, ...options });
}

// Helper para simular submit
export function simulateSubmit(element: Element) {
  simulateUserEvent(element, 'submit');
}

// Helper para simular change
export function simulateChange(element: Element) {
  simulateUserEvent(element, 'change');
}

// Helper para simular focus
export function simulateFocus(element: Element) {
  simulateUserEvent(element, 'focus');
}

// Helper para simular blur
export function simulateBlur(element: Element) {
  simulateUserEvent(element, 'blur');
}

// Helper para simular mouse events
export function simulateMouseEvent(element: Element, eventType: string, options: any = {}) {
  const event = new MouseEvent(eventType, { bubbles: true, cancelable: true, ...options });
  element.dispatchEvent(event);
}

// Helper para simular hover
export function simulateHover(element: Element) {
  simulateMouseEvent(element, 'mouseenter');
  simulateMouseEvent(element, 'mouseover');
}

// Helper para simular unhover
export function simulateUnhover(element: Element) {
  simulateMouseEvent(element, 'mouseleave');
  simulateMouseEvent(element, 'mouseout');
}

// Helper para verificar se um elemento está visível
export function isElementVisible(element: Element): boolean {
  const style = window.getComputedStyle(element);
  const htmlElement = element as HTMLElement;
  return style.display !== 'none' && 
         style.visibility !== 'hidden' && 
         style.opacity !== '0' &&
         htmlElement.offsetWidth > 0 &&
         htmlElement.offsetHeight > 0;
}

// Helper para verificar se um elemento está no DOM
export function isElementInDOM(element: Element): boolean {
  return document.contains(element);
}

// Helper para verificar se um elemento tem uma classe
export function hasClass(element: Element, className: string): boolean {
  return element.classList.contains(className);
}

// Helper para verificar se um elemento tem um atributo
export function hasAttribute(element: Element, attribute: string): boolean {
  return element.hasAttribute(attribute);
}

// Helper para verificar se um elemento tem um valor
export function hasValue(element: HTMLInputElement, value: string): boolean {
  return element.value === value;
}

// Helper para verificar se um elemento tem um texto
export function hasText(element: Element, text: string): boolean {
  return element.textContent?.includes(text) || false;
}

// Helper para verificar se um elemento tem um texto exato
export function hasExactText(element: Element, text: string): boolean {
  return element.textContent?.trim() === text;
}

// Helper para mock de timers
export function useFakeTimers() {
  vi.useFakeTimers();
}

export function useRealTimers() {
  vi.useRealTimers();
}

// Helper para avançar timers
export function advanceTimersByTime(ms: number) {
  vi.advanceTimersByTime(ms);
}

// Helper para avançar para o próximo timer
export function advanceTimersToNextTimer() {
  vi.advanceTimersToNextTimer();
}

// Helper para executar todos os timers pendentes
export function runAllTimers() {
  vi.runAllTimers();
}

// Helper para mock de console
export function mockConsole() {
  const originalConsole = { ...console };
  
  beforeEach(() => {
    console.log = vi.fn();
    console.warn = vi.fn();
    console.error = vi.fn();
    console.info = vi.fn();
  });
  
  afterEach(() => {
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
    console.info = originalConsole.info;
  });
}

// Helper para mock de localStorage
export function mockLocalStorage() {
  const store: Record<string, string> = {};
  
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          store[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
          delete store[key];
        }),
        clear: vi.fn(() => {
          Object.keys(store).forEach(key => delete store[key]);
        }),
        length: Object.keys(store).length,
        key: vi.fn((index: number) => Object.keys(store)[index] || null)
      },
      writable: true
    });
  });
  
  afterEach(() => {
    Object.keys(store).forEach(key => delete store[key]);
  });
}

// Helper para mock de sessionStorage
export function mockSessionStorage() {
  const store: Record<string, string> = {};
  
  beforeEach(() => {
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          store[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
          delete store[key];
        }),
        clear: vi.fn(() => {
          Object.keys(store).forEach(key => delete store[key]);
        }),
        length: Object.keys(store).length,
        key: vi.fn((index: number) => Object.keys(store)[index] || null)
      },
      writable: true
    });
  });
  
  afterEach(() => {
    Object.keys(store).forEach(key => delete store[key]);
  });
}

// Helper para mock de fetch
export function mockFetch() {
  const mockFetch = vi.fn();
  
  beforeEach(() => {
    global.fetch = mockFetch;
  });
  
  afterEach(() => {
    mockFetch.mockClear();
  });
  
  return mockFetch;
}

// Helper para mock de IntersectionObserver
export function mockIntersectionObserver() {
  beforeEach(() => {
    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn()
    }));
  });
}

// Helper para mock de ResizeObserver
export function mockResizeObserver() {
  beforeEach(() => {
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn()
    }));
  });
}

// Helper para mock de matchMedia
export function mockMatchMedia() {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      }))
    });
  });
}

// Helper para verificar se um mock foi chamado
export function expectMockToHaveBeenCalled(mock: Mock, times?: number) {
  if (times !== undefined) {
    expect(mock).toHaveBeenCalledTimes(times);
  } else {
    expect(mock).toHaveBeenCalled();
  }
}

// Helper para verificar se um mock foi chamado com argumentos específicos
export function expectMockToHaveBeenCalledWith(mock: Mock, ...args: any[]) {
  expect(mock).toHaveBeenCalledWith(...args);
}

// Helper para verificar se um mock não foi chamado
export function expectMockNotToHaveBeenCalled(mock: Mock) {
  expect(mock).not.toHaveBeenCalled();
}

// Helper para verificar se um mock foi chamado uma vez
export function expectMockToHaveBeenCalledOnce(mock: Mock) {
  expect(mock).toHaveBeenCalledTimes(1);
}

// Helper para verificar se um mock foi chamado com argumentos específicos uma vez
export function expectMockToHaveBeenCalledOnceWith(mock: Mock, ...args: any[]) {
  expect(mock).toHaveBeenCalledTimes(1);
  expect(mock).toHaveBeenCalledWith(...args);
} 