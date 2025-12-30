import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yaifhbwqoihxokatmtec.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaWZoYndxb2loeG9rYXRtdGVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMzMxMzYsImV4cCI6MjA4MjYwOTEzNn0.neR5Gn8mT9lG7tmxfuPB-prOBmZcbS4FjpSELWykugE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProfile() {
  const userId = '76340a48-f96f-4914-a21b-7a70ceccf444';

  console.log('🔍 Verificando perfil...\n');

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('❌ Erro:', error.message);
    console.log('\n🔧 Criando perfil manualmente...');

    const { error: insertError } = await supabase.from('profiles').insert({
      id: userId,
      name: 'Usuário Teste',
      email: 'teste@tymes.com',
      document: '123.456.789-00',
      type: 'PERSONAL',
    });

    if (insertError) {
      console.error('❌ Erro ao criar perfil:', insertError.message);
    } else {
      console.log('✅ Perfil criado com sucesso!');
    }
  } else {
    console.log('✅ Perfil encontrado!');
    console.log('Nome:', profile.name);
    console.log('Email:', profile.email);
    console.log('Tipo:', profile.type);
  }
}

checkProfile();
