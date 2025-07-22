interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

class Analytics {
  private isEnabled: boolean;
  private trackingId: string | null;

  constructor() {
    this.isEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
    this.trackingId = import.meta.env.VITE_GA_TRACKING_ID || null;
    
    if (this.isEnabled && this.trackingId) {
      this.initGoogleAnalytics();
    }
  }

  private initGoogleAnalytics() {
    // Google Analytics 4
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', this.trackingId);
  }

  trackPageView(page: string) {
    if (!this.isEnabled) return;

    if (window.gtag) {
      window.gtag('config', this.trackingId, {
        page_path: page
      });
    }

    console.log('📊 Page View:', page);
  }

  trackEvent(event: AnalyticsEvent) {
    if (!this.isEnabled) return;

    if (window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value
      });
    }

    console.log('📊 Event:', event);
  }

  trackError(error: Error, context?: string) {
    this.trackEvent({
      action: 'error',
      category: 'app',
      label: `${error.name}: ${error.message}`,
      value: context ? 1 : 0
    });
  }

  trackUserAction(action: string, category: string = 'user') {
    this.trackEvent({
      action,
      category
    });
  }

  trackTradeCreated(tradeId: string) {
    this.trackEvent({
      action: 'trade_created',
      category: 'trading',
      label: tradeId
    });
  }

  trackCardAdded(cardId: string) {
    this.trackEvent({
      action: 'card_added',
      category: 'cards',
      label: cardId
    });
  }

  trackLogin(method: string = 'email') {
    this.trackEvent({
      action: 'login',
      category: 'auth',
      label: method
    });
  }

  trackRegister(method: string = 'email') {
    this.trackEvent({
      action: 'register',
      category: 'auth',
      label: method
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