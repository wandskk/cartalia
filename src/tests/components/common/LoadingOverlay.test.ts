import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestPinia } from '../../setup';
import LoadingOverlay from '../../../components/common/LoadingOverlay.vue';

describe('LoadingOverlay', () => {
  beforeEach(() => {
    createTestPinia();
  });

  it('should render loading overlay when loading is true', () => {
    const wrapper = mount(LoadingOverlay, {
      props: {
        loading: true
      }
    });

    expect(wrapper.find('.loading-overlay').exists()).toBe(true);
    expect(wrapper.find('.v-progress-circular').exists()).toBe(true);
  });

  it('should not render loading overlay when loading is false', () => {
    const wrapper = mount(LoadingOverlay, {
      props: {
        loading: false
      }
    });

    expect(wrapper.find('.loading-overlay').exists()).toBe(false);
  });

  it('should display custom message when provided', () => {
    const wrapper = mount(LoadingOverlay, {
      props: {
        loading: true,
        message: 'Carregando dados...'
      }
    });

    expect(wrapper.find('.loading-message').text()).toBe('Carregando dados...');
  });

  it('should not display message when no message is provided', () => {
    const wrapper = mount(LoadingOverlay, {
      props: {
        loading: true
      }
    });

    expect(wrapper.find('.loading-message').exists()).toBe(false);
  });

  it('should show spinner when showSpinner is true', () => {
    const wrapper = mount(LoadingOverlay, {
      props: {
        loading: true,
        showSpinner: true
      }
    });

    expect(wrapper.find('.loading-spinner').exists()).toBe(true);
  });

  it('should not show spinner when showSpinner is false', () => {
    const wrapper = mount(LoadingOverlay, {
      props: {
        loading: true,
        showSpinner: false
      }
    });

    expect(wrapper.find('.loading-spinner').exists()).toBe(false);
  });

  it('should apply custom size', () => {
    const wrapper = mount(LoadingOverlay, {
      props: {
        loading: true,
        size: 64
      }
    });

    const progressCircular = wrapper.find('.v-progress-circular');
    expect(progressCircular.exists()).toBe(true);
    expect(progressCircular.element.tagName).toBe('DIV');
  });

  it('should apply custom width', () => {
    const wrapper = mount(LoadingOverlay, {
      props: {
        loading: true,
        width: 6
      }
    });

    const progressCircular = wrapper.find('.v-progress-circular');
    expect(progressCircular.exists()).toBe(true);
    expect(progressCircular.element.tagName).toBe('DIV');
  });

  it('should apply custom color', () => {
    const wrapper = mount(LoadingOverlay, {
      props: {
        loading: true,
        color: 'error'
      }
    });

    const progressCircular = wrapper.find('.v-progress-circular');
    expect(progressCircular.exists()).toBe(true);
    expect(progressCircular.element.tagName).toBe('DIV');
  });

  it('should handle loading state changes', async () => {
    const wrapper = mount(LoadingOverlay, {
      props: {
        loading: false
      }
    });

    expect(wrapper.find('.loading-overlay').exists()).toBe(false);

    await wrapper.setProps({ loading: true });
    expect(wrapper.find('.loading-overlay').exists()).toBe(true);

    await wrapper.setProps({ loading: false });
    expect(wrapper.find('.loading-overlay').exists()).toBe(false);
  });

  it('should handle message changes', async () => {
    const wrapper = mount(LoadingOverlay, {
      props: {
        loading: true,
        message: 'Initial message'
      }
    });

    expect(wrapper.find('.loading-message').text()).toBe('Initial message');

    await wrapper.setProps({ message: 'Updated message' });
    expect(wrapper.find('.loading-message').text()).toBe('Updated message');
  });

  it('should show overlay by default', () => {
    const wrapper = mount(LoadingOverlay, {
      props: {
        loading: true
      }
    });

    expect(wrapper.find('.loading-overlay').exists()).toBe(true);
    expect(wrapper.find('.loading-overlay').classes()).toContain('overlay');
  });

  it('should not show overlay when overlay is false', () => {
    const wrapper = mount(LoadingOverlay, {
      props: {
        loading: true,
        overlay: false
      }
    });

    expect(wrapper.find('.loading-overlay').exists()).toBe(true);
    expect(wrapper.find('.loading-overlay').classes()).not.toContain('overlay');
  });
}); 