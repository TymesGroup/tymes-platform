-- Remover trigger e função antigos
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Recriar função com tratamento de erro melhorado
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_type profile_type;
BEGIN
  -- Converter tipo com fallback para PERSONAL
  BEGIN
    user_type := COALESCE(
      (NEW.raw_user_meta_data->>'type')::profile_type,
      'PERSONAL'::profile_type
    );
  EXCEPTION WHEN OTHERS THEN
    user_type := 'PERSONAL'::profile_type;
  END;

  INSERT INTO public.profiles (id, name, email, document, type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
    COALESCE(NEW.email, ''),
    NEW.raw_user_meta_data->>'document',
    user_type
  );
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log do erro mas não falha o signup
  RAISE WARNING 'Erro ao criar perfil: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- Recriar trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();;
