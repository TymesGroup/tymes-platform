# 🔧 Como Aplicar a Migration no Supabase

## Opção 1: Via Supabase Dashboard (Recomendado)

### Passo a passo:

1. **Acessar Supabase Dashboard**
   ```
   https://supabase.com/dashboard
   ```

2. **Selecionar seu projeto**
   - Projeto: yaifhbwqoihxokatmtec

3. **Ir para SQL Editor**
   - Menu lateral > SQL Editor
   - Ou: https://supabase.com/dashboard/project/yaifhbwqoihxokatmtec/sql

4. **Criar nova query**
   - Clicar em "+ New query"

5. **Copiar e colar o SQL:**
   ```sql
   -- Add enabled_modules column to profiles table
   ALTER TABLE profiles ADD COLUMN IF NOT EXISTS enabled_modules TEXT[] DEFAULT '{}';

   -- Add comment to the column
   COMMENT ON COLUMN profiles.enabled_modules IS 'Array of enabled module IDs: shop, class, work, social';

   -- Create index for faster queries
   CREATE INDEX IF NOT EXISTS idx_profiles_enabled_modules ON profiles USING GIN (enabled_modules);
   ```

6. **Executar**
   - Clicar em "Run" ou pressionar Ctrl+Enter

7. **Verificar sucesso**
   - Deve aparecer: "Success. No rows returned"

8. **Confirmar alteração**
   - Ir em: Table Editor > profiles
   - Verificar que a coluna `enabled_modules` aparece
   - Tipo: text[]
   - Default: {}

---

## Opção 2: Via Supabase CLI (Avançado)

### Pré-requisitos:
```bash
# Instalar Supabase CLI
npm install -g supabase

# Fazer login
supabase login
```

### Aplicar migration:
```bash
# Navegar para o diretório do projeto
cd /Users/jeanmaciel/Downloads/tymes-platform

# Aplicar migration
supabase db push
```

---

## Opção 3: Via SQL direto no psql

Se você tem acesso direto ao PostgreSQL:

```bash
psql -h db.yaifhbwqoihxokatmtec.supabase.co -U postgres -d postgres
```

Depois executar o SQL da migration.

---

## ✅ Verificar se funcionou

### Via Dashboard:

1. **Table Editor > profiles**
   - Verificar coluna `enabled_modules`
   - Tipo: text[]
   - Nullable: Yes
   - Default: {}

2. **Testar inserção manual:**
   ```sql
   UPDATE profiles 
   SET enabled_modules = ARRAY['shop', 'class']
   WHERE id = 'SEU_USER_ID';
   ```

3. **Verificar:**
   ```sql
   SELECT id, name, enabled_modules 
   FROM profiles 
   LIMIT 5;
   ```

### Via Aplicação:

1. Fazer cadastro novo
2. Selecionar módulos no onboarding
3. Verificar no console: "✅ Módulos salvos com sucesso"
4. Verificar no Supabase que o array foi salvo

---

## 🐛 Troubleshooting

### Erro: "column already exists"
**Solução:** A coluna já foi criada. Tudo certo!

### Erro: "permission denied"
**Solução:** Usar conta com permissões de admin no Supabase

### Erro: "relation profiles does not exist"
**Solução:** Verificar se a tabela profiles existe. Se não, criar primeiro.

---

## 📝 Estrutura da Coluna

```typescript
enabled_modules: string[] | null

// Valores possíveis:
['shop']
['class']
['work']
['social']
['shop', 'class']
['shop', 'class', 'work', 'social']
[]
null
```

---

## 🎯 Após aplicar a migration

1. **Testar cadastro completo**
2. **Verificar salvamento dos módulos**
3. **Confirmar que não há erros**
4. **Celebrar! 🎉**

---

## 📞 Suporte

Se tiver problemas:
1. Verificar logs do Supabase
2. Verificar console do navegador
3. Verificar network tab para ver requisições
4. Verificar se a migration foi aplicada corretamente
