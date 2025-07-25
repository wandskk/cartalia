# 🚀 Guia de Deploy

Este documento descreve o processo de deploy do projeto Cartalia, incluindo configurações, ambientes e boas práticas.

## 📋 Índice

- [🎯 Visão Geral](#-visão-geral)
- [🌍 Ambientes](#-ambientes)
- [🔧 Configuração](#-configuração)
- [📦 Build](#-build)
- [🚀 Deploy](#-deploy)
- [🔍 Monitoramento](#-monitoramento)
- [🛡️ Segurança](#-segurança)
- [📊 Performance](#-performance)

## 🎯 Visão Geral

O Cartalia utiliza **Vercel** como plataforma principal de deploy, oferecendo:

- **Deploy Automático**: Integração com GitHub
- **Preview Deployments**: Deploy automático para Pull Requests
- **Edge Functions**: Performance global
- **Analytics**: Métricas de performance
- **HTTPS**: Certificados SSL automáticos

### 🎨 Stack de Deploy

```
GitHub Repository
├── Vercel (Platform)
├── GitHub Actions (CI/CD)
├── Vite (Build Tool)
└── Edge Network (CDN)
```

## 🌍 Ambientes

### 🏭 Produção

- **URL**: `https://cartalia.vercel.app`
- **Branch**: `main`
- **Deploy**: Automático
- **Cache**: Ativo

### 🧪 Preview

- **URL**: `https://cartalia-git-feature-branch.vercel.app`
- **Branch**: `feature/*`
- **Deploy**: Automático para PRs
- **Cache**: Limitado

### 🔧 Desenvolvimento

- **URL**: `http://localhost:5173`
- **Comando**: `npm run dev`
- **Hot Reload**: Ativo
- **Source Maps**: Ativo

## 🔧 Configuração

### 📦 Variáveis de Ambiente

#### Produção

```env
# .env.production
VITE_API_BASE_URL=https://cards-marketplace-api-2fjj.onrender.com
VITE_APP_NAME=Cartalia
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=production
VITE_ANALYTICS_ID=G-XXXXXXXXXX
```

#### Desenvolvimento

```env
# .env.development
VITE_API_BASE_URL=https://cards-marketplace-api-2fjj.onrender.com
VITE_APP_NAME=Cartalia (Dev)
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development
VITE_ANALYTICS_ID=G-XXXXXXXXXX
```

### ⚙️ Configuração do Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "sass:math"; @use "@/styles/_variables.scss" as *;`
      }
    }
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia', 'vuetify']
        }
      }
    }
  }
})
```

### 🎯 Configuração do Vercel

```json
// vercel.json
{
  "version": 2,
  "name": "cartalia",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/assets/(.*)",
      "dest": "/assets/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ],
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  }
}
```

## 📦 Build

### 🔧 Scripts de Build

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build",
    "preview": "vite preview",
    "deploy": "npm run build && vercel --prod",
    "deploy:preview": "npm run build && vercel",
    "analyze": "vite build --mode analyze",
    "lighthouse": "lighthouse http://localhost:4173 --output html --output-path ./lighthouse-report.html"
  }
}
```

### 🎯 Processo de Build

1. **Type Checking**: `vue-tsc -b`
2. **Bundle**: `vite build`
3. **Optimization**: Minificação e tree shaking
4. **Assets**: Processamento de imagens e CSS
5. **Output**: Geração dos arquivos finais

### 📊 Análise do Bundle

```bash
# Analisar tamanho do bundle
npm run analyze

# Verificar dependências
npm ls --depth=0

# Otimizar dependências
npm audit fix
```

## 🚀 Deploy

### 🔄 Deploy Automático

#### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm run test:run
    
    - name: Build
      run: npm run build
      env:
        VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
        VITE_APP_NAME: ${{ secrets.VITE_APP_NAME }}
        VITE_APP_VERSION: ${{ secrets.VITE_APP_VERSION }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: ${{ github.ref == 'refs/heads/main' && '--prod' || '' }}
```

#### Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login no Vercel
vercel login

# Deploy de preview
vercel

# Deploy de produção
vercel --prod
```

### 📝 Deploy Manual

```bash
# 1. Build do projeto
npm run build

# 2. Verificar arquivos gerados
ls -la dist/

# 3. Deploy para Vercel
vercel --prod

# 4. Verificar deploy
vercel ls
```

### 🔧 Configuração de Domínio

```bash
# Adicionar domínio customizado
vercel domains add cartalia.com

# Configurar DNS
# A: 76.76.19.19
# CNAME: www -> cartalia.vercel.app
```

## 🔍 Monitoramento

### 📊 Analytics

#### Google Analytics

```typescript
// src/utils/analytics.ts
export const initAnalytics = () => {
  if (import.meta.env.PROD) {
    gtag('config', import.meta.env.VITE_ANALYTICS_ID, {
      page_title: document.title,
      page_location: window.location.href
    });
  }
};

export const trackEvent = (action: string, category: string, label?: string) => {
  if (import.meta.env.PROD) {
    gtag('event', action, {
      event_category: category,
      event_label: label
    });
  }
};
```

#### Vercel Analytics

```typescript
// src/main.ts
import { injectSpeedInsights } from '@vercel/speed-insights';

// Injetar analytics de performance
injectSpeedInsights();
```

### 🚨 Error Tracking

```typescript
// src/utils/errorHandler.ts
export const trackError = (error: Error, context: string) => {
  if (import.meta.env.PROD) {
    // Enviar para serviço de tracking
    console.error(`[${context}] Error:`, error);
    
    // Analytics
    trackEvent('error', 'application', context);
  }
};
```

### 📈 Métricas de Performance

```typescript
// src/utils/performance.ts
export const trackPerformance = () => {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      const metrics = {
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp: navigation.connectEnd - navigation.connectStart,
        ttfb: navigation.responseStart - navigation.requestStart,
        domLoad: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        windowLoad: navigation.loadEventEnd - navigation.loadEventStart
      };
      
      trackEvent('performance', 'metrics', JSON.stringify(metrics));
    });
  }
};
```

## 🛡️ Segurança

### 🔒 Headers de Segurança

```typescript
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://cards-marketplace-api-2fjj.onrender.com https://www.google-analytics.com;"
        }
      ]
    }
  ]
}
```

### 🔐 Variáveis Sensíveis

```bash
# Configurar no Vercel Dashboard
VITE_API_BASE_URL=https://cards-marketplace-api-2fjj.onrender.com
VITE_ANALYTICS_ID=G-XXXXXXXXXX
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
```

### 🛡️ Validação de Entrada

```typescript
// src/utils/validation.ts
import { z } from 'zod';

export const validateInput = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    throw new Error(`Validation failed: ${error}`);
  }
};
```

## 📊 Performance

### 🚀 Otimizações

#### Code Splitting

```typescript
// src/router/index.ts
const routes = [
  {
    path: '/',
    component: () => import('@/views/DashboardView.vue')
  },
  {
    path: '/cards',
    component: () => import('@/views/CardsView.vue')
  },
  {
    path: '/trades',
    component: () => import('@/views/TradesView.vue')
  }
];
```

#### Lazy Loading

```typescript
// src/components/features/cards/CardList.vue
const CardDetailModal = defineAsyncComponent(() => 
  import('./CardDetailModal.vue')
);
```

#### Bundle Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia', 'vuetify'],
          utils: ['axios', 'zod', 'vee-validate']
        }
      }
    }
  }
});
```

### 📱 PWA

#### Service Worker

```javascript
// public/sw.js
const CACHE_NAME = 'cartalia-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/vendor.js',
  '/assets/main.js',
  '/assets/style.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

#### Manifest

```json
// public/manifest.json
{
  "name": "Cartalia - Marketplace de Cartas",
  "short_name": "Cartalia",
  "description": "Marketplace para troca de cartas colecionáveis",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1976d2",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 📊 Lighthouse

```bash
# Executar Lighthouse
npm run lighthouse

# Verificar métricas
# - First Contentful Paint: < 1.5s
# - Largest Contentful Paint: < 2.5s
# - Cumulative Layout Shift: < 0.1
# - First Input Delay: < 100ms
```

## 🔧 Troubleshooting

### 🚨 Problemas Comuns

#### Build Falha

```bash
# Verificar dependências
npm audit
npm audit fix

# Limpar cache
npm run clean
rm -rf node_modules package-lock.json
npm install

# Verificar TypeScript
npm run type-check
```

#### Deploy Falha

```bash
# Verificar logs
vercel logs

# Verificar variáveis de ambiente
vercel env ls

# Re-deploy
vercel --prod --force
```

#### Performance Ruim

```bash
# Analisar bundle
npm run analyze

# Verificar métricas
npm run lighthouse

# Otimizar imagens
npm run optimize-images
```

### 📝 Logs e Debug

```bash
# Ver logs do Vercel
vercel logs

# Ver logs de função
vercel logs --function=api/hello

# Debug local
vercel dev --debug
```

## 🎯 Boas Práticas

### 📦 Deploy

1. **Sempre teste localmente** antes do deploy
2. **Use branches** para features
3. **Configure CI/CD** para automação
4. **Monitore performance** após cada deploy
5. **Mantenha backups** dos dados

### 🔒 Segurança

1. **Nunca commite** variáveis sensíveis
2. **Use HTTPS** sempre
3. **Configure CSP** adequadamente
4. **Valide inputs** do usuário
5. **Mantenha dependências** atualizadas

### 📊 Performance

1. **Otimize imagens** antes do deploy
2. **Use lazy loading** para componentes
3. **Implemente cache** adequadamente
4. **Monitore métricas** regularmente
5. **Teste em diferentes** dispositivos

### 🔍 Monitoramento

1. **Configure alertas** para erros
2. **Monitore uptime** da aplicação
3. **Track métricas** de performance
4. **Analise logs** regularmente
5. **Mantenha documentação** atualizada 