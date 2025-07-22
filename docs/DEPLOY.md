# 🚀 Guia de Deploy

Este documento explica como fazer o deploy do Cartalia no Vercel e configurar o CI/CD.

## 📋 Índice

- [🎯 Visão Geral](#-visão-geral)
- [🔧 Configuração do Vercel](#-configuração-do-vercel)
- [🔑 Configurando Secrets](#-configurando-secrets)
- [⚙️ GitHub Actions](#️-github-actions)
- [🌍 Variáveis de Ambiente](#-variáveis-de-ambiente)
- [📱 PWA Deploy](#-pwa-deploy)
- [🔍 Troubleshooting](#-troubleshooting)

## 🎯 Visão Geral

O Cartalia está configurado para deploy automático no **Vercel** através do **GitHub Actions**. O processo inclui:

- ✅ **Build automático** a cada push
- ✅ **Testes** antes do deploy
- ✅ **Deploy de preview** para Pull Requests
- ✅ **Deploy de produção** para main
- ✅ **PWA** configurada automaticamente

## 🔧 Configuração do Vercel

### 1. Criando Conta no Vercel

1. **Acesse** [vercel.com](https://vercel.com)
2. **Faça login** com sua conta GitHub
3. **Autorize** o Vercel a acessar seus repositórios

### 2. Importando o Projeto

1. **Clique** em "New Project"
2. **Selecione** o repositório `cartalia`
3. **Configure** as opções:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Clique** em "Deploy"

### 3. Configuração Inicial

O Vercel detectará automaticamente:
- ✅ Framework Vue.js
- ✅ Build tool Vite
- ✅ Configurações do `vercel.json`

## 🔑 Configurando Secrets

### Secrets Necessários

Para o GitHub Actions funcionar, você precisa configurar estes secrets no repositório:

#### 1. VERCEL_TOKEN

1. **Acesse** [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. **Clique** em "Create Token"
3. **Configure**:
   - **Name**: `GitHub Actions`
   - **Expiration**: `No Expiration`
   - **Scope**: `Full Account`
4. **Copie** o token gerado
5. **Adicione** no GitHub:
   - Vá para `Settings > Secrets and variables > Actions`
   - Clique em "New repository secret"
   - **Name**: `VERCEL_TOKEN`
   - **Value**: Cole o token

#### 2. VERCEL_ORG_ID

1. **Acesse** [vercel.com/account](https://vercel.com/account)
2. **Copie** o "Team ID" (se tiver) ou "Personal Account ID"
3. **Adicione** no GitHub:
   - **Name**: `VERCEL_ORG_ID`
   - **Value**: Cole o ID

#### 3. VERCEL_PROJECT_ID

1. **Acesse** o projeto no Vercel
2. **Vá** para `Settings > General`
3. **Copie** o "Project ID"
4. **Adicione** no GitHub:
   - **Name**: `VERCEL_PROJECT_ID`
   - **Value**: Cole o ID

### Como Adicionar Secrets no GitHub

1. **Acesse** seu repositório no GitHub
2. **Vá** para `Settings > Secrets and variables > Actions`
3. **Clique** em "New repository secret"
4. **Preencha**:
   - **Name**: Nome do secret
   - **Value**: Valor do secret
5. **Clique** em "Add secret"

## ⚙️ GitHub Actions

### Workflows Disponíveis

#### 1. `deploy.yml` (Completo)
- Build e testes
- Deploy separado para preview e produção
- Upload de artifacts

#### 2. `deploy-simple.yml` (Simplificado)
- Build, testes e deploy em um job
- Mais simples de configurar

### Configurando o Workflow

1. **Escolha** um dos workflows
2. **Renomeie** para `deploy.yml` (se necessário)
3. **Configure** os secrets (conforme seção anterior)
4. **Faça push** para ativar

### Estrutura do Workflow

```yaml
name: Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    # Build e testes
  deploy:
    # Deploy para Vercel
```

## 🌍 Variáveis de Ambiente

### Configuração no Vercel

1. **Acesse** o projeto no Vercel
2. **Vá** para `Settings > Environment Variables`
3. **Adicione** as variáveis:

| Variável | Valor | Ambiente |
|----------|-------|----------|
| `VITE_API_BASE_URL` | `https://cards-marketplace-api-2fjj.onrender.com` | Production, Preview |
| `VITE_APP_NAME` | `Cartalia` | Production, Preview |
| `VITE_APP_VERSION` | `1.0.0` | Production, Preview |
| `VITE_APP_ENVIRONMENT` | `production` | Production |
| `VITE_APP_ENVIRONMENT` | `preview` | Preview |

### Configuração no GitHub Actions

As variáveis são definidas no workflow:

```yaml
- name: Build
  run: npm run build
  env:
    VITE_API_BASE_URL: https://cards-marketplace-api-2fjj.onrender.com
    VITE_APP_ENVIRONMENT: production
```

## 📱 PWA Deploy

### Configuração Automática

O PWA é configurado automaticamente através do:

- **`public/manifest.json`**: Configuração do app
- **`public/sw.js`**: Service Worker
- **`vercel.json`**: Headers e configurações

### Verificando o PWA

1. **Acesse** o site deployado
2. **Abra** DevTools (F12)
3. **Vá** para aba "Application"
4. **Verifique**:
   - Manifest
   - Service Worker
   - Cache Storage

### Testando Instalação

1. **Acesse** o site no Chrome
2. **Procure** pelo ícone de instalação na barra de endereços
3. **Clique** em "Instalar"
4. **Teste** o app instalado

## 🔍 Troubleshooting

### Erros Comuns

#### 1. "Input required and not supplied: vercel-token"

**Problema**: Secret do Vercel não configurado

**Solução**:
1. Verifique se o `VERCEL_TOKEN` está configurado
2. Confirme se o token é válido
3. Regenere o token se necessário

#### 2. "Build failed"

**Problema**: Erro durante o build

**Solução**:
1. Teste localmente: `npm run build`
2. Verifique logs do Vercel
3. Confirme variáveis de ambiente

#### 3. "Deploy failed"

**Problema**: Falha no deploy

**Solução**:
1. Verifique todos os secrets
2. Confirme configuração do projeto
3. Teste deploy manual no Vercel

### Logs e Debug

#### GitHub Actions

1. **Acesse** a aba "Actions" no GitHub
2. **Clique** no workflow falhado
3. **Analise** os logs de cada step

#### Vercel

1. **Acesse** o projeto no Vercel
2. **Vá** para aba "Deployments"
3. **Clique** no deploy falhado
4. **Analise** os logs

### Deploy Manual

Se o CI/CD falhar, você pode fazer deploy manual:

1. **Acesse** o Vercel
2. **Clique** em "Deploy"
3. **Selecione** o branch
4. **Aguarde** o deploy

## 📊 Monitoramento

### Métricas de Deploy

- **Tempo de build**: < 2 minutos
- **Tempo de deploy**: < 1 minuto
- **Taxa de sucesso**: > 95%

### Alertas

Configure alertas para:
- Deploy falhado
- Build falhado
- Testes falhados
- Performance degradada

## 🔄 Atualizações

### Atualizando Configuração

1. **Edite** o `vercel.json`
2. **Faça commit** das mudanças
3. **Push** para main
4. **Aguarde** deploy automático

### Rollback

Para fazer rollback:

1. **Acesse** o Vercel
2. **Vá** para "Deployments"
3. **Clique** em deploy anterior
4. **Clique** em "Promote to Production"

---

## 📞 Suporte

**Problemas com Vercel**: [vercel.com/support](https://vercel.com/support)
**Problemas com GitHub Actions**: [github.com/actions](https://github.com/actions)

---

*Última atualização: Julho 2024* 