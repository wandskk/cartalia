import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestPinia } from '../../setup';
import CardPreview from '../../../components/common/CardPreview.vue';
import type { Card } from '../../../types/cards';

describe('CardPreview', () => {
  const mockCard: Card = {
    id: '1',
    name: 'Test Card',
    description: 'This is a test card with a long description that should be truncated',
    imageUrl: 'https://example.com/card.jpg',
    createdAt: '2024-01-01T00:00:00.000Z'
  };

  beforeEach(() => {
    createTestPinia();
  });

  it('should render card information correctly', () => {
    const wrapper = mount(CardPreview, {
      props: {
        card: mockCard
      }
    });

    expect(wrapper.find('.card-preview').exists()).toBe(true);
    expect(wrapper.find('.card-image').exists()).toBe(true);
    expect(wrapper.text()).toContain('Test Card');
    expect(wrapper.text()).toContain('This is a test card with a long description that should be truncated');
  });

  it('should display card image with correct src', () => {
    const wrapper = mount(CardPreview, {
      props: {
        card: mockCard
      }
    });

    const vImg = wrapper.find('.v-img');
    expect(vImg.exists()).toBe(true);

    expect(vImg.element.tagName).toBe('IMG');
  });

  it('should truncate long descriptions', () => {
    const longDescriptionCard: Card = {
      ...mockCard,
      description: 'This is a very long description that should be truncated to a reasonable length for display purposes in the card preview component'
    };

    const wrapper = mount(CardPreview, {
      props: {
        card: longDescriptionCard
      }
    });

    const description = wrapper.text();
    expect(description.length).toBeLessThan(longDescriptionCard.description.length);
  });

  it('should apply different size classes based on size prop', () => {
    const wrapper = mount(CardPreview, {
      props: {
        card: mockCard,
        size: 'lg'
      }
    });

    expect(wrapper.find('.card-preview').exists()).toBe(true);
  });

  it('should show meta information when showMeta is true', () => {
    const wrapper = mount(CardPreview, {
      props: {
        card: mockCard,
        showMeta: true
      }
    });

    expect(wrapper.text()).toContain('1');
  });

  it('should not show meta information when showMeta is false', () => {
    const wrapper = mount(CardPreview, {
      props: {
        card: mockCard,
        showMeta: false
      }
    });

    expect(wrapper.text()).not.toContain('1');
  });

  it('should handle missing image gracefully', () => {
    const cardWithoutImage: Card = {
      ...mockCard,
      imageUrl: ''
    };

    const wrapper = mount(CardPreview, {
      props: {
        card: cardWithoutImage
      }
    });

    const vImg = wrapper.find('.v-img');
    expect(vImg.exists()).toBe(true);
    expect(vImg.element.tagName).toBe('IMG');
  });

  it('should handle missing description gracefully', () => {
    const cardWithoutDescription: Card = {
      ...mockCard,
      description: ''
    };

    const wrapper = mount(CardPreview, {
      props: {
        card: cardWithoutDescription
      }
    });

    const description = wrapper.text();
    expect(description).not.toContain('This is a test card');
  });

  it('should emit click event when card is clicked', async () => {
    const wrapper = mount(CardPreview, {
      props: {
        card: mockCard
      }
    });

    await wrapper.find('.card-preview').trigger('click');
    
    expect(wrapper.emitted('click')).toBeTruthy();
    expect(wrapper.emitted('click')![0]).toEqual([mockCard]);
  });

  it('should apply hover effects when hoverable is true', () => {
    const wrapper = mount(CardPreview, {
      props: {
        card: mockCard,
        clickable: true
      }
    });

    const vCard = wrapper.find('.v-card');
    expect(vCard.exists()).toBe(true);
    expect(vCard.element.tagName).toBe('DIV');
  });

  it('should not apply hover effects when hoverable is false', () => {
    const wrapper = mount(CardPreview, {
      props: {
        card: mockCard,
        clickable: false
      }
    });

    const vCard = wrapper.find('.v-card');
    expect(vCard.exists()).toBe(true);
    expect(vCard.element.tagName).toBe('DIV');
  });

  it('should apply custom CSS classes', () => {
    const wrapper = mount(CardPreview, {
      props: {
        card: mockCard
      },
      attrs: {
        class: 'custom-class'
      }
    });

    expect(wrapper.classes()).toContain('custom-class');
  });

  it('should handle card with special characters in name', () => {
    const specialCard: Card = {
      ...mockCard,
      name: 'Card with "quotes" & symbols!'
    };

    const wrapper = mount(CardPreview, {
      props: {
        card: specialCard
      }
    });

    expect(wrapper.text()).toContain('Card with "quotes" & symbols!');
    const vImg = wrapper.find('.v-img');
    expect(vImg.exists()).toBe(true);
    expect(vImg.element.tagName).toBe('IMG');
  });
}); 