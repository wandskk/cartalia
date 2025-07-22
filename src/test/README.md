# Testes

Este diretório contém todos os testes da aplicação Cartalia.

## Estrutura

```
src/test/
├── setup.ts              # Configuração global dos testes
├── README.md             # Esta documentação
└── __tests__/            # Testes organizados por módulo
    ├── stores/           # Testes dos stores Pinia
    ├── components/       # Testes dos componentes Vue
    ├── utils/            # Testes dos utilitários
    └── services/         # Testes dos serviços
```

## Tecnologias

- **Vitest** - Framework de testes
- **Vue Test Utils** - Utilitários para testar componentes Vue
- **Testing Library** - Utilitários para testes mais próximos do usuário
- **JSDOM** - Ambiente DOM para testes

## Comandos

```bash
# Executar testes em modo watch
npm run test

# Executar testes uma vez
npm run test:run

# Interface visual dos testes
npm run test:ui

# Cobertura de testes
npm run test:coverage
```

## Convenções

### Nomenclatura
- Arquivos de teste: `*.test.ts` ou `*.spec.ts`
- Diretórios: `__tests__` dentro de cada módulo
- Descrições: Em português, descritivas

### Estrutura dos Testes
```typescript
describe('Nome do Módulo', () => {
  beforeEach(() => {
    // Setup
  })

  describe('Funcionalidade', () => {
    it('deve fazer algo específico', () => {
      // Arrange
      // Act
      // Assert
    })
  })
})
```

### Mocks
- Usar `vi.mock()` para mocks globais
- Usar `vi.fn()` para mocks locais
- Limpar mocks em `beforeEach`

### Testes de Componentes
```typescript
import { mount } from '@vue/test-utils'
import MyComponent from '../MyComponent.vue'

describe('MyComponent', () => {
  it('deve renderizar corretamente', () => {
    const wrapper = mount(MyComponent, {
      props: { /* props */ },
      slots: { /* slots */ }
    })
    
    expect(wrapper.text()).toContain('texto esperado')
  })
})
```

### Testes de Stores
```typescript
import { setActivePinia, createPinia } from 'pinia'
import { useMyStore } from '../myStore'

describe('MyStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('deve ter estado inicial correto', () => {
    const store = useMyStore()
    expect(store.value).toBe(expected)
  })
})
```

## Cobertura

A meta de cobertura é de pelo menos 80% para:
- Stores
- Utilitários
- Componentes principais
- Serviços

## CI/CD

Os testes são executados automaticamente:
- Em cada push para `main` e `develop`
- Em cada Pull Request
- Em múltiplas versões do Node.js (18.x, 20.x)

## Debugging

Para debugar testes:
1. Use `console.log()` ou `debugger`
2. Execute `npm run test:ui` para interface visual
3. Use `--reporter=verbose` para mais detalhes

## Boas Práticas

1. **Teste o comportamento, não a implementação**
2. **Use descrições claras e em português**
3. **Organize testes em grupos lógicos**
4. **Mantenha testes independentes**
5. **Use mocks apropriadamente**
6. **Teste casos de sucesso e erro**
7. **Mantenha testes simples e focados** 