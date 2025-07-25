export class Analytics {
  private isEnabled: boolean;
  private trackingId: string | null;

  constructor() {
    this.isEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
    this.trackingId = import.meta.env.VITE_GA_TRACKING_ID || null;
    
    if (this.isEnabled && this.trackingId) {
      this.initialize();
    }
  }

  private initialize() {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', this.trackingId);
  }

  trackEvent(action: string, category: string, label?: string, value?: number) {
    if (!this.isEnabled || !window.gtag) return;

    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }

  trackPageView(page: string) {
    if (!this.isEnabled || !window.gtag) return;

    window.gtag('config', this.trackingId, {
      page_path: page
    });
  }

  trackException(description: string, fatal = false) {
    if (!this.isEnabled || !window.gtag) return;

    window.gtag('event', 'exception', {
      description,
      fatal
    });
  }
}

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const analytics = new Analytics(); 
