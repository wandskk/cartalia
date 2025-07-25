import { describe, it, expect } from 'vitest';
import { formatDate, formatDateTime, formatRelativeTime, formatCurrency, formatNumber, formatPercentage, formatFileSize, formatPhoneNumber, formatCPF, formatCNPJ, formatCEP, truncateText, capitalizeFirst, capitalizeWords, slugify, formatArray, formatList, formatStatus } from '../../../utils/formatters';

describe('Formatters', () => {
  describe('Date Formatters', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = formatDate(date);
      expect(result).toContain('15');
      expect(result).toContain('jan');
    });

    it('should format date time correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = formatDateTime(date);
      expect(result).toContain('15');
      expect(result).toContain('10:30');
    });

    it('should format relative time correctly', () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const result = formatRelativeTime(oneHourAgo);
      expect(result).toContain('hora');
    });
  });

  describe('Number Formatters', () => {
    it('should format currency correctly', () => {
      const result = formatCurrency(1234.56);
      expect(result).toContain('R$');
      expect(result).toContain('1.234,56');
    });

    it('should format number correctly', () => {
      const result = formatNumber(1234567);
      expect(result).toBe('1.234.567');
    });

    it('should format percentage correctly', () => {
      const result = formatPercentage(75.5);
      expect(result).toBe('75.5%');
    });

    it('should format file size correctly', () => {
      const result = formatFileSize(1024);
      expect(result).toBe('1 KB');
    });
  });

  describe('Text Formatters', () => {
    it('should format phone number correctly', () => {
      const result = formatPhoneNumber('11987654321');
      expect(result).toBe('(11) 98765-4321');
    });

    it('should format CPF correctly', () => {
      const result = formatCPF('12345678901');
      expect(result).toBe('123.456.789-01');
    });

    it('should format CNPJ correctly', () => {
      const result = formatCNPJ('12345678000195');
      expect(result).toBe('12.345.678/0001-95');
    });

    it('should format CEP correctly', () => {
      const result = formatCEP('12345678');
      expect(result).toBe('12345-678');
    });

    it('should truncate text correctly', () => {
      const result = truncateText('This is a long text', 10);
      expect(result).toBe('This is a...');
    });

    it('should capitalize first letter correctly', () => {
      const result = capitalizeFirst('hello world');
      expect(result).toBe('Hello world');
    });

    it('should capitalize words correctly', () => {
      const result = capitalizeWords('hello world');
      expect(result).toBe('Hello World');
    });

    it('should slugify text correctly', () => {
      const result = slugify('Hello World!');
      expect(result).toBe('hello-world');
    });
  });

  describe('Array Formatters', () => {
    it('should format array correctly', () => {
      const result = formatArray(['a', 'b', 'c']);
      expect(result).toBe('a, b, c');
    });

    it('should format array with custom separator', () => {
      const result = formatArray(['a', 'b', 'c'], ' | ');
      expect(result).toBe('a | b | c');
    });

    it('should format array with max items', () => {
      const result = formatArray(['a', 'b', 'c', 'd', 'e'], ', ', 3);
      expect(result).toBe('a, b, c e mais 2');
    });

    it('should format list correctly', () => {
      const result = formatList(['a', 'b', 'c']);
      expect(result).toBe('a, b e c');
    });
  });

  describe('Status Formatters', () => {
    it('should format status correctly', () => {
      const result = formatStatus('active');
      expect(result).toBe('Ativo');
    });

    it('should return original status if not found', () => {
      const result = formatStatus('unknown');
      expect(result).toBe('unknown');
    });
  });
}); 