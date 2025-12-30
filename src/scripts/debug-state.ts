import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yaifhbwqoihxokatmtec.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaWZoYndxb2loeG9rYXRtdGVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMzMxMzYsImV4cCI6MjA4MjYwOTEzNn0.neR5Gn8mT9lG7tmxfuPB-prOBmZcbS4FjpSELWykugE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugState() {
  console.log('🔍 Verificando estado após login...\n');

  // Fazer login
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: 'teste@tymes.com',
    password: '123456',
  });

  if (loginError) {
    console.error('❌ Erro no login:', loginError);
    return;
  }

  console.log('✅ Login OK');
  console.log('User:', loginData.user?.id);

  // Aguardar um pouco
  await new Promise(resolve => setTimeout(resolve, 500));

  // Verificar sessão
  const { data: sessionData } = await supabase.auth.getSession();
  console.log('\n📊 Sessão:');
  console.log('- Ativa:', !!sessionData.session);
  console.log('- User ID:', sessionData.session?.user?.id);

  // Buscar perfil
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', loginData.user!.id)
    .single();

  console.log('\n👤 Perfil:');
  if (profileError) {
    console.error('❌ Erro:', profileError);
  } else {
    console.log('✅ Encontrado');
    console.log('- ID:', profile.id);
    console.log('- Nome:', profile.name);
    console.log('- Email:', profile.email);
    console.log('- Tipo:', profile.type);
    console.log('- Tipo de dado:', typeof profile.type);
    console.log('\nPerfil completo:', JSON.stringify(profile, null, 2));
  }

  // Simular o que o useAuth faz
  console.log('\n🎯 Estado que deveria ser retornado:');
  console.log('- user:', !!sessionData.session?.user);
  console.log('- profile:', !!profile);
  console.log('- isAuthenticated:', !!(sessionData.session?.user && profile));
}

debugState();
