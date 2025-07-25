# Estrutura de Testes

Esta pasta contém todos os testes do projeto organizados por categoria e funcionalidade.

## 📁 Estrutura

```
src/tests/
├── README.md                    # Esta documentação
├── setup.ts                     # Configuração global dos testes
├── mocks/                       # Mocks globais
│   ├── index.ts
│   ├── api.ts
│   └── stores.ts
├── utils/                       # Utilitários para testes
│   ├── index.ts
│   ├── test-utils.ts
│   └── component-utils.ts
├── unit/                        # Testes unitários
│   ├── stores/                  # Testes das stores Pinia
│   │   ├── auth.test.ts
│   │   ├── cards.test.ts
│   │   ├── trades.test.ts
│   │   ├── loading.test.ts
│   │   ├── notification.test.ts
│   │   ├── error.test.ts
│   │   ├── sidebar.test.ts
│   │   └── cache.test.ts
│   ├── composables/             # Testes dos composables
│   │   ├── useApi.test.ts
│   │   ├── useAuthForm.test.ts
│   │   ├── useDashboard.test.ts
│   │   ├── useSidebar.test.ts
│   │   ├── useTradeCreation.test.ts
│   │   ├── useCardFilters.test.ts
│   │   ├── useCardStates.test.ts
│   │   ├── useTradeFilters.test.ts
│   │   ├── useLoadingState.test.ts
│   │   ├── useCardSelection.test.ts
│   │   ├── useSearch.test.ts
│   │   ├── usePagination.test.ts
│   │   └── useSteps.test.ts
│   ├── services/                # Testes dos serviços
│   │   ├── auth.test.ts
│   │   ├── cards.test.ts
│   │   └── trades.test.ts
│   ├── utils/                   # Testes das utilidades
│   │   ├── errorHandler.test.ts
│   │   ├── parseApiError.test.ts
│   │   ├── analytics.test.ts
│   │   └── formatters.test.ts
│   └── schemas/                 # Testes dos schemas Zod
│       ├── login.test.ts
│       ├── register.test.ts
│       ├── cards.test.ts
│       ├── trades.test.ts
│       ├── common.test.ts
│       └── modals.test.ts
├── components/                  # Testes de componentes
│   ├── common/                  # Componentes comuns
│   │   ├── BaseButton.test.ts
│   │   ├── BaseInput.test.ts
│   │   ├── BaseModal.test.ts
│   │   ├── Card.test.ts
│   │   ├── Container.test.ts
│   │   ├── ErrorModal.test.ts
│   │   ├── HamburgerButton.test.ts
│   │   ├── Loading.test.ts
│   │   ├── LoadingSpinner.test.ts
│   │   ├── LoadingOverlay.test.ts
│   │   ├── Logo.test.ts
│   │   ├── NavMenu.test.ts
│   │   ├── Notification.test.ts
│   │   ├── NotificationIcon.test.ts
│   │   ├── PageHeader.test.ts
│   │   ├── Pagination.test.ts
│   │   ├── SearchInput.test.ts
│   │   ├── SearchWithPagination.test.ts
│   │   ├── SimplePagination.test.ts
│   │   ├── StatCard.test.ts
│   │   ├── StatsGrid.test.ts
│   │   ├── UserAvatar.test.ts
│   │   ├── ViewToggle.test.ts
│   │   ├── ErrorBoundary.test.ts
│   │   └── CardPreview.test.ts
│   ├── features/                # Componentes de features
│   │   ├── auth/                # Autenticação
│   │   │   ├── LoginForm.test.ts
│   │   │   └── RegisterForm.test.ts
│   │   ├── cards/               # Gerenciamento de cartas
│   │   │   ├── AddCardModal.test.ts
│   │   │   ├── CardDetailModal.test.ts
│   │   │   ├── CardList.test.ts
│   │   │   ├── CardsEmptyState.test.ts
│   │   │   ├── CardsErrorState.test.ts
│   │   │   ├── CardsFilters.test.ts
│   │   │   ├── CardsHeader.test.ts
│   │   │   ├── CardsNoResults.test.ts
│   │   │   └── CardStats.test.ts
│   │   ├── dashboard/           # Dashboard
│   │   │   ├── DashboardHeader.test.ts
│   │   │   ├── DashboardStats.test.ts
│   │   │   ├── QuickActions.test.ts
│   │   │   └── RecentActivity.test.ts
│   │   └── trades/              # Sistema de trocas
│   │       ├── CardSelector.test.ts
│   │       ├── CreateTradeForm.test.ts
│   │       ├── CreateTradeModal.test.ts
│   │       ├── DeleteConfirmationModal.test.ts
│   │       ├── MyTradeList.test.ts
│   │       ├── TradeActions.test.ts
│   │       ├── TradeCard.test.ts
│   │       ├── TradeFilters.test.ts
│   │       ├── TradeFormHeader.test.ts
│   │       ├── TradeItem.test.ts
│   │       ├── TradeList.test.ts
│   │       ├── TradePreview.test.ts
│   │       ├── TradeStats.test.ts
│   │       ├── TradeStepCardSelection.test.ts
│   │       └── TradePreviewStep.test.ts
│   └── layout/                  # Componentes de layout
│       ├── Header.test.ts
│       ├── MainLayout.test.ts
│       └── Sidebar.test.ts
├── integration/                 # Testes de integração
│   ├── auth-flow.test.ts        # Fluxo completo de autenticação
│   ├── card-management.test.ts  # Fluxo de gerenciamento de cartas
│   ├── trade-creation.test.ts   # Fluxo de criação de trocas
│   └── marketplace.test.ts      # Fluxo do marketplace
└── e2e/                         # Testes end-to-end (opcional)
    ├── auth.e2e.test.ts
    ├── cards.e2e.test.ts
    └── trades.e2e.test.ts
```

## 🧪 Tipos de Teste

### **Unit Tests** (`unit/`)
- Testes isolados de funções, classes e componentes
- Mocks de dependências externas
- Foco em lógica de negócio

### **Component Tests** (`components/`)
- Testes de componentes Vue
- Renderização, props, eventos
- Interações do usuário

### **Integration Tests** (`integration/`)
- Testes de fluxos completos
- Múltiplos componentes trabalhando juntos
- APIs e stores integrados

### **E2E Tests** (`e2e/`)
- Testes de ponta a ponta
- Navegador real
- Cenários completos do usuário

## 🛠️ Convenções

### **Nomenclatura**
- Arquivos: `ComponentName.test.ts` ou `ComponentName.spec.ts`
- Descreva: `describe('ComponentName', () => {})`
- Teste: `it('should do something', () => {})`

### **Organização**
- Um arquivo de teste por componente/função
- Agrupe testes relacionados em `describe` blocks
- Use `beforeEach` para setup comum

### **Mocks**
- Mock APIs externas
- Mock stores quando necessário
- Mock timers para testes assíncronos

## 📊 Cobertura

Execute com: `npm run test:coverage`

**Meta de cobertura:**
- **Statements:** 80%
- **Branches:** 80%
- **Functions:** 80%
- **Lines:** 80%

## 🚀 Execução

```bash
# Todos os testes
npm run test

# Testes em modo watch
npm run test:watch

# Testes com cobertura
npm run test:coverage

# Testes específicos
npm run test -- --run src/tests/unit/stores/auth.test.ts

# Testes de componentes
npm run test -- --run src/tests/components/

# Testes de integração
npm run test -- --run src/tests/integration/
``` 