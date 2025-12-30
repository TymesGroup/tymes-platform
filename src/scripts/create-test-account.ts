import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yaifhbwqoihxokatmtec.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaWZoYndxb2loeG9rYXRtdGVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMzMxMzYsImV4cCI6MjA4MjYwOTEzNn0.neR5Gn8mT9lG7tmxfuPB-prOBmZcbS4FjpSELWykugE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAccount() {
  // Credenciais simples e fáceis de lembrar
  const email = 'teste@tymes.com';
  const password = '123456';
  const name = 'Usuário Teste';
  const document = '123.456.789-00';

  console.log('📝 Criando nova conta de teste...\n');
  console.log('Email:', email);
  console.log('Senha:', password);
  console.log('Nome:', name);
  console.log('');

  try {
    // Primeiro, tentar fazer logout se houver sessão
    await supabase.auth.signOut();

    // Criar conta
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          document,
          type: 'PERSONAL',
        },
      },
    });

    if (error) {
      console.error('❌ Erro ao criar conta:', error.message);

      // Se o usuário já existe, tentar fazer login
      if (error.message.includes('already registered')) {
        console.log('\n⚠️  Usuário já existe. Tentando fazer login...\n');

        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (loginError) {
          console.error('❌ Erro no login:', loginError.message);
          return;
        }

        console.log('✅ Login bem-sucedido!');
        console.log('User ID:', loginData.user?.id);

        // Verificar perfil
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', loginData.user!.id)
          .single();

        if (profile) {
          console.log('✅ Perfil encontrado:', profile.name);
        }
      }
      return;
    }

    console.log('✅ Conta criada com sucesso!');
    console.log('User ID:', data.user?.id);
    console.log('Email confirmado:', data.user?.email_confirmed_at ? 'Sim' : 'Não');

    // Aguardar um pouco para o trigger criar o perfil
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verificar se o perfil foi criado
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user!.id)
      .single();

    if (profileError) {
      console.log('⚠️  Perfil ainda não foi criado. Criando manualmente...');

      // Tentar criar via RPC
      const { error: rpcError } = await supabase.rpc('create_profile', {
        user_id: data.user!.id,
        user_name: name,
        user_email: email,
        user_document: document,
        user_type: 'PERSONAL',
      });

      if (rpcError) {
        console.log('⚠️  Função RPC não existe. Perfil será criado pelo trigger.');
      }
    } else {
      console.log('✅ Perfil criado automaticamente!');
      console.log('Nome:', profile.name);
      console.log('Tipo:', profile.type);
    }

    console.log('\n🎉 Tudo pronto!');
    console.log('\n📋 Use estas credenciais para fazer login:');
    console.log('Email:', email);
    console.log('Senha:', password);
  } catch (err: any) {
    console.error('❌ Erro inesperado:', err.message);
  }
}

createAccount();
