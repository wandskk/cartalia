import { vi, type Mock, beforeEach, afterEach, expect } from 'vitest';
import { nextTick } from 'vue';


export async function waitForNextTick() {
  await nextTick();
}


export async function waitForTicks(count: number = 1) {
  for (let i = 0; i < count; i++) {
    await nextTick();
  }
}


export async function waitForPromise<T>(promise: Promise<T>): Promise<T> {
  return await promise;
}


export async function waitForTimeout(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}


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


export async function waitForElement(
  selector: string,
  timeout: number = 5000
): Promise<Element> {
  return await waitFor(
    () => !!document.querySelector(selector),
    timeout
  ).then(() => document.querySelector(selector)!);
}


export async function waitForText(
  text: string,
  timeout: number = 5000
): Promise<void> {
  return await waitFor(
    () => document.body.textContent?.includes(text) || false,
    timeout
  );
}


export function simulateUserEvent(element: Element, eventType: string, options: any = {}) {
  const event = new Event(eventType, { bubbles: true, cancelable: true, ...options });
  element.dispatchEvent(event);
}


export function simulateClick(element: Element) {
  simulateUserEvent(element, 'click');
}


export function simulateInput(element: HTMLInputElement, value: string) {
  element.value = value;
  simulateUserEvent(element, 'input');
}


export function simulateKeydown(element: Element, key: string, options: any = {}) {
  simulateUserEvent(element, 'keydown', { key, ...options });
}


export function simulateSubmit(element: Element) {
  simulateUserEvent(element, 'submit');
}


export function simulateChange(element: Element) {
  simulateUserEvent(element, 'change');
}


export function simulateFocus(element: Element) {
  simulateUserEvent(element, 'focus');
}


export function simulateBlur(element: Element) {
  simulateUserEvent(element, 'blur');
}


export function simulateMouseEvent(element: Element, eventType: string, options: any = {}) {
  const event = new MouseEvent(eventType, { bubbles: true, cancelable: true, ...options });
  element.dispatchEvent(event);
}


export function simulateHover(element: Element) {
  simulateMouseEvent(element, 'mouseenter');
  simulateMouseEvent(element, 'mouseover');
}


export function simulateUnhover(element: Element) {
  simulateMouseEvent(element, 'mouseleave');
  simulateMouseEvent(element, 'mouseout');
}


export function isElementVisible(element: Element): boolean {
  const style = window.getComputedStyle(element);
  const htmlElement = element as HTMLElement;
  return style.display !== 'none' && 
         style.visibility !== 'hidden' && 
         style.opacity !== '0' &&
         htmlElement.offsetWidth > 0 &&
         htmlElement.offsetHeight > 0;
}


export function isElementInDOM(element: Element): boolean {
  return document.contains(element);
}


export function hasClass(element: Element, className: string): boolean {
  return element.classList.contains(className);
}


export function hasAttribute(element: Element, attribute: string): boolean {
  return element.hasAttribute(attribute);
}


export function hasValue(element: HTMLInputElement, value: string): boolean {
  return element.value === value;
}


export function hasText(element: Element, text: string): boolean {
  return element.textContent?.includes(text) || false;
}


export function hasExactText(element: Element, text: string): boolean {
  return element.textContent?.trim() === text;
}


export function useFakeTimers() {
  vi.useFakeTimers();
}

export function useRealTimers() {
  vi.useRealTimers();
}


export function advanceTimersByTime(ms: number) {
  vi.advanceTimersByTime(ms);
}


export function advanceTimersToNextTimer() {
  vi.advanceTimersToNextTimer();
}


export function runAllTimers() {
  vi.runAllTimers();
}


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


export function mockIntersectionObserver() {
  beforeEach(() => {
    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn()
    }));
  });
}


export function mockResizeObserver() {
  beforeEach(() => {
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn()
    }));
  });
}


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


export function expectMockToHaveBeenCalled(mock: Mock, times?: number) {
  if (times !== undefined) {
    expect(mock).toHaveBeenCalledTimes(times);
  } else {
    expect(mock).toHaveBeenCalled();
  }
}


export function expectMockToHaveBeenCalledWith(mock: Mock, ...args: any[]) {
  expect(mock).toHaveBeenCalledWith(...args);
}


export function expectMockNotToHaveBeenCalled(mock: Mock) {
  expect(mock).not.toHaveBeenCalled();
}


export function expectMockToHaveBeenCalledOnce(mock: Mock) {
  expect(mock).toHaveBeenCalledTimes(1);
}


export function expectMockToHaveBeenCalledOnceWith(mock: Mock, ...args: any[]) {
  expect(mock).toHaveBeenCalledTimes(1);
  expect(mock).toHaveBeenCalledWith(...args);
} 