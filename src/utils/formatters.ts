/**
 * Utilitários para formatação de dados
 */

// Formatação de datas
export const dateFormatters = {
  /**
   * Formata data para exibição brasileira
   */
  formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };

    return dateObj.toLocaleDateString('pt-BR', { ...defaultOptions, ...options });
  },

  /**
   * Formata data apenas com data (sem hora)
   */
  formatDateOnly(date: Date | string): string {
    return dateFormatters.formatDate(date, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  /**
   * Formata data relativa (ex: "há 2 horas")
   */
  formatRelativeDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
      return 'Agora mesmo';
    } else if (diffInMinutes < 60) {
      return `há ${diffInMinutes} minuto${diffInMinutes !== 1 ? 's' : ''}`;
    } else if (diffInHours < 24) {
      return `há ${diffInHours} hora${diffInHours !== 1 ? 's' : ''}`;
    } else if (diffInDays < 7) {
      return `há ${diffInDays} dia${diffInDays !== 1 ? 's' : ''}`;
    } else {
      return dateFormatters.formatDateOnly(date);
    }
  },

  /**
   * Verifica se uma data é hoje
   */
  isToday(date: Date | string): boolean {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    
    return dateObj.toDateString() === today.toDateString();
  },

  /**
   * Verifica se uma data é recente (últimos 7 dias)
   */
  isRecent(date: Date | string): boolean {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));
    
    return diffInDays <= 7;
  }
};

// Formatação de números
export const numberFormatters = {
  /**
   * Formata número com separadores de milhares
   */
  formatNumber(num: number): string {
    return num.toLocaleString('pt-BR');
  },

  /**
   * Formata número como porcentagem
   */
  formatPercentage(num: number, decimals: number = 1): string {
    return `${(num * 100).toFixed(decimals)}%`;
  },

  /**
   * Formata número compacto (ex: 1.2K, 1.5M)
   */
  formatCompactNumber(num: number): string {
    if (num < 1000) return num.toString();
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
    if (num < 1000000000) return `${(num / 1000000).toFixed(1)}M`;
    return `${(num / 1000000000).toFixed(1)}B`;
  }
};

// Formatação de texto
export const textFormatters = {
  /**
   * Capitaliza primeira letra de cada palavra
   */
  capitalize(text: string): string {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  },

  /**
   * Trunca texto com ellipsis
   */
  truncate(text: string, maxLength: number, suffix: string = '...'): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - suffix.length) + suffix;
  },

  /**
   * Remove acentos de texto
   */
  removeAccents(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  },

  /**
   * Converte para slug (URL-friendly)
   */
  toSlug(text: string): string {
    return textFormatters.removeAccents(text)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  },

  /**
   * Formata ID para exibição (primeiros 8 caracteres)
   */
  formatId(id: string, length: number = 8): string {
    return `#${id.slice(0, length)}`;
  }
};

// Formatação de arrays
export const arrayFormatters = {
  /**
   * Formata lista de itens com vírgulas
   */
  formatList(items: string[], conjunction: string = 'e'): string {
    if (items.length === 0) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
    
    const last = items.pop();
    return `${items.join(', ')} ${conjunction} ${last}`;
  },

  /**
   * Formata contagem de itens
   */
  formatCount(count: number, singular: string, plural?: string): string {
    const pluralForm = plural || `${singular}s`;
    return `${count} ${count === 1 ? singular : pluralForm}`;
  }
};

// Formatação de status
export const statusFormatters = {
  /**
   * Formata status de troca
   */
  formatTradeStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'active': 'Ativa',
      'completed': 'Concluída',
      'expired': 'Expirada',
      'pending': 'Pendente',
      'cancelled': 'Cancelada'
    };
    
    return statusMap[status] || status;
  },

  /**
   * Retorna cor do status
   */
  getStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
      'active': 'success',
      'completed': 'primary',
      'expired': 'error',
      'pending': 'warning',
      'cancelled': 'grey'
    };
    
    return colorMap[status] || 'grey';
  }
}; 