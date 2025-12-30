import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabase';
import type { Tables } from './database.types';

export type Profile = Tables<'profiles'>;

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
  });

  console.log('🔄 useAuth renderizado. Estado atual:', {
    hasUser: !!state.user,
    hasProfile: !!state.profile,
    loading: state.loading,
  });

  useEffect(() => {
    let mounted = true;

    // Timeout de segurança - se demorar mais de 5s, para o loading
    const timeout = setTimeout(() => {
      if (mounted) {
        setState(s => ({ ...s, loading: false }));
      }
    }, 5000);

    // Pegar sessão inicial
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!mounted) return;

        if (session?.user) {
          fetchProfile(session.user.id, session);
        } else {
          setState(s => ({ ...s, loading: false }));
        }
      })
      .catch(err => {
        console.error('Erro ao buscar sessão:', err);
        if (mounted) {
          setState(s => ({ ...s, loading: false }));
        }
      });

    // Escutar mudanças de auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔔 Auth State Change:', event, {
        hasSession: !!session,
        hasUser: !!session?.user,
      });
      if (!mounted) return;

      if (session?.user) {
        console.log('👤 Buscando perfil para usuário:', session.user.id);
        await fetchProfile(session.user.id, session);
      } else {
        console.log('🚪 Sem sessão, limpando estado');
        setState({ user: null, profile: null, session: null, loading: false });
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  async function fetchProfile(userId: string, session: Session) {
    try {
      console.log('🔍 Buscando perfil para userId:', userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Erro ao buscar perfil:', error);
      } else {
        console.log('✅ Perfil encontrado:', profile);
      }

      const newState = {
        user: session.user,
        profile: profile || null,
        session,
        loading: false,
      };

      console.log('📊 Atualizando estado:', {
        hasUser: !!newState.user,
        hasProfile: !!newState.profile,
        loading: newState.loading,
      });

      setState(newState);

      // Forçar re-render após um pequeno delay
      setTimeout(() => {
        console.log('🔄 Verificando estado após setState:', {
          hasUser: !!newState.user,
          hasProfile: !!newState.profile,
        });
      }, 100);
    } catch (err) {
      console.error('❌ Erro inesperado:', err);
      setState({
        user: session.user,
        profile: null,
        session,
        loading: false,
      });
    }
  }

  async function signUp(
    email: string,
    password: string,
    metadata: { name: string; document: string; type: 'PERSONAL' | 'BUSINESS' }
  ) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) {
        return { data, error };
      }

      // O perfil será criado automaticamente pelo trigger do banco
      console.log('✅ Conta criada! O perfil será criado automaticamente.');

      return { data, error: null };
    } catch (err: any) {
      console.error('Erro no signUp:', err);
      return {
        data: null,
        error: {
          message: err.message || 'Erro ao criar conta. Tente novamente.',
          name: 'AuthError',
          status: 500,
        },
      };
    }
  }

  async function signIn(email: string, password: string) {
    console.log('SignIn iniciado:', email);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Resultado signInWithPassword:', { data, error });

      if (error) {
        console.error('Erro no login:', error);
        return { data: null, error };
      }

      if (!data?.user) {
        return {
          data: null,
          error: {
            message: 'Usuário não encontrado',
            name: 'AuthError',
            status: 400,
          },
        };
      }

      console.log('Login OK!');
      return { data, error: null };
    } catch (err: any) {
      console.error('Erro inesperado no signIn:', err);
      return {
        data: null,
        error: {
          message: err.message || 'Erro ao fazer login. Verifique sua conexão.',
          name: 'AuthError',
          status: 500,
        },
      };
    }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  return {
    ...state,
    signUp,
    signIn,
    signOut,
  };
}
