# Módulo Shop (Marketplace)

## Visão Geral

O módulo Shop é um marketplace completo que permite a compra e venda de produtos e serviços dentro da plataforma. Implementa regras de negócio específicas para diferentes tipos de conta.

## Regras de Negócio

### Contas Pessoais (PERSONAL)
- ✅ Podem **visualizar** produtos e serviços
- ✅ Podem **comprar** produtos e serviços
- ✅ Podem **favoritar** produtos
- ✅ Podem **acompanhar pedidos**
- ❌ **NÃO podem criar** produtos ou serviços
- ❌ **NÃO têm acesso** ao inventário de produtos

### Contas Business (BUSINESS)
- ✅ Podem **criar** produtos e serviços
- ✅ Podem **editar** seus produtos
- ✅ Podem **excluir** seus produtos
- ✅ Podem **gerenciar inventário**
- ✅ Podem **visualizar vendas**
- ✅ Também podem **comprar** como consumidores

## Estrutura de Páginas

### 1. OVERVIEW (Visão Geral)
- **Componente**: `ShopStats`
- **Descrição**: Dashboard com estatísticas e métricas
- **Contas PERSONAL**: Mostra gastos, pedidos e histórico de compras
- **Contas BUSINESS**: Mostra vendas, receita e desempenho

### 2. VITRINE (Marketplace)
- **Componente**: `ShopMarketplace`
- **Descrição**: Catálogo de produtos disponíveis
- **Funcionalidades**:
  - Busca de produtos
  - Filtro por categoria
  - Adicionar ao carrinho
  - Visualizar detalhes
- **Acesso**: Todos os tipos de conta

### 3. INVENTORY (Meus Produtos)
- **Componente**: `ShopInventory`
- **Descrição**: Gerenciamento de produtos próprios
- **Funcionalidades**:
  - Listar produtos criados
  - Editar produtos
  - Excluir produtos
  - Criar novo produto
- **Acesso**: **Apenas contas BUSINESS**

### 4. CREATE_PRODUCT (Criar Produto)
- **Componente**: `ShopCreateProduct`
- **Descrição**: Formulário de criação de produtos
- **Campos**:
  - Nome do produto *
  - Categoria *
  - Descrição
  - Preço *
  - Estoque
  - Imagem (URL)
- **Acesso**: **Apenas contas BUSINESS**

### 5. ORDERS (Pedidos)
- **Componente**: `ShopOrders`
- **Descrição**: Gerenciamento de pedidos
- **Contas PERSONAL**: Visualiza apenas compras
- **Contas BUSINESS**: Pode alternar entre vendas e compras

### 6. FAVORITES (Favoritos)
- **Componente**: `ShopFavorites`
- **Descrição**: Lista de produtos favoritos
- **Acesso**: Todos os tipos de conta

### 7. OFFERS (Ofertas)
- **Componente**: `ShopOffers`
- **Descrição**: Produtos em promoção
- **Acesso**: Todos os tipos de conta

### 8. SETTINGS (Configurações)
- **Componente**: `ModuleSettings`
- **Descrição**: Configurações do módulo
- **Acesso**: Todos os tipos de conta

## Componentes Principais

### ProductCard
Card de produto com diferentes comportamentos:
- **Para consumidores**: Botão de adicionar ao carrinho e favoritar
- **Para proprietários**: Botões de editar e excluir

### ShopMarketplace
Vitrine principal com:
- Sistema de busca
- Filtros por categoria
- Grid responsivo de produtos
- Integração com Supabase

### ShopInventory
Gerenciamento de produtos para contas BUSINESS:
- Lista de produtos próprios
- Ações de edição e exclusão
- Botão para criar novo produto

### ShopCreateProduct
Formulário completo de criação:
- Validação de campos obrigatórios
- Preview de imagem
- Integração com Supabase
- Estados de loading

## Integração com Supabase

### Tabela: products
```sql
- id: uuid (PK)
- name: text
- price: numeric
- category: text
- image: text (nullable)
- created_by: uuid (FK -> profiles.id)
- created_at: timestamp
```

### Operações Implementadas
- ✅ Listar todos os produtos
- ✅ Listar produtos por usuário
- ✅ Criar produto
- ✅ Excluir produto
- 🔄 Editar produto (preparado para implementação)

## Navegação

O módulo usa o sistema de navegação interno:
```typescript
onNavigate?.('PAGE_NAME')
```

Páginas disponíveis:
- `OVERVIEW`
- `VITRINE`
- `INVENTORY` (apenas BUSINESS)
- `CREATE_PRODUCT` (apenas BUSINESS)
- `ORDERS`
- `FAVORITES`
- `OFFERS`
- `SETTINGS`

## Controle de Acesso

O controle de acesso é implementado em dois níveis:

### 1. Nível de Menu (navigation.ts)
```typescript
{ 
  id: 'INVENTORY', 
  label: 'Meus Produtos', 
  icon: Package, 
  allowedProfiles: [ProfileType.BUSINESS] 
}
```

### 2. Nível de Componente (index.tsx)
```typescript
if (!isBusiness) {
  return <ShopMarketplace profile={profile} userId={user?.id} onNavigate={onNavigate} />;
}
```

## Próximas Implementações

### Funcionalidades Pendentes
- [ ] Sistema de carrinho de compras
- [ ] Checkout e pagamento
- [ ] Sistema de favoritos com persistência
- [ ] Edição de produtos
- [ ] Upload de imagens para Supabase Storage
- [ ] Sistema de avaliações e comentários
- [ ] Filtros avançados (preço, ordenação)
- [ ] Paginação de produtos
- [ ] Notificações de vendas
- [ ] Relatórios de vendas

### Melhorias Sugeridas
- [ ] Adicionar campo de descrição na tabela products
- [ ] Implementar tabela de orders
- [ ] Implementar tabela de favorites
- [ ] Adicionar campo de estoque na tabela products
- [ ] Sistema de categorias dinâmicas
- [ ] Imagens múltiplas por produto
- [ ] Sistema de cupons de desconto

## Uso

```typescript
import { ShopModule } from './modules/shop';

<ShopModule 
  page="VITRINE" 
  profile={ProfileType.BUSINESS}
  onNavigate={(page) => console.log('Navigate to:', page)}
/>
```

## Observações

1. **Segurança**: Todas as operações de criação/edição/exclusão verificam o `userId` para garantir que apenas o proprietário possa modificar seus produtos.

2. **UX**: Contas PERSONAL que tentam acessar páginas restritas são automaticamente redirecionadas para o marketplace.

3. **Performance**: Os componentes usam loading states e tratamento de erros adequados.

4. **Responsividade**: Todos os componentes são totalmente responsivos e funcionam em mobile, tablet e desktop.
