# 🧪 Guia de Teste Completo - Sistema de Módulos

## 🚀 Servidor
**URL:** http://localhost:3002/

## 📋 Checklist de Testes

### ✅ 1. Landing Page Principal
**URL:** `http://localhost:3002/`

**O que testar:**
- [ ] Menu superior mostra: Shop, Class, Work, Social
- [ ] Cada link tem cor diferente no hover
- [ ] Botões "Entrar" e "Começar Grátis" funcionam
- [ ] Hero section está visível e atraente
- [ ] Seção de módulos mostra os 4 cards
- [ ] Seção de recursos está completa
- [ ] Seção de preços mostra 3 planos
- [ ] Seção de depoimentos mostra 3 cards
- [ ] CTA final está visível
- [ ] Rodapé completo com links e redes sociais
- [ ] Responsivo em mobile

---

### ✅ 2. Landing do Shop
**URL:** `http://localhost:3002/#/shop`

**O que testar:**
- [ ] Ícone do Shop (sacola) aparece grande
- [ ] Cor verde (emerald) predomina
- [ ] Título "Shop" está correto
- [ ] 6 recursos listados
- [ ] Menu superior destaca "Shop"
- [ ] Botão "Começar Agora" abre modal
- [ ] Modal de autenticação funciona
- [ ] Navegação para outros módulos funciona

---

### ✅ 3. Landing do Class
**URL:** `http://localhost:3002/#/class`

**O que testar:**
- [ ] Ícone do Class (capelo) aparece grande
- [ ] Cor azul predomina
- [ ] Título "Class" está correto
- [ ] 6 recursos listados
- [ ] Menu superior destaca "Class"
- [ ] Botão "Começar Agora" abre modal
- [ ] Modal de autenticação funciona

---

### ✅ 4. Landing do Work
**URL:** `http://localhost:3002/#/work`

**O que testar:**
- [ ] Ícone do Work (maleta) aparece grande
- [ ] Cor roxa predomina
- [ ] Título "Work" está correto
- [ ] 6 recursos listados
- [ ] Menu superior destaca "Work"
- [ ] Botão "Começar Agora" abre modal
- [ ] Modal de autenticação funciona

---

### ✅ 5. Landing do Social
**URL:** `http://localhost:3002/#/social`

**O que testar:**
- [ ] Ícone do Social (pessoas) aparece grande
- [ ] Cor laranja predomina
- [ ] Título "Social" está correto
- [ ] 6 recursos listados
- [ ] Menu superior destaca "Social"
- [ ] Botão "Começar Agora" abre modal
- [ ] Modal de autenticação funciona

---

### ✅ 6. Modal de Autenticação

**Como testar:**
1. Clicar em "Começar Grátis" em qualquer landing
2. Verificar modal de cadastro

**Cadastro - O que testar:**
- [ ] Campo "Nome Completo" aparece
- [ ] Campo "Telefone" aparece
- [ ] Campo "CPF/CNPJ" aparece
- [ ] Campo "Email" aparece
- [ ] Campo "Senha" aparece
- [ ] Select "Tipo de Conta" aparece (Pessoal/Empresarial)
- [ ] Botão "Criar Conta" está visível
- [ ] Link "Já tem uma conta? Entrar" funciona
- [ ] Botão X fecha o modal
- [ ] Validação de campos obrigatórios funciona

**Login - O que testar:**
- [ ] Apenas campos Email e Senha aparecem
- [ ] Botão "Entrar" está visível
- [ ] Link "Não tem uma conta? Criar conta" funciona
- [ ] Link "Esqueceu sua senha?" aparece

---

### ✅ 7. Fluxo de Cadastro Completo

**Passo a passo:**

1. **Acessar landing do Shop**
   ```
   http://localhost:3002/#/shop
   ```

2. **Clicar em "Começar Grátis"**

3. **Preencher formulário:**
   - Nome: João Silva
   - Telefone: (11) 99999-9999
   - CPF: 123.456.789-00
   - Email: joao.silva@teste.com
   - Senha: senha123456
   - Tipo: Pessoal

4. **Clicar em "Criar Conta"**

5. **Verificar:**
   - [ ] Loading aparece
   - [ ] Redirecionamento para `/onboarding`
   - [ ] Mensagem de boas-vindas com nome do usuário
   - [ ] Módulo "Shop" vem pré-selecionado (check verde)

---

### ✅ 8. Tela de Onboarding
**URL:** `http://localhost:3002/#/onboarding`

**O que testar:**
- [ ] Logo Tymes aparece no topo
- [ ] Badge "Bem-vindo, [Nome]!" aparece
- [ ] Título "Escolha seus módulos" está visível
- [ ] 4 cards de módulos aparecem
- [ ] Clicar em um card adiciona check verde
- [ ] Clicar novamente remove a seleção
- [ ] Card selecionado tem borda azul e escala maior
- [ ] Botão "Continuar" fica habilitado com seleção
- [ ] Contador de módulos selecionados aparece
- [ ] Link "Pular por enquanto" funciona
- [ ] Módulo de origem vem pré-selecionado

**Testar seleção múltipla:**
- [ ] Selecionar Shop
- [ ] Selecionar Class
- [ ] Selecionar Work
- [ ] Selecionar Social
- [ ] Contador mostra "4 módulos selecionados"
- [ ] Desselecionar um módulo
- [ ] Contador atualiza para "3 módulos selecionados"

---

### ✅ 9. Salvar Módulos no Supabase

