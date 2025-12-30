import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yaifhbwqoihxokatmtec.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaWZoYndxb2loeG9rYXRtdGVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMzMxMzYsImV4cCI6MjA4MjYwOTEzNn0.neR5Gn8mT9lG7tmxfuPB-prOBmZcbS4FjpSELWykugE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLoginFlow() {
  console.log('🧪 Testando fluxo completo de login...\n');

  // Usar conta criada anteriormente
  const testEmail = 'test-1767041098289@example.com';
  const testPassword = 'Test123456!';

  try {
    // 1. Verificar se há sessão ativa
    console.log('1️⃣ Verificando sessão inicial...');
    const { data: initialSession } = await supabase.auth.getSession();
    console.log('Sessão inicial:', initialSession.session ? 'Ativa' : 'Nenhuma');

    if (initialSession.session) {
      console.log('Fazendo logout da sessão anterior...');
      await supabase.auth.signOut();
    }

    // 2. Fazer login
    console.log('\n2️⃣ Fazendo login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (loginError) {
      console.error('❌ Erro no login:', loginError.message);
      return;
    }

    console.log('✅ Login bem-sucedido!');
    console.log('User ID:', loginData.user?.id);
    console.log('Email:', loginData.user?.email);

    // 3. Verificar sessão após login
    console.log('\n3️⃣ Verificando sessão após login...');
    const { data: sessionAfterLogin } = await supabase.auth.getSession();
    console.log('Sessão ativa:', !!sessionAfterLogin.session);
    console.log('Access Token presente:', !!sessionAfterLogin.session?.access_token);

    // 4. Buscar perfil (simulando o que o useAuth faz)
    console.log('\n4️⃣ Buscando perfil do usuário...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', loginData.user!.id)
      .single();

    if (profileError) {
      console.error('❌ Erro ao buscar perfil:', profileError.message);
      console.log('Detalhes do erro:', profileError);
    } else {
      console.log('✅ Perfil encontrado!');
      console.log('Nome:', profile.name);
      console.log('Email:', profile.email);
      console.log('Tipo:', profile.type);
      console.log('Documento:', profile.document);
    }

    // 5. Simular verificação de autenticação (como no App.tsx)
    console.log('\n5️⃣ Verificando estado de autenticação...');
    const isAuthenticated = !!loginData.user && !!profile;
    console.log('isAuthenticated:', isAuthenticated);

    if (isAuthenticated) {
      console.log('✅ Usuário deveria ser redirecionado para /app');
    } else {
      console.log('❌ Usuário NÃO seria redirecionado');
      console.log('Motivo:', !loginData.user ? 'Sem usuário' : 'Sem perfil');
    }

    // 6. Testar onAuthStateChange
    console.log('\n6️⃣ Testando listener de mudança de estado...');
    let authChangeTriggered = false;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔔 Auth State Change detectado:', event);
      console.log('Sessão presente:', !!session);
      authChangeTriggered = true;
    });

    // Aguardar um pouco para ver se o listener é disparado
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!authChangeTriggered) {
      console.log('⚠️  Listener não foi disparado (normal se já estava logado)');
    }

    subscription.unsubscribe();

    console.log('\n✅ Teste concluído!');
    console.log('\n📋 Resumo:');
    console.log('- Login: ✅');
    console.log('- Sessão: ✅');
    console.log('- Perfil:', profile ? '✅' : '❌');
    console.log(
      '- Redirecionamento:',
      isAuthenticated ? '✅ Deveria funcionar' : '❌ Não funcionaria'
    );
  } catch (error: any) {
    console.error('\n❌ Erro inesperado:', error.message);
  }
}

testLoginFlow();
