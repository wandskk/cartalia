# 🧩 Guia de Componentes

Este documento descreve todos os componentes Vue utilizados no projeto Cartalia, incluindo suas props, eventos e exemplos de uso.

## 📋 Índice

- [🎯 Visão Geral](#-visão-geral)
- [📁 Estrutura de Componentes](#-estrutura-de-componentes)
- [🔧 Componentes Base](#-componentes-base)
- [🎨 Componentes de Features](#-componentes-de-features)
- [🏗️ Componentes de Layout](#️-componentes-de-layout)
- [📝 Convenções](#-convenções)
- [🧪 Testes](#-testes)

## 🎯 Visão Geral

O projeto Cartalia utiliza uma arquitetura baseada em componentes Vue 3 com Composition API. Os componentes são organizados em três categorias principais:

- **Base**: Componentes reutilizáveis e genéricos
- **Features**: Componentes específicos de funcionalidades
- **Layout**: Componentes de estrutura da aplicação

### 🎨 Stack de Componentes

```
Vue 3 (Composition API)
├── TypeScript
├── SASS/SCSS
├── Props Validation (Zod)
├── Event Emitting
└── Scoped Styles
```

## 📁 Estrutura de Componentes

```
src/components/
├── common/              # Componentes base reutilizáveis
│   ├── BaseButton.vue
│   ├── BaseInput.vue
│   ├── ErrorModal.vue
│   └── UserAvatar.vue
├── features/            # Componentes específicos
│   ├── auth/           # Autenticação
│   │   ├── LoginForm.vue
│   │   └── RegisterForm.vue
│   ├── cards/          # Gerenciamento de cartas
│   │   ├── CardList.vue
│   │   ├── CardItem.vue
│   │   ├── CardDetail.vue
│   │   └── AddCardForm.vue
│   ├── dashboard/      # Dashboard
│   │   ├── DashboardStats.vue
│   │   ├── QuickActions.vue
│   │   └── RecentActivity.vue
│   └── trades/         # Sistema de trocas
│       ├── TradeList.vue
│       ├── TradeItem.vue
│       ├── CreateTradeForm.vue
│       └── CardSelector.vue
└── layout/             # Componentes de layout
    ├── Header.vue
    ├── Footer.vue
    └── Container.vue
```

## 🔧 Componentes Base

### BaseButton

Componente de botão reutilizável com diferentes variantes e estados.

#### 📝 Props

```typescript
interface Props {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'error' | 'warning' | 'info';
}
```

#### 🎯 Eventos

```typescript
interface Emits {
  click: [event: MouseEvent];
}
```

#### 📝 Exemplo de Uso

```vue
<template>
  <BaseButton 
    color="primary" 
    :loading="isLoading"
    @click="handleSubmit"
  >
    Salvar
  </BaseButton>
</template>

<script setup lang="ts">
import BaseButton from '@/components/common/BaseButton.vue';

const isLoading = ref(false);

const handleSubmit = () => {
  isLoading.value = true;
  // Lógica de submit
};
</script>
```

#### 🎨 Variantes de Cor

| Cor | Descrição | Uso |
|-----|-----------|-----|
| `primary` | Azul principal | Ações principais |
| `secondary` | Cinza | Ações secundárias |
| `accent` | Destaque | Ações especiais |
| `success` | Verde | Confirmações |
| `error` | Vermelho | Exclusões/erros |
| `warning` | Amarelo | Avisos |
| `info` | Azul claro | Informações |

### BaseInput

Componente de input reutilizável com validação integrada.

#### 📝 Props

```typescript
interface Props {
  modelValue: string;
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}
```

#### 🎯 Eventos

```typescript
interface Emits {
  'update:modelValue': [value: string];
  'blur': [event: FocusEvent];
  'focus': [event: FocusEvent];
}
```

#### 📝 Exemplo de Uso

```vue
<template>
  <BaseInput
    v-model="email"
    type="email"
    label="Email"
    placeholder="Digite seu email"
    :error="emailError"
    required
  />
</template>

<script setup lang="ts">
import BaseInput from '@/components/common/BaseInput.vue';

const email = ref('');
const emailError = ref('');
</script>
```

### ErrorModal

Modal para exibição de erros globais da aplicação.

#### 📝 Props

```typescript
interface Props {
  isOpen: boolean;
}
```

#### 🎯 Eventos

```typescript
interface Emits {
  close: [];
  retry: [];
  'go-to-login': [];
}
```

#### 📝 Exemplo de Uso

```vue
<template>
  <ErrorModal 
    :is-open="errorStore.isErrorModalOpen"
    @close="errorStore.closeErrorModal"
    @retry="handleRetry"
  />
</template>

<script setup lang="ts">
import ErrorModal from '@/components/common/ErrorModal.vue';
import { useErrorStore } from '@/stores/error';

const errorStore = useErrorStore();

const handleRetry = () => {
  // Lógica de retry
};
</script>
```

### UserAvatar

Componente para exibição de avatar do usuário.

#### 📝 Props

```typescript
interface Props {
  src: string;
  alt?: string;
  size?: 'small' | 'medium' | 'large';
}
```

#### 📝 Exemplo de Uso

```vue
<template>
  <UserAvatar 
    :src="user.avatar" 
    :alt="user.name"
    size="medium"
  />
</template>

<script setup lang="ts">
import UserAvatar from '@/components/common/UserAvatar.vue';
</script>
```

## 🎨 Componentes de Features

### Auth Components

#### LoginForm

Formulário de login com validação.

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <BaseInput
      v-model="form.email"
      type="email"
      label="Email"
      :error="errors.email"
      required
    />
    <BaseInput
      v-model="form.password"
      type="password"
      label="Senha"
      :error="errors.password"
      required
    />
    <BaseButton 
      type="submit" 
      :loading="loading"
      color="primary"
    >
      Entrar
    </BaseButton>
  </form>
</template>

<script setup lang="ts">
import { useAuthForm } from '@/composables/useAuthForm';

const { form, errors, loading, handleSubmit } = useAuthForm('login');
</script>
```

#### RegisterForm

Formulário de registro com validação.

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <BaseInput
      v-model="form.name"
      label="Nome"
      :error="errors.name"
      required
    />
    <BaseInput
      v-model="form.email"
      type="email"
      label="Email"
      :error="errors.email"
      required
    />
    <BaseInput
      v-model="form.password"
      type="password"
      label="Senha"
      :error="errors.password"
      required
    />
    <BaseButton 
      type="submit" 
      :loading="loading"
      color="primary"
    >
      Cadastrar
    </BaseButton>
  </form>
</template>

<script setup lang="ts">
import { useAuthForm } from '@/composables/useAuthForm';

const { form, errors, loading, handleSubmit } = useAuthForm('register');
</script>
```

### Cards Components

#### CardList

Lista de cartas com paginação.

#### 📝 Props

```typescript
interface Props {
  cards: Card[];
  loading?: boolean;
  error?: string | null;
  hasMore?: boolean;
}
```

#### 🎯 Eventos

```typescript
interface Emits {
  'load-more': [];
  'card-click': [card: Card];
}
```

#### 📝 Exemplo de Uso

```vue
<template>
  <CardList
    :cards="cards"
    :loading="loading"
    :error="error"
    :has-more="hasMore"
    @load-more="loadMoreCards"
    @card-click="handleCardClick"
  />
</template>

<script setup lang="ts">
import CardList from '@/components/features/cards/CardList.vue';

const cards = ref<Card[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const hasMore = ref(false);

const loadMoreCards = async () => {
  // Lógica para carregar mais cartas
};

const handleCardClick = (card: Card) => {
  router.push(`/cards/${card.id}`);
};
</script>
```

#### CardItem

Item individual de carta.

#### 📝 Props

```typescript
interface Props {
  card: Card;
  selectable?: boolean;
  selected?: boolean;
}
```

#### 🎯 Eventos

```typescript
interface Emits {
  click: [card: Card];
  select: [card: Card, selected: boolean];
}
```

#### 📝 Exemplo de Uso

```vue
<template>
  <CardItem
    :card="card"
    :selectable="true"
    :selected="isSelected"
    @click="handleClick"
    @select="handleSelect"
  />
</template>

<script setup lang="ts">
import CardItem from '@/components/features/cards/CardItem.vue';

const isSelected = ref(false);

const handleClick = (card: Card) => {
  // Navegar para detalhes da carta
};

const handleSelect = (card: Card, selected: boolean) => {
  isSelected.value = selected;
};
</script>
```

### Dashboard Components

#### DashboardStats

Estatísticas do dashboard.

#### 📝 Props

```typescript
interface Props {
  stats: {
    totalCards: number;
    totalTrades: number;
    activeTrades: number;
  };
}
```

#### 📝 Exemplo de Uso

```vue
<template>
  <DashboardStats :stats="stats" />
</template>

<script setup lang="ts">
import DashboardStats from '@/components/features/dashboard/DashboardStats.vue';

const stats = ref({
  totalCards: 0,
  totalTrades: 0,
  activeTrades: 0
});
</script>
```

#### QuickActions

Ações rápidas do dashboard.

#### 📝 Exemplo de Uso

```vue
<template>
  <QuickActions />
</template>

<script setup lang="ts">
import QuickActions from '@/components/features/dashboard/QuickActions.vue';
</script>
```

#### RecentActivity

Atividades recentes do usuário.

#### 📝 Props

```typescript
interface Props {
  activities: Activity[];
  loading?: boolean;
}
```

#### 📝 Exemplo de Uso

```vue
<template>
  <RecentActivity 
    :activities="activities" 
    :loading="loading" 
  />
</template>

<script setup lang="ts">
import RecentActivity from '@/components/features/dashboard/RecentActivity.vue';

const activities = ref<Activity[]>([]);
const loading = ref(false);
</script>
```

### Trades Components

#### TradeList

Lista de trocas disponíveis.

#### 📝 Props

```typescript
interface Props {
  trades: Trade[];
  loading?: boolean;
  error?: string | null;
  showUserTrades?: boolean;
}
```

#### 🎯 Eventos

```typescript
interface Emits {
  'trade-click': [trade: Trade];
  'delete-trade': [tradeId: string];
}
```

#### 📝 Exemplo de Uso

```vue
<template>
  <TradeList
    :trades="trades"
    :loading="loading"
    :error="error"
    :show-user-trades="true"
    @trade-click="handleTradeClick"
    @delete-trade="handleDeleteTrade"
  />
</template>

<script setup lang="ts">
import TradeList from '@/components/features/trades/TradeList.vue';

const trades = ref<Trade[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const handleTradeClick = (trade: Trade) => {
  // Ver detalhes da troca
};

const handleDeleteTrade = async (tradeId: string) => {
  // Deletar troca
};
</script>
```

#### CreateTradeForm

Formulário para criar nova troca.

#### 📝 Exemplo de Uso

```vue
<template>
  <CreateTradeForm @trade-created="handleTradeCreated" />
</template>

<script setup lang="ts">
import CreateTradeForm from '@/components/features/trades/CreateTradeForm.vue';

const handleTradeCreated = (tradeId: string) => {
  notification.show('Troca criada com sucesso!', 'success');
  router.push('/my-trades');
};
</script>
```

#### CardSelector

Seletor de cartas para trocas.

#### 📝 Props

```typescript
interface Props {
  userCards: Card[];
  availableCards: Card[];
  selectedOffering: string[];
  selectedReceiving: string[];
}
```

#### 🎯 Eventos

```typescript
interface Emits {
  'update:selectedOffering': [cards: string[]];
  'update:selectedReceiving': [cards: string[]];
}
```

#### 📝 Exemplo de Uso

```vue
<template>
  <CardSelector
    :user-cards="userCards"
    :available-cards="availableCards"
    v-model:selected-offering="selectedOffering"
    v-model:selected-receiving="selectedReceiving"
  />
</template>

<script setup lang="ts">
import CardSelector from '@/components/features/trades/CardSelector.vue';

const userCards = ref<Card[]>([]);
const availableCards = ref<Card[]>([]);
const selectedOffering = ref<string[]>([]);
const selectedReceiving = ref<string[]>([]);
</script>
```

## 🏗️ Componentes de Layout

### Header

Cabeçalho da aplicação com navegação.

#### 📝 Exemplo de Uso

```vue
<template>
  <Header />
</template>

<script setup lang="ts">
import Header from '@/components/layout/Header.vue';
</script>
```

### Footer

Rodapé da aplicação.

#### 📝 Exemplo de Uso

```vue
<template>
  <Footer />
</template>

<script setup lang="ts">
import Footer from '@/components/layout/Footer.vue';
</script>
```

### Container

Container responsivo para conteúdo.

#### 📝 Props

```typescript
interface Props {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  padding?: boolean;
}
```

#### 📝 Exemplo de Uso

```vue
<template>
  <Container max-width="lg" :padding="true">
    <h1>Conteúdo da página</h1>
  </Container>
</template>

<script setup lang="ts">
import Container from '@/components/layout/Container.vue';
</script>
```

## 📝 Convenções

### 🎯 Nomenclatura

- **Componentes**: PascalCase (`BaseButton.vue`)
- **Props**: camelCase (`isLoading`, `userData`)
- **Eventos**: kebab-case (`@card-click`, `@update:model-value`)
- **Slots**: kebab-case (`<slot name="header">`)

### 📁 Organização de Arquivos

```
ComponentName.vue
├── <template>     # Template primeiro
├── <script setup> # Script com setup
└── <style scoped> # Estilos por último
```

### 🔧 Estrutura de Script

```vue
<script setup lang="ts">
// 1. Imports externos
import { ref, computed } from 'vue';

// 2. Imports internos
import BaseButton from '../common/BaseButton.vue';

// 3. Types e interfaces
interface Props {
  title: string;
  loading?: boolean;
}

// 4. Props e emits
const props = defineProps<Props>();
const emit = defineEmits<{
  submit: [data: any];
}>();

// 5. Composables
const router = useRouter();

// 6. Refs e reactive
const formData = ref({});

// 7. Computed
const isValid = computed(() => {
  // ...
});

// 8. Methods
function handleSubmit() {
  // ...
}

// 9. Lifecycle hooks
onMounted(() => {
  // ...
});
</script>
```

### 🎨 Estilos

```vue
<style scoped lang="scss">
@use '../../styles/_variables.scss' as *;

.component-name {
  // Estilos do componente
}

// Estados
.component-name--loading {
  // Estado de loading
}

// Responsividade
@media (max-width: $breakpoint-md) {
  .component-name {
    // Estilos mobile
  }
}
</style>
```

## 🧪 Testes

### 📝 Estrutura de Testes

```
src/components/
├── __tests__/           # Testes dos componentes
│   ├── common/         # Testes dos componentes base
│   ├── features/       # Testes dos componentes de features
│   └── layout/         # Testes dos componentes de layout
```

### 🔧 Exemplo de Teste

```typescript
// src/components/common/__tests__/BaseButton.test.ts
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import BaseButton from '../BaseButton.vue';

describe('BaseButton', () => {
  it('renders correctly', () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: 'Click me'
      }
    });

    expect(wrapper.text()).toContain('Click me');
    expect(wrapper.find('button').exists()).toBe(true);
  });

  it('emits click event', async () => {
    const wrapper = mount(BaseButton);
    
    await wrapper.find('button').trigger('click');
    
    expect(wrapper.emitted('click')).toBeTruthy();
  });

  it('applies correct classes based on props', () => {
    const wrapper = mount(BaseButton, {
      props: {
        color: 'primary',
        loading: true
      }
    });

    expect(wrapper.classes()).toContain('primary');
    expect(wrapper.classes()).toContain('loading');
  });
});
```

### 🎯 Cobertura de Testes

- ✅ **Props**: Validação de props
- ✅ **Events**: Emissão de eventos
- ✅ **Slots**: Renderização de slots
- ✅ **Classes**: Aplicação de classes CSS
- ✅ **States**: Estados do componente
- ✅ **User Interactions**: Interações do usuário

---

## 📚 Referências

- [Vue 3 Components](https://vuejs.org/guide/essentials/component-basics.html)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Vue Style Guide](https://vuejs.org/style-guide/)
- [TypeScript with Vue](https://vuejs.org/guide/typescript/overview.html) 