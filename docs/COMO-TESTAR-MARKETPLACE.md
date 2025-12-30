# 🧪 Como Testar o Marketplace Vitrine

## 🚀 Início Rápido

### 1. Acesse a Página
```
1. Faça login na plataforma Tymes
2. Navegue para: Shop > Vitrine
3. A página carregará automaticamente
```

---

## ✅ Checklist de Testes

### 🎪 Hero Banner Carousel
- [ ] Banner está visível
- [ ] Rotação automática funciona (5 segundos)
- [ ] 3 slides diferentes aparecem
- [ ] Indicadores de navegação funcionam
- [ ] Badge de tempo está visível
- [ ] Botão "Ver Ofertas" tem hover effect
- [ ] Ícone decorativo aparece no desktop
- [ ] Gradientes estão corretos

### 🔍 Barra de Busca
- [ ] Campo de busca está destacado
- [ ] Placeholder está correto
- [ ] Trending searches aparecem abaixo
- [ ] Clicar em trending search preenche o campo
- [ ] Busca em tempo real funciona
- [ ] Ícone de lupa está visível

### ⚡ Quick Actions
- [ ] 6 cards aparecem
- [ ] Ícones estão coloridos
- [ ] Hover effect funciona (scale)
- [ ] Textos estão corretos
- [ ] Layout responsivo (2-3-6 colunas)

### 🔥 Daily Deals
- [ ] Seção está visível
- [ ] Countdown timer funciona
- [ ] Timer atualiza a cada segundo
- [ ] 3 produtos aparecem
- [ ] Badges de desconto (-50%, -33%)
- [ ] Progress bars animadas
- [ ] Porcentagem de vendas correta
- [ ] Gradiente laranja/vermelho
- [ ] Botão "Ver Todas" funciona

### ✨ Produtos Recomendados
- [ ] 4 produtos aparecem
- [ ] Badges (Mais Vendido, Novo, Popular)
- [ ] Preços com desconto riscado
- [ ] Imagens carregam
- [ ] Hover effect funciona
- [ ] Botão "Ver mais" visível

### 🏆 Lojas em Destaque
- [ ] 4 lojas aparecem
- [ ] Avatares com gradientes
- [ ] Badges de status (Top Seller, etc)
- [ ] Avaliações com estrelas
- [ ] Número de vendas visível
- [ ] Ícone de loja centralizado
- [ ] Hover effect funciona

### 🎯 Categorias em Destaque
- [ ] 4 categorias aparecem
- [ ] Emojis visíveis
- [ ] Gradientes únicos
- [ ] Contador de produtos
- [ ] Hover scale funciona
- [ ] Ring indicator quando selecionado
- [ ] Clicar filtra produtos

### 🎚️ Filtros Rápidos
- [ ] Chips aparecem horizontalmente
- [ ] "Todos" está ativo por padrão
- [ ] Ícones nos filtros
- [ ] Hover effect funciona
- [ ] Clicar muda o filtro ativo
- [ ] Scroll horizontal em mobile

### 📦 Grid de Produtos
- [ ] Produtos do Supabase carregam
- [ ] Layout responsivo (1-2-3-4 colunas)
- [ ] Contador de resultados correto
- [ ] ProductCard com hover effects
- [ ] Botão de adicionar ao carrinho
- [ ] Filtros funcionam
- [ ] Busca filtra produtos

### 🛒 Carrinho Flutuante
- [ ] Ícone aparece no header
- [ ] Badge de contador funciona
- [ ] Número aumenta ao adicionar
- [ ] Hover effect funciona

### 💼 CTA Banner (Business)
- [ ] Aparece apenas para contas Business
- [ ] Gradiente índigo/roxo/rosa
- [ ] Texto persuasivo
- [ ] Botão "Começar a Vender"
- [ ] Navega para criar produto

---

## 🎨 Testes Visuais

### Dark Mode
```
1. Ative o dark mode
2. Verifique se todos os componentes adaptam
3. Verifique contraste de texto
4. Verifique bordas e backgrounds
5. Verifique gradientes
```

### Responsividade

#### Mobile (< 768px)
```
1. Abra DevTools
2. Selecione iPhone 12 Pro
3. Verifique:
   - Hero banner altura reduzida
   - Categorias em 2 colunas
   - Quick Actions em 2 colunas
   - Produtos em 1 coluna
   - Scroll horizontal funciona
   - Busca full width
```

#### Tablet (768px - 1024px)
```
1. Selecione iPad
2. Verifique:
   - Categorias em 4 colunas
   - Quick Actions em 3 colunas
   - Produtos em 2 colunas
   - Layout equilibrado
```

#### Desktop (> 1024px)
```
1. Tela cheia
2. Verifique:
   - Ícone decorativo no banner
   - Quick Actions em 6 colunas
   - Produtos em 3-4 colunas
   - Espaçamento adequado
```

---

## ⚡ Testes de Performance

### Carregamento
```
1. Abra Network tab
2. Recarregue a página
3. Verifique:
   - Tempo de carregamento < 2s
   - Imagens otimizadas
   - Sem erros no console
```

### Animações
```
1. Abra Performance tab
2. Grave interações
3. Verifique:
   - FPS constante (60fps)
   - Sem jank
   - Transições suaves
```

