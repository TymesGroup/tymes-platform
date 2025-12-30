import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yaifhbwqoihxokatmtec.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaWZoYndxb2loeG9rYXRtdGVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMzMxMzYsImV4cCI6MjA4MjYwOTEzNn0.neR5Gn8mT9lG7tmxfuPB-prOBmZcbS4FjpSELWykugE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
  const email = 'teste@tymes.com';
  const password = '123456';

  console.log('🔐 Testando login...\n');
  console.log('Email:', email);
  console.log('Senha:', password);
  console.log('');

  try {
    // Fazer logout primeiro
    await supabase.auth.signOut();

    // Fazer login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ Erro no login:', error.message);
      return;
    }

    console.log('✅ Login bem-sucedido!');
    console.log('User ID:', data.user?.id);
    console.log('Email:', data.user?.email);

    // Aguardar um pouco
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Buscar perfil
    console.log('\n🔍 Buscando perfil...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user!.id)
      .maybeSingle();

    if (profileError) {
      console.error('❌ Erro ao buscar perfil:', profileError.message);
    } else if (profile) {
      console.log('✅ Perfil encontrado!');
      console.log('Nome:', profile.name);
      console.log('Email:', profile.email);
      console.log('Tipo:', profile.type);
      console.log('Documento:', profile.document);

      console.log('\n✅ TUDO FUNCIONANDO! Você pode fazer login na aplicação.');
    } else {
      console.log('⚠️  Perfil não encontrado');
      console.log('O trigger pode não ter sido executado.');
      console.log('\nVamos verificar os metadados do usuário:');
      console.log(JSON.stringify(data.user?.user_metadata, null, 2));
    }
  } catch (err: any) {
    console.error('❌ Erro inesperado:', err.message);
  }
}

testLogin();
