import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yaifhbwqoihxokatmtec.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaWZoYndxb2loeG9rYXRtdGVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMzMxMzYsImV4cCI6MjA4MjYwOTEzNn0.neR5Gn8mT9lG7tmxfuPB-prOBmZcbS4FjpSELWykugE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuth() {
  console.log('🧪 Testando autenticação do Supabase...\n');

  // Dados de teste
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'Test123456!';
  const testName = 'Usuário Teste';
  const testDocument = '123.456.789-00';

  try {
    // 1. Criar conta
    console.log('📝 Criando conta...');
    console.log(`Email: ${testEmail}`);

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: testName,
          document: testDocument,
          type: 'PERSONAL',
        },
      },
    });

    if (signUpError) {
      console.error('❌ Erro ao criar conta:', signUpError.message);
      return;
    }

    console.log('✅ Conta criada com sucesso!');
    console.log('User ID:', signUpData.user?.id);
    console.log('Email confirmado:', signUpData.user?.email_confirmed_at ? 'Sim' : 'Não');

    // 2. Fazer logout
    console.log('\n🚪 Fazendo logout...');
    await supabase.auth.signOut();
    console.log('✅ Logout realizado');

    // 3. Fazer login
    console.log('\n🔐 Fazendo login...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (signInError) {
      console.error('❌ Erro ao fazer login:', signInError.message);
      return;
    }

    console.log('✅ Login realizado com sucesso!');
    console.log('User ID:', signInData.user?.id);
    console.log('Email:', signInData.user?.email);

    // 4. Verificar sessão
    console.log('\n🔍 Verificando sessão...');
    const { data: sessionData } = await supabase.auth.getSession();

    if (sessionData.session) {
      console.log('✅ Sessão ativa!');
      console.log('Access Token:', sessionData.session.access_token.substring(0, 20) + '...');
    } else {
      console.log('❌ Nenhuma sessão ativa');
    }

    // 5. Tentar criar perfil (se a função RPC existir)
    console.log('\n👤 Tentando criar perfil...');
    try {
      const { error: profileError } = await supabase.rpc('create_profile', {
        user_id: signUpData.user!.id,
        user_name: testName,
        user_email: testEmail,
        user_document: testDocument,
        user_type: 'PERSONAL',
      });

      if (profileError) {
        console.log(
          '⚠️  Erro ao criar perfil (função RPC pode não existir):',
          profileError.message
        );
      } else {
        console.log('✅ Perfil criado com sucesso!');
      }
    } catch (err: any) {
      console.log('⚠️  Função RPC create_profile não encontrada:', err.message);
    }

    // 6. Verificar se perfil existe
    console.log('\n🔍 Verificando perfil na tabela profiles...');
    const { data: profile, error: profileFetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', signUpData.user!.id)
      .single();

    if (profileFetchError) {
      console.log('⚠️  Erro ao buscar perfil:', profileFetchError.message);
    } else if (profile) {
      console.log('✅ Perfil encontrado!');
      console.log('Nome:', profile.name);
      console.log('Tipo:', profile.type);
    } else {
      console.log('⚠️  Perfil não encontrado');
    }

    console.log('\n✅ Teste concluído com sucesso!');
  } catch (error: any) {
    console.error('\n❌ Erro inesperado:', error.message);
  }
}

testAuth();
