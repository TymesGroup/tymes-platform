# 🎯 Fluxo de Login/Cadastro por Módulo

## Como Funciona

Agora quando o usuário faz login ou cadastro a partir de uma landing específica de módulo, ele é direcionado diretamente para aquele módulo na plataforma.

---

## 📋 Cenários

### Cenário 1: Cadastro via Landing do Shop

**Passo a passo:**
1. Usuário acessa `http://localhost:3002/#/shop`
2. Clica em "Começar Grátis"
3. Preenche formulário de cadastro
4. Clica em "Criar Conta"
5. ✅ É redirecionado para `/onboarding`
6. Módulo **Shop** vem pré-selecionado
7. Seleciona os módulos desejados (pode adicionar mais)
8. Clica em "Continuar"
9. ✅ É redirecionado para `/app` com o módulo **SHOP** aberto automaticamente

**Resultado:** Usuário entra direto na página do Shop

---

### Cenário 2: Login via Landing do Social

**Passo a passo:**
1. Usuário acessa `http://localhost:3002/#/social`
2. Clica em "Entrar"
3. Preenche email e senha
4. Clica em "Entrar"
5. ✅ É redirecionado diretamente para `/app` com o módulo **SOCIAL** aberto

**Resultado:** Usuário entra direto na página do Social (pula onboarding)

---

### Cenário 3: Cadastro via Landing do Class

**Passo a passo:**
1. Usuário acessa `http://localhost:3002/#/class`
2. Clica em "Começar Grátis"
3. Preenche formulário de cadastro
4. Clica em "Criar Conta"
5. ✅ É redirecionado para `/onboarding`
6. Módulo **Class** vem pré-selecionado
7. Adiciona também **Work** e **Social**
8. Clica em "Continuar"
9. ✅ É redirecionado para `/app` com o módulo **CLASS** aberto (módulo de origem)

**Resultado:** Usuário entra direto na página do Class

---

### Cenário 4: Login via Landing do Work

**Passo a passo:**
1. Usuário acessa `http://localhost:3002/#/work`
2. Clica em "Entrar"
3. Preenche email e senha
4. Clica em "Entrar"
5. ✅ É redirecionado diretamente para `/app` com o módulo **WORK** aberto

**Resultado:** Usuário entra direto na página do Work

---

## 🔄 Fluxo Técnico

### Login (Usuário Existente)
```
Landing /shop → Login → /app (state: { openModule: 'SHOP' })
Landing /class → Login → /app (state: { openModule: 'CLASS' })
Landing /work → Login → /app (state: { openModule: 'WORK' })
Landing /social → Login → /app (state: { openModule: 'SOCIAL' })
```

### Cadastro (Novo Usuário)
```
Landing /shop → Cadastro → /onboarding (state: { preferredModule: 'shop' })
                         → Seleciona módulos
                         → /app (state: { openModule: 'SHOP' })

Landing /class → Cadastro → /onboarding (state: { preferredModule: 'class' })
                          → Seleciona módulos
                          → /app (state: { openModule: 'CLASS' })

Landing /work → Cadastro → /onboarding (state: { preferredModule: 'work' })
                         → Seleciona módulos
                         → /app (state: { openModule: 'WORK' })

Landing /social → Cadastro → /onboarding (state: { preferredModule: 'social' })
                           → Seleciona módulos
                           → /app (state: { openModule: 'SOCIAL' })
```

---

## 💻 Implementação Técnica

### 1. ModuleLanding.tsx

```typescript
// No handleSubmit
if (authMode === 'login') {
  // Login: vai direto para /app com módulo específico
  navigate('/app', { state: { openModule: module.toUpperCase() } });
} else {
  // Cadastro: vai para onboarding com módulo preferido
  navigate('/onboarding', { state: { preferredModule: module } });
}
```

### 2. OnboardingView.tsx

```typescript
// No handleContinue
const preferredModule = location.state?.preferredModule;
if (preferredModule && selectedModules.includes(preferredModule)) {
  // Abre o módulo de origem
  navigate('/app', { state: { openModule: preferredModule.toUpperCase() } });
} else {
  // Abre dashboard padrão
  navigate('/app');
}
```

### 3. App.tsx (MainApp)

```typescript
// useEffect para detectar módulo a abrir
useEffect(() => {
  const openModule = location.state?.openModule;
  if (openModule) {
    console.log('🎯 Abrindo módulo específico:', openModule);
    setActiveModule(openModule);
    setActivePage('OVERVIEW');
    // Limpar state
    window.history.replaceState({}, document.title);
  }
}, [location.state]);
```

---

## 🧪 Como Testar

### Teste 1: Login via Shop
1. Acesse `http://localhost:3002/#/shop`
2. Clique em "Entrar"
3. Use credenciais existentes
4. Verifique que abre direto no módulo Shop

### Teste 2: Cadastro via Class
1. Acesse `http://localhost:3002/#/class`
2. Clique em "Começar Grátis"
3. Crie nova conta
4. No onboarding, Class deve estar pré-selecionado
5. Adicione outros módulos se quiser
6. Clique em "Continuar"
7. Verifique que abre direto no módulo Class

### Teste 3: Login via Social
1. Acesse `http://localhost:3002/#/social`
2. Clique em "Entrar"
3. Use credenciais existentes
4. Verifique que abre direto no módulo Social

### Teste 4: Cadastro via Work
1. Acesse `http://localhost:3002/#/work`
2. Clique em "Começar Grátis"
3. Crie nova conta
4. No onboarding, Work deve estar pré-selecionado
5. Clique em "Continuar"
6. Verifique que abre direto no módulo Work

---

## 📊 Mapeamento de Módulos

| Landing Page | Módulo ID | Módulo Aberto na Plataforma |
|--------------|-----------|----------------------------|
| `/shop`      | `shop`    | `SHOP`                     |
| `/class`     | `class`   | `CLASS`                    |
| `/work`      | `work`    | `WORK`                     |
| `/social`    | `social`  | `SOCIAL`                   |

---

## 🎯 Benefícios

1. **Experiência Focada**: Usuário vai direto para o que interessa
2. **Menos Cliques**: Não precisa navegar após login
3. **Contexto Mantido**: Landing → Login → Módulo (fluxo natural)
4. **Conversão Melhor**: Usuário vê imediatamente o módulo que escolheu
5. **Onboarding Inteligente**: Módulo de origem já vem selecionado

---

## 🔍 Logs para Debug

No console do navegador você verá:

```
🎯 Abrindo módulo específico: SHOP
✅ Módulos salvos com sucesso: ['shop', 'class']
```

---

## ✅ Status

✅ Login via landing específica abre módulo correto
✅ Cadastro via landing específica pré-seleciona módulo
✅ Onboarding redireciona para módulo de origem
✅ State é limpo após uso (não reabre sempre)
✅ Funciona para todos os 4 módulos

**Servidor:** http://localhost:3002/
