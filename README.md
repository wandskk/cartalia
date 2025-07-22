# 🃏 Cartalia - Marketplace de Cartas

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite)](https://vitejs.dev/)
[![Pinia](https://img.shields.io/badge/Pinia-2.x-yellow?logo=pinia)](https://pinia.vuejs.org/)
[![SASS](https://img.shields.io/badge/SASS-1.x-CC6699?logo=sass)](https://sass-lang.com/)
[![Vitest](https://img.shields.io/badge/Vitest-1.x-6E9F18?logo=vitest)](https://vitest.dev/)

> **Marketplace para troca de cartas colecionáveis** - Uma aplicação moderna desenvolvida com Vue 3, TypeScript e Pinia para gerenciamento de estado.

## 📋 Índice

- [🎯 Sobre o Projeto](#-sobre-o-projeto)
- [🚀 Funcionalidades](#-funcionalidades)
- [🛠️ Tecnologias](#️-tecnologias)
- [📦 Instalação](#-instalação)
- [🏗️ Estrutura do Projeto](#️-estrutura-do-projeto)
- [🔧 Scripts Disponíveis](#-scripts-disponíveis)
- [📱 PWA](#-pwa)
- [🧪 Testes](#-testes)
- [🚀 Deploy](#-deploy)
- [📚 Documentação](#-documentação)
- [🤝 Contribuindo](#-contribuindo)
- [📄 Licença](#-licença)

## 🎯 Sobre o Projeto

O **Cartalia** é um marketplace moderno para troca de cartas colecionáveis, desenvolvido como parte do teste técnico para a vaga de Front-End Pleno na INMETA. A aplicação oferece uma experiência completa de gerenciamento de cartas e negociações entre usuários.

### ✨ Características Principais

- **Interface Moderna**: Design responsivo e intuitivo
- **PWA**: Funciona offline e pode ser instalado como app
- **Performance Otimizada**: Lazy loading e code splitting
- **TypeScript**: Tipagem estática para maior confiabilidade
- **Testes Automatizados**: Cobertura de testes unitários
- **Deploy Automático**: CI/CD com GitHub Actions

## 🚀 Funcionalidades

### 👤 Autenticação
- ✅ Registro de usuário
- ✅ Login/Logout
- ✅ Persistência de sessão
- ✅ Proteção de rotas

### 🃏 Gerenciamento de Cartas
- ✅ Visualização de todas as cartas disponíveis
- ✅ Adição de cartas à coleção pessoal
- ✅ Detalhes completos de cada carta
- ✅ Busca e filtros

### 🔄 Sistema de Trocas
- ✅ Criação de solicitações de troca
- ✅ Seleção de cartas para oferecer/receber
- ✅ Visualização de todas as trocas disponíveis
- ✅ Gerenciamento de trocas próprias
- ✅ Exclusão de trocas

### 📊 Dashboard
- ✅ Estatísticas da conta
- ✅ Atividades recentes
- ✅ Ações rápidas
- ✅ Visão geral da coleção

### 🛡️ Tratamento de Erros
- ✅ Modal de erros global
- ✅ Páginas de erro customizadas
- ✅ Logs detalhados
- ✅ Analytics de erros

## 🛠️ Tecnologias

### Frontend
- **[Vue 3](https://vuejs.org/)** - Framework progressivo
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Vite](https://vitejs.dev/)** - Build tool e dev server
- **[Pinia](https://pinia.vuejs.org/)** - Gerenciamento de estado
- **[Vue Router](https://router.vuejs.org/)** - Roteamento
- **[SASS](https://sass-lang.com/)** - Pré-processador CSS

### Validação e Formulários
- **[Zod](https://zod.dev/)** - Validação de schemas
- **[VeeValidate](https://vee-validate.logaretm.com/)** - Validação de formulários

### Testes
- **[Vitest](https://vitest.dev/)** - Framework de testes
- **[Vue Test Utils](https://test-utils.vuejs.org/)** - Utilitários para testes
- **[Testing Library](https://testing-library.com/)** - Utilitários de teste

### Deploy e Performance
- **[Vercel](https://vercel.com/)** - Plataforma de deploy
- **[GitHub Actions](https://github.com/features/actions)** - CI/CD
- **[PWA](https://web.dev/progressive-web-apps/)** - Progressive Web App

### Analytics e Monitoramento
- **[Google Analytics](https://analytics.google.com/)** - Analytics
- **[Error Tracking]** - Rastreamento de erros

## 📦 Instalação

### Pré-requisitos

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** ou **yarn**
- **Git**

### Passos

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/cartalia.git
   cd cartalia
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp env.example .env
   ```
   
   Edite o arquivo `.env` com suas configurações:
   ```env
   VITE_API_BASE_URL=https://cards-marketplace-api-2fjj.onrender.com
   VITE_APP_NAME=Cartalia
   VITE_APP_VERSION=1.0.0
   VITE_APP_ENVIRONMENT=development
   ```

4. **Execute o projeto**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**
   ```
   http://localhost:5173
   ```

## 🏗️ Estrutura do Projeto

```
cartalia/
├── public/                 # Arquivos públicos
│   ├── manifest.json      # PWA manifest
│   ├── sw.js             # Service Worker
│   ├── robots.txt        # SEO
│   └── sitemap.xml       # Sitemap
├── src/
│   ├── components/       # Componentes Vue
│   │   ├── common/       # Componentes comuns
│   │   ├── features/     # Componentes específicos
│   │   └── layout/       # Componentes de layout
│   ├── views/           # Páginas da aplicação
│   ├── stores/          # Stores Pinia
│   ├── services/        # Serviços de API
│   ├── utils/           # Utilitários
│   ├── types/           # Tipos TypeScript
│   ├── styles/          # Estilos globais
│   ├── router/          # Configuração de rotas
│   └── test/            # Configuração de testes
├── .github/             # GitHub Actions
├── docs/                # Documentação adicional
└── vercel.json          # Configuração Vercel
```

### Organização dos Componentes

```
src/components/
├── common/              # Componentes reutilizáveis
│   ├── BaseButton.vue
│   ├── BaseInput.vue
│   ├── ErrorModal.vue
│   └── UserAvatar.vue
├── features/            # Componentes específicos
│   ├── auth/           # Autenticação
│   ├── cards/          # Gerenciamento de cartas
│   ├── dashboard/      # Dashboard
│   └── trades/         # Sistema de trocas
└── layout/             # Componentes de layout
    ├── Header.vue
    ├── Footer.vue
    └── Container.vue
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento
npm run preview          # Preview do build de produção

# Build
npm run build            # Build de produção
npm run analyze          # Análise do bundle

# Testes
npm run test             # Executa testes em modo watch
npm run test:run         # Executa testes uma vez
npm run test:ui          # Interface visual para testes
npm run test:coverage    # Cobertura de testes

# Deploy
npm run deploy           # Deploy para produção
npm run deploy:preview   # Deploy de preview

# Qualidade
npm run lint             # Linting do código
npm run type-check       # Verificação de tipos
```

## 📱 PWA

O Cartalia é uma **Progressive Web App** com as seguintes funcionalidades:

### ✨ Funcionalidades PWA
- **Instalação**: Pode ser instalado como app nativo
- **Offline**: Funciona sem conexão com internet
- **Cache**: Recursos cacheados para performance
- **Push Notifications**: Preparado para notificações

### 🔧 Configuração
- **Service Worker**: `public/sw.js`
- **Manifest**: `public/manifest.json`
- **Meta Tags**: Configuradas no `index.html`

## 🧪 Testes

### Estrutura de Testes
```
src/
├── components/__tests__/    # Testes de componentes
├── stores/__tests__/        # Testes de stores
├── utils/__tests__/         # Testes de utilitários
└── test/                    # Configuração de testes
    └── setup.ts            # Setup global
```

### Executando Testes
```bash
# Todos os testes
npm run test:run

# Testes com interface visual
npm run test:ui

# Cobertura de testes
npm run test:coverage

# Testes específicos
npm run test -- --run src/components/__tests__/
```

### Cobertura de Testes
- ✅ **Stores**: Autenticação, erros
- ✅ **Utilitários**: Validação, tratamento de erros
- ✅ **Componentes**: Botões, inputs, modais
- ✅ **Integração**: Fluxos principais

## 🚀 Deploy

### Deploy Automático
O projeto está configurado com **GitHub Actions** para deploy automático:

- **Pull Request**: Deploy de preview
- **Push para main**: Deploy de produção

### Plataforma
- **Vercel**: Deploy e hospedagem
- **Domínio**: `https://cartalia.vercel.app`

### Configuração
Veja o arquivo [DEPLOY.md](./DEPLOY.md) para instruções detalhadas de deploy.

## 📚 Documentação

### 📖 Documentação Técnica
- [Arquitetura](./docs/ARCHITECTURE.md) - Estrutura e padrões
- [API](./docs/API.md) - Documentação da API
- [Componentes](./docs/COMPONENTS.md) - Guia de componentes
- [Testes](./docs/TESTING.md) - Estratégia de testes

### 🎯 Guias de Uso
- [Manual do Usuário](./docs/USER_GUIDE.md) - Como usar a aplicação
- [FAQ](./docs/FAQ.md) - Perguntas frequentes
- [Troubleshooting](./docs/TROUBLESHOOTING.md) - Solução de problemas

### 🔧 Desenvolvimento
- [Setup](./docs/SETUP.md) - Configuração do ambiente
- [Padrões](./docs/PATTERNS.md) - Convenções de código
- [Commits](./docs/COMMITS.md) - Padrão de commits

## 🤝 Contribuindo

### Estrutura de Branches
```
main                    # Branch principal
├── feat/              # Novas funcionalidades
├── fix/               # Correções de bugs
├── refactor/          # Refatorações
├── chore/             # Configurações e dependências
├── test/              # Testes
└── docs/              # Documentação
```

### Padrão de Commits
```
feat: adicionar funcionalidade de login
fix: corrigir validação de formulário
refactor: extrair componente de card
style: ajustar espaçamento do header
test: adicionar testes para store de auth
chore: atualizar dependências
docs: adicionar documentação da API
```

### Processo de Contribuição
1. **Fork** o projeto
2. **Crie** uma branch para sua feature
3. **Commit** suas mudanças
4. **Push** para a branch
5. **Abra** um Pull Request

## 📄 Licença

Este projeto foi desenvolvido como parte do teste técnico para a vaga de **Front-End Pleno** na **INMETA**.

---

## 🎯 Status do Projeto

### ✅ Implementado
- [x] Autenticação completa
- [x] Gerenciamento de cartas
- [x] Sistema de trocas
- [x] Dashboard
- [x] Tratamento de erros
- [x] Testes unitários
- [x] PWA
- [x] Deploy automático
- [x] Analytics
- [x] Documentação

### 🚀 Próximas Funcionalidades
- [ ] Notificações push
- [ ] Chat entre usuários
- [ ] Sistema de avaliações
- [ ] Filtros avançados
- [ ] Exportação de dados
- [ ] Temas dark/light

---

**Desenvolvido com ❤️ por Wanderson Kenedy**
**Contato**: [devwk.c@gmail.com](mailto:devwk.c@gmail.com)
**LinkedIn**: [linkedin.com/in/wanderson-kenedy-soares](https://linkedin.com/in/wanderson-kenedy-soares)
**GitHub**: [github.com/wandskk](https://github.com/wandskk)