---

## 🔄 Testes de Interação

### Busca
```
1. Digite "React" no campo de busca
2. Verifique se produtos filtram em tempo real
3. Limpe o campo
4. Clique em um trending search
5. Verifique se o campo é preenchido
```

### Filtros
```
1. Clique em "Digital"
2. Verifique se apenas produtos digitais aparecem
3. Clique em "Todos"
4. Verifique se todos os produtos voltam
5. Teste outros filtros
```

### Carrinho
```
1. Clique em "Adicionar ao carrinho" em um produto
2. Verifique se o contador aumenta
3. Adicione mais produtos
4. Verifique se o número está correto
```

### Carousel
```
1. Aguarde 5 segundos
2. Verifique se o banner muda
3. Clique nos indicadores
4. Verifique se muda manualmente
```

### Countdown
```
1. Observe o countdown timer
2. Verifique se atualiza a cada segundo
3. Verifique formato (HH:MM:SS)
4. Verifique se os números estão corretos
```

---

## 🐛 Testes de Edge Cases

### Sem Produtos
```
1. Busque por "xyzabc123"
2. Verifique se empty state aparece
3. Verifique mensagem de ajuda
```

### Muitos Produtos
```
1. Adicione 20+ produtos ao carrinho
2. Verifique se o contador funciona
3. Verifique se não quebra o layout
```

### Imagens Quebradas
```
1. Produto sem imagem
2. Verifique se fallback funciona
3. Verifique se não quebra o card
```

### Textos Longos
```
1. Produto com nome muito longo
2. Verifique se line-clamp funciona
3. Verifique se não quebra o layout
```

---

## 🎯 Testes por Tipo de Conta

### Conta PERSONAL
```
1. Login como PERSONAL
2. Verifique:
   - ✅ Vê todos os produtos
   - ✅ Pode buscar e filtrar
   - ✅ Pode adicionar ao carrinho
   - ❌ NÃO vê botão "Minha Loja"
   - ❌ NÃO vê CTA Banner de venda
```

### Conta BUSINESS
```
1. Login como BUSINESS
2. Verifique:
   - ✅ Vê todos os produtos
   - ✅ Pode buscar e filtrar
   - ✅ Pode adicionar ao carrinho
   - ✅ VÊ botão "Minha Loja"
   - ✅ VÊ CTA Banner de venda
   - ✅ Pode clicar em "Começar a Vender"
```

---

## 📊 Métricas de Sucesso

### Performance
- [ ] Carregamento < 2 segundos
- [ ] FPS constante em 60
- [ ] Sem erros no console
- [ ] Imagens otimizadas

### UX
- [ ] Navegação intuitiva
- [ ] Feedback visual imediato
- [ ] Hierarquia clara
- [ ] CTAs evidentes

### Funcionalidade
- [ ] Busca funciona
- [ ] Filtros funcionam
- [ ] Carrinho funciona
- [ ] Carousel funciona
- [ ] Countdown funciona
- [ ] Navegação funciona

---

## 🔍 Checklist Final

### Antes de Aprovar
- [ ] Todos os componentes aparecem
- [ ] Todas as animações funcionam
- [ ] Responsividade perfeita
- [ ] Dark mode funciona
- [ ] Sem erros no console
- [ ] Performance adequada
- [ ] Integração Supabase OK
- [ ] Controle de acesso OK
- [ ] Textos corretos
- [ ] Imagens carregam

---

## 🎉 Resultado Esperado

Ao final dos testes, você deve ter:

✅ Marketplace completo e funcional
✅ Todas as seções visíveis
✅ Todas as interações funcionando
✅ Performance otimizada
✅ Responsividade perfeita
✅ Dark mode impecável
✅ Controle de acesso correto

**Se todos os testes passarem, o marketplace está pronto para produção!** 🚀

---

## 📝 Reportar Problemas

Se encontrar algum problema:

1. Anote o tipo de conta (PERSONAL/BUSINESS)
2. Anote o dispositivo (Mobile/Tablet/Desktop)
3. Anote o navegador
4. Tire screenshot
5. Descreva os passos para reproduzir
6. Verifique o console para erros

---

## 🆘 Troubleshooting

### Produtos não carregam
```
1. Verifique conexão com Supabase
2. Verifique console para erros
3. Verifique se há produtos no banco
```

### Countdown não atualiza
```
1. Verifique console para erros
2. Recarregue a página
3. Verifique se useEffect está funcionando
```

### Carousel não roda
```
1. Verifique console para erros
2. Verifique se interval está ativo
3. Recarregue a página
```

### Imagens não carregam
```
1. Verifique URLs das imagens
2. Verifique CORS
3. Verifique fallback
```

---

## 🎓 Dicas de Teste

1. **Teste em múltiplos navegadores** (Chrome, Firefox, Safari)
2. **Teste em dispositivos reais** quando possível
3. **Teste com conexão lenta** (throttling)
4. **Teste com dark mode** ativado e desativado
5. **Teste com zoom** (100%, 125%, 150%)
6. **Teste com leitor de tela** (acessibilidade)

---

Bons testes! 🧪✨