**Como testar:**

1. **No onboarding, selecionar módulos:**
   - Shop ✓
   - Class ✓

2. **Clicar em "Continuar"**

3. **Verificar no console do navegador:**
   ```
   ✅ Módulos salvos com sucesso: ['shop', 'class']
   ```

4. **Verificar no Supabase:**
   - Abrir Supabase Dashboard
   - Ir em Table Editor > profiles
   - Encontrar o usuário criado
   - Verificar coluna `enabled_modules` = `['shop', 'class']`

---

### ✅ 10. Fluxo de Login

**Passo a passo:**

1. **Fazer logout** (se estiver logado)

2. **Acessar landing do Class**
   ```
   http://localhost:3002/#/class
   ```

3. **Clicar em "Entrar"**

4. **Preencher:**
   - Email: joao.silva@teste.com
   - Senha: senha123456

5. **Clicar em "Entrar"**

6. **Verificar:**
   - [ ] Loading aparece
   - [ ] Redirecionamento direto para `/app`
   - [ ] Não passa pelo onboarding
   - [ ] Plataforma carrega normalmente

---

### ✅ 11. Navegação entre Módulos

**Como testar:**

1. **Estar em:** `http://localhost:3002/#/shop`
2. **Clicar no menu:** Class
3. **Verificar:** URL muda para `/#/class`
4. **Clicar no menu:** Work
5. **Verificar:** URL muda para `/#/work`
6. **Clicar no menu:** Social
7. **Verificar:** URL muda para `/#/social`
8. **Clicar no logo Tymes**
9. **Verificar:** Volta para landing principal `/`

---

### ✅ 12. Responsividade

**Testar em diferentes tamanhos:**

**Desktop (> 1024px):**
- [ ] Menu horizontal visível
- [ ] Cards em grid 2 colunas
- [ ] Espaçamentos adequados

**Tablet (768px - 1024px):**
- [ ] Menu horizontal visível
- [ ] Cards em grid 2 colunas
- [ ] Botões ajustados

**Mobile (< 768px):**
- [ ] Menu hamburguer aparece
- [ ] Menu mobile funciona
- [ ] Cards em 1 coluna
- [ ] Botões full width
- [ ] Modal ocupa tela toda

---

### ✅ 13. Dark Mode

**Como testar:**

1. **Ativar dark mode do sistema**
2. **Recarregar página**
3. **Verificar:**
   - [ ] Fundo escuro
   - [ ] Textos claros
   - [ ] Bordas visíveis
   - [ ] Gradientes mantêm contraste
   - [ ] Cards legíveis
   - [ ] Modal escuro

---

### ✅ 14. Integração Supabase

**Verificar no Supabase Dashboard:**

1. **Authentication > Users**
   - [ ] Usuário criado aparece
   - [ ] Email correto
   - [ ] Status "Confirmed"

2. **Table Editor > profiles**
   - [ ] Registro do usuário existe
   - [ ] Campo `name` preenchido
   - [ ] Campo `email` preenchido
   - [ ] Campo `phone` preenchido
   - [ ] Campo `document` preenchido
   - [ ] Campo `type` = PERSONAL ou BUSINESS
   - [ ] Campo `enabled_modules` = array de módulos
   - [ ] Timestamps preenchidos

---

### ✅ 15. Erros e Validações

**Testar cenários de erro:**

**Cadastro com email existente:**
1. Tentar cadastrar com email já usado
2. Verificar mensagem de erro

**Login com credenciais erradas:**
1. Tentar login com senha errada
2. Verificar mensagem de erro

**Campos obrigatórios:**
1. Tentar enviar formulário vazio
2. Verificar validação HTML5

**Onboarding sem seleção:**
1. Não selecionar nenhum módulo
2. Clicar em "Continuar"
3. Verificar alert "Selecione pelo menos um módulo"

---

## 🎯 Cenários de Teste Completos

### Cenário 1: Novo usuário via Shop
1. Acessar `/#/shop`
2. Cadastrar nova conta
3. Selecionar Shop + Class no onboarding
4. Verificar redirecionamento para `/app`
5. Verificar módulos salvos no Supabase

### Cenário 2: Novo usuário via Class
1. Acessar `/#/class`
2. Cadastrar nova conta
3. Selecionar apenas Class no onboarding
4. Verificar redirecionamento para `/app`

### Cenário 3: Login existente
1. Acessar `/#/work`
2. Fazer login com conta existente
3. Verificar redirecionamento direto para `/app`
4. Não deve passar pelo onboarding

### Cenário 4: Navegação completa
1. Acessar landing principal
2. Navegar por todos os módulos via menu
3. Verificar que cada landing é única
4. Voltar para home clicando no logo

---

## 🐛 Bugs Conhecidos

Nenhum bug conhecido no momento.

---

## 📊 Métricas de Sucesso

- [ ] Todas as rotas funcionam
- [ ] Autenticação Supabase funcional
- [ ] Módulos são salvos corretamente
- [ ] Onboarding funciona perfeitamente
- [ ] Navegação fluida entre páginas
- [ ] Design responsivo em todos os tamanhos
- [ ] Dark mode funciona
- [ ] Sem erros no console

---

## 🎉 Conclusão

Se todos os testes passarem, o sistema está 100% funcional e pronto para uso!

**Próximos passos:**
1. Aplicar migration no Supabase
2. Testar em produção
3. Adicionar analytics
4. Melhorar validações de formulário
