import { describe, it, expect } from 'vitest';
import { dateFormatters, numberFormatters, textFormatters, arrayFormatters, statusFormatters } from '../../../utils/formatters';

describe('Formatters', () => {
  describe('dateFormatters', () => {
    const testDate = new Date('2024-01-15T10:30:00.000Z');

    describe('formatDate', () => {
      it('should format date with default options', () => {
        const result = dateFormatters.formatDate(testDate);
        expect(result).toMatch(/15 de jan/);
      });

      it('should format date with custom options', () => {
        const result = dateFormatters.formatDate(testDate, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        expect(result).toMatch(/15 de janeiro de 2024/);
      });

      it('should format date string', () => {
        const result = dateFormatters.formatDate('2024-01-15T10:30:00.000Z');
        expect(result).toMatch(/15 de jan/);
      });
    });

    describe('formatDateOnly', () => {
      it('should format date without time', () => {
        const result = dateFormatters.formatDateOnly(testDate);
        expect(result).toMatch(/15 de jan/);
        expect(result).not.toMatch(/10:30/);
      });
    });

    describe('formatRelativeDate', () => {
      it('should format today as "Agora mesmo"', () => {
        const today = new Date();
        const result = dateFormatters.formatRelativeDate(today);
        expect(result).toBe('Agora mesmo');
      });

      it('should format yesterday as "há 1 dia"', () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const result = dateFormatters.formatRelativeDate(yesterday);
        expect(result).toBe('há 1 dia');
      });

      it('should format recent dates', () => {
        const recent = new Date();
        recent.setDate(recent.getDate() - 3);
        const result = dateFormatters.formatRelativeDate(recent);
        expect(result).toBe('há 3 dias');
      });

      it('should format older dates', () => {
        const older = new Date();
        older.setDate(older.getDate() - 30);
        const result = dateFormatters.formatRelativeDate(older);
        // Check for month abbreviation in Portuguese format
        expect(result).toMatch(/de [a-z]{3}/);
      });
    });

    describe('isToday', () => {
      it('should return true for today', () => {
        const today = new Date();
        expect(dateFormatters.isToday(today)).toBe(true);
      });

      it('should return false for other dates', () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        expect(dateFormatters.isToday(yesterday)).toBe(false);
      });
    });

    describe('isRecent', () => {
      it('should return true for recent dates', () => {
        const recent = new Date();
        recent.setDate(recent.getDate() - 3);
        expect(dateFormatters.isRecent(recent)).toBe(true);
      });

      it('should return false for old dates', () => {
        const old = new Date();
        old.setDate(old.getDate() - 10);
        expect(dateFormatters.isRecent(old)).toBe(false);
      });
    });
  });

  describe('numberFormatters', () => {
    describe('formatNumber', () => {
      it('should format numbers with Brazilian locale', () => {
        const result = numberFormatters.formatNumber(1234.56);
        expect(result).toBe('1.234,56');
      });

      it('should handle negative numbers', () => {
        const result = numberFormatters.formatNumber(-1234.56);
        expect(result).toBe('-1.234,56');
      });
    });

    describe('formatPercentage', () => {
      it('should format percentage', () => {
        const result = numberFormatters.formatPercentage(0.1234);
        expect(result).toBe('12.3%');
      });

      it('should handle zero percentage', () => {
        const result = numberFormatters.formatPercentage(0);
        expect(result).toBe('0.0%');
      });

      it('should format percentage with custom decimals', () => {
        const result = numberFormatters.formatPercentage(0.1234, 2);
        expect(result).toBe('12.34%');
      });
    });

    describe('formatCompactNumber', () => {
      it('should format small numbers', () => {
        const result = numberFormatters.formatCompactNumber(500);
        expect(result).toBe('500');
      });

      it('should format thousands', () => {
        const result = numberFormatters.formatCompactNumber(1500);
        expect(result).toBe('1.5K');
      });

      it('should format millions', () => {
        const result = numberFormatters.formatCompactNumber(1500000);
        expect(result).toBe('1.5M');
      });

      it('should format billions', () => {
        const result = numberFormatters.formatCompactNumber(1500000000);
        expect(result).toBe('1.5B');
      });
    });
  });

  describe('textFormatters', () => {
    describe('capitalize', () => {
      it('should capitalize first letter of each word', () => {
        const result = textFormatters.capitalize('hello world');
        expect(result).toBe('Hello World');
      });
    });

    describe('truncate', () => {
      it('should truncate long text', () => {
        const result = textFormatters.truncate('This is a very long text that needs to be truncated', 20);
        expect(result).toBe('This is a very lo...');
      });

      it('should use custom suffix', () => {
        const result = textFormatters.truncate('Long text', 5, '***');
        expect(result).toBe('Lo***');
      });

      it('should not truncate short text', () => {
        const result = textFormatters.truncate('Short', 10);
        expect(result).toBe('Short');
      });
    });

    describe('removeAccents', () => {
      it('should remove accents from text', () => {
        const result = textFormatters.removeAccents('café mañana');
        expect(result).toBe('cafe manana');
      });
    });

    describe('toSlug', () => {
      it('should create slug from text', () => {
        const result = textFormatters.toSlug('Hello World Test');
        expect(result).toBe('hello-world-test');
      });

      it('should handle special characters', () => {
        const result = textFormatters.toSlug('Hello & World! Test@123');
        expect(result).toBe('hello-world-test123');
      });

      it('should handle multiple spaces', () => {
        const result = textFormatters.toSlug('Hello   World');
        expect(result).toBe('hello-world');
      });
    });

    describe('formatId', () => {
      it('should format ID with default length', () => {
        const result = textFormatters.formatId('123456789');
        expect(result).toBe('#12345678');
      });

      it('should format ID with custom length', () => {
        const result = textFormatters.formatId('123456789', 5);
        expect(result).toBe('#12345');
      });
    });
  });

  describe('arrayFormatters', () => {
    describe('formatList', () => {
      it('should format array as list', () => {
        const result = arrayFormatters.formatList(['apple', 'banana', 'orange']);
        expect(result).toBe('apple, banana e orange');
      });

      it('should handle single item', () => {
        const result = arrayFormatters.formatList(['apple']);
        expect(result).toBe('apple');
      });

      it('should handle two items', () => {
        const result = arrayFormatters.formatList(['apple', 'banana']);
        expect(result).toBe('apple e banana');
      });

      it('should handle empty array', () => {
        const result = arrayFormatters.formatList([]);
        expect(result).toBe('');
      });

      it('should use custom conjunction', () => {
        const result = arrayFormatters.formatList(['apple', 'banana', 'orange'], 'ou');
        expect(result).toBe('apple, banana ou orange');
      });
    });

    describe('formatCount', () => {
      it('should format singular count', () => {
        const result = arrayFormatters.formatCount(1, 'item');
        expect(result).toBe('1 item');
      });

      it('should format plural count', () => {
        const result = arrayFormatters.formatCount(5, 'item');
        expect(result).toBe('5 items');
      });

      it('should use custom plural form', () => {
        const result = arrayFormatters.formatCount(2, 'person', 'people');
        expect(result).toBe('2 people');
      });
    });
  });

  describe('statusFormatters', () => {
    describe('formatTradeStatus', () => {
      it('should format active status', () => {
        const result = statusFormatters.formatTradeStatus('active');
        expect(result).toBe('Ativa');
      });

      it('should format completed status', () => {
        const result = statusFormatters.formatTradeStatus('completed');
        expect(result).toBe('Concluída');
      });

      it('should handle unknown status', () => {
        const result = statusFormatters.formatTradeStatus('unknown');
        expect(result).toBe('unknown');
      });
    });

    describe('getStatusColor', () => {
      it('should return status color for active', () => {
        const result = statusFormatters.getStatusColor('active');
        expect(result).toBe('success');
      });

      it('should return status color for completed', () => {
        const result = statusFormatters.getStatusColor('completed');
        expect(result).toBe('primary');
      });

      it('should handle unknown status', () => {
        const result = statusFormatters.getStatusColor('unknown');
        expect(result).toBe('grey');
      });
    });
  });
}); 