import { describe, it, expect, beforeEach } from 'vitest';
import { useModal } from '../../../composables/useModal';

describe('useModal', () => {
  let modal: ReturnType<typeof useModal>;

  beforeEach(() => {
    modal = useModal();
  });

  describe('initial state', () => {
    it('should initialize with closed state', () => {
      expect(modal.isOpen.value).toBe(false);
      expect(modal.data.value).toBeUndefined();
    });

    it('should initialize with custom data', () => {
      const customData = { id: 1, name: 'test' };
      const modalWithData = useModal(customData);
      
      expect(modalWithData.isOpen.value).toBe(false);
      expect(modalWithData.data.value).toEqual(customData);
    });
  });

  describe('open', () => {
    it('should open modal without data', () => {
      modal.open();
      
      expect(modal.isOpen.value).toBe(true);
      expect(modal.data.value).toBeUndefined();
    });

    it('should open modal with data', () => {
      const testData = { id: 1, name: 'test' };
      modal.open(testData);
      
      expect(modal.isOpen.value).toBe(true);
      expect(modal.data.value).toEqual(testData);
    });

    it('should open modal with new data when already open', () => {
      const initialData = { id: 1, name: 'initial' };
      const newData = { id: 2, name: 'new' };
      
      modal.open(initialData);
      modal.open(newData);
      
      expect(modal.isOpen.value).toBe(true);
      expect(modal.data.value).toEqual(newData);
    });
  });

  describe('close', () => {
    it('should close modal and reset data', () => {
      const testData = { id: 1, name: 'test' };
      modal.open(testData);
      
      modal.close();
      
      expect(modal.isOpen.value).toBe(false);
      expect(modal.data.value).toBeUndefined();
    });

    it('should close modal and reset to initial data', () => {
      const initialData = { id: 1, name: 'initial' };
      const modalWithData = useModal(initialData);
      
      modalWithData.open({ id: 2, name: 'new' });
      modalWithData.close();
      
      expect(modalWithData.isOpen.value).toBe(false);
      expect(modalWithData.data.value).toEqual(initialData);
    });
  });

  describe('toggle', () => {
    it('should toggle from closed to open', () => {
      modal.toggle();
      
      expect(modal.isOpen.value).toBe(true);
    });

    it('should toggle from open to closed', () => {
      modal.open();
      modal.toggle();
      
      expect(modal.isOpen.value).toBe(false);
    });

    it('should preserve data when toggling', () => {
      const testData = { id: 1, name: 'test' };
      modal.open(testData);
      modal.toggle();
      modal.toggle();
      
      expect(modal.isOpen.value).toBe(true);
      expect(modal.data.value).toEqual(testData);
    });
  });

  describe('setData', () => {
    it('should set data without opening modal', () => {
      const testData = { id: 1, name: 'test' };
      modal.setData(testData);
      
      expect(modal.isOpen.value).toBe(false);
      expect(modal.data.value).toEqual(testData);
    });

    it('should update existing data', () => {
      const initialData = { id: 1, name: 'initial' };
      const newData = { id: 2, name: 'new' };
      
      modal.setData(initialData);
      modal.setData(newData);
      
      expect(modal.data.value).toEqual(newData);
    });
  });

  describe('state reactivity', () => {
    it('should update state reactively', () => {
      const testData = { id: 1, name: 'test' };
      
      modal.state.value = {
        isOpen: true,
        data: testData
      };
      
      expect(modal.isOpen.value).toBe(true);
      expect(modal.data.value).toEqual(testData);
    });
  });
}); 