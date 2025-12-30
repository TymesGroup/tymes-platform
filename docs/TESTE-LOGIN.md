# 🧪 Instruções para Testar o Login

## Credenciais de Teste

Use estas credenciais para testar o login:

**Email:** `teste@tymes.com`  
**Senha:** `123456`

## Como Testar

1. Abra o navegador em: http://localhost:3001
2. Clique em "Entrar" ou "Começar"
3. Use as credenciais acima
4. Abra o Console do navegador (Cmd+Option+J no Mac ou F12 no Windows/Linux)
5. Observe os logs no console

## O que Esperar

Você deve ver logs como:
- `SignIn iniciado: teste@tymes.com`
- `Resultado signInWithPassword: { data: {...}, error: null }`
- `Login OK!`
- `🔔 Auth State Change: SIGNED_IN`
- `👤 Buscando perfil para usuário: ...`
- `✅ Perfil encontrado: {...}`
- `🎯 App State: { user: true, profile: true, loading: false, isAuthenticated: true }`

Após o login bem-sucedido, você deve ser **automaticamente redirecionado** para `/app` (o painel).

## ✅ Conta Verificada

A conta foi criada e testada com sucesso:
- ✅ Usuário criado
- ✅ Perfil criado automaticamente pelo trigger
- ✅ Login funcionando
- ✅ Perfil sendo recuperado corretamente

## Se Não Funcionar

Se você ver os logs mas não for redirecionado, me avise quais logs aparecem no console!
