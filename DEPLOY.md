# 🚀 Guia de Deploy - Cartalia

Este documento contém instruções para fazer o deploy da aplicação Cartalia em produção.

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no GitHub
- Conta no Vercel (ou Netlify)
- Acesso à API do projeto

## 🛠️ Configuração Local

### 1. Environment Variables

Copie o arquivo `env.example` para `.env`:

```bash
cp env.example .env
```

Configure as variáveis necessárias:

```env
# API Configuration
VITE_API_BASE_URL=https://cards-marketplace-api-2fjj.onrender.com

# App Configuration
VITE_APP_NAME=Cartalia
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=production

# Analytics (opcional)
VITE_GA_TRACKING_ID=G-XXXXXXXXXX

# Feature Flags
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=false
```

### 2. Build Local

```bash
# Instalar dependências
npm install

# Executar testes
npm run test:run

# Build de produção
npm run build

# Preview do build
npm run preview
```

## 🌐 Deploy no Vercel

### 1. Configuração Inicial

1. Acesse [vercel.com](https://vercel.com)
2. Conecte sua conta GitHub
3. Importe o repositório `cartalia`
4. Configure as variáveis de ambiente

### 2. Environment Variables no Vercel

Configure as seguintes variáveis no painel do Vercel:

```
VITE_API_BASE_URL=https://cards-marketplace-api-2fjj.onrender.com
VITE_APP_NAME=Cartalia
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=production
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=false
```

### 3. Configuração do Projeto

O arquivo `vercel.json` já está configurado com:

- Build settings
- Routes para SPA
- Headers de segurança
- Cache para assets

### 4. Deploy Automático

O GitHub Actions está configurado para:

- **Pull Requests**: Deploy de preview
- **Push para main**: Deploy de produção

## 🔧 Deploy Manual

### 1. Build

```bash
npm run build
```

### 2. Deploy via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## 📊 Analytics

### Google Analytics

1. Crie uma conta no [Google Analytics](https://analytics.google.com)
2. Configure uma propriedade para o site
3. Copie o ID de rastreamento (G-XXXXXXXXXX)
4. Adicione à variável `VITE_GA_TRACKING_ID`
5. Ative `VITE_ENABLE_ANALYTICS=true`

### Eventos Rastreados

- Page views
- Login/Registro
- Criação de trocas
- Adição de cartas
- Erros da aplicação

## 🔒 Segurança

### Headers Configurados

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

### CORS

A API está configurada para aceitar requisições do domínio de produção.

## 📱 PWA

### Funcionalidades

- Service Worker para cache
- Manifest para instalação
- Offline support
- Push notifications (preparado)

### Configuração

O PWA está configurado automaticamente via:

- `public/manifest.json`
- `public/sw.js`
- Meta tags no `index.html`

## 🚨 Troubleshooting

### Build Fails

1. Verifique se todas as dependências estão instaladas
2. Execute `npm run test:run` para verificar testes
3. Verifique se não há erros de TypeScript

### Deploy Fails

1. Verifique as variáveis de ambiente
2. Confirme se a API está acessível
3. Verifique os logs no Vercel

### PWA Não Funciona

1. Verifique se `VITE_ENABLE_PWA=true`
2. Confirme se o Service Worker está registrado
3. Teste em HTTPS (obrigatório para PWA)

## 📈 Monitoramento

### Performance

- Use o Lighthouse para auditar performance
- Monitore Core Web Vitals
- Verifique métricas de carregamento

### Erros

- Configure error tracking (Sentry)
- Monitore logs do Vercel
- Use Google Analytics para rastrear erros

## 🔄 CI/CD

### GitHub Actions

O workflow `.github/workflows/deploy.yml` inclui:

1. **Build & Test**: Executa testes e build
2. **Preview Deploy**: Para Pull Requests
3. **Production Deploy**: Para main branch

### Secrets Necessários

Configure no GitHub:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `VITE_API_BASE_URL`

## 📞 Suporte

Para problemas de deploy:

1. Verifique os logs do Vercel
2. Consulte a documentação do Vercel
3. Abra uma issue no GitHub
4. Entre em contato com a equipe

---

**Última atualização**: Julho 2024
**Versão**: 1.0.0 