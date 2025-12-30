-- Migration: Adicionar data de nascimento e endereço ao perfil
-- Esses campos são obrigatórios para novos cadastros

-- Adicionar coluna birth_date
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS birth_date DATE;

-- Adicionar colunas de endereço
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS address_street TEXT,
ADD COLUMN IF NOT EXISTS address_number TEXT,
ADD COLUMN IF NOT EXISTS address_complement TEXT,
ADD COLUMN IF NOT EXISTS address_neighborhood TEXT,
ADD COLUMN IF NOT EXISTS address_city TEXT,
ADD COLUMN IF NOT EXISTS address_state TEXT,
ADD COLUMN IF NOT EXISTS address_zip_code TEXT,
ADD COLUMN IF NOT EXISTS address_country TEXT DEFAULT 'Brasil';

-- Adicionar coluna age_group (calculada a partir da data de nascimento)
-- Valores: 'baby' (0-2), 'child' (3-12), 'teen' (13-17), 'adult' (18-59), 'senior' (60+)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS age_group TEXT;

-- Criar função para calcular faixa etária
CREATE OR REPLACE FUNCTION calculate_age_group(birth_date DATE)
RETURNS TEXT AS $$
DECLARE
  age_years INTEGER;
BEGIN
  IF birth_date IS NULL THEN
    RETURN NULL;
  END IF;
  
  age_years := EXTRACT(YEAR FROM AGE(CURRENT_DATE, birth_date));
  
  IF age_years <= 2 THEN
    RETURN 'baby';
  ELSIF age_years <= 12 THEN
    RETURN 'child';
  ELSIF age_years <= 17 THEN
    RETURN 'teen';
  ELSIF age_years <= 59 THEN
    RETURN 'adult';
  ELSE
    RETURN 'senior';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Criar trigger para atualizar age_group automaticamente
CREATE OR REPLACE FUNCTION update_age_group()
RETURNS TRIGGER AS $$
BEGIN
  NEW.age_group := calculate_age_group(NEW.birth_date);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Remover trigger se existir e recriar
DROP TRIGGER IF EXISTS trigger_update_age_group ON public.profiles;

CREATE TRIGGER trigger_update_age_group
  BEFORE INSERT OR UPDATE OF birth_date ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_age_group();

-- Atualizar age_group para perfis existentes que tenham birth_date
UPDATE public.profiles 
SET age_group = calculate_age_group(birth_date) 
WHERE birth_date IS NOT NULL;

-- Atualizar a função de criação de perfil para incluir os novos campos
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    name, 
    document, 
    phone, 
    type, 
    birth_date,
    address_street,
    address_number,
    address_complement,
    address_neighborhood,
    address_city,
    address_state,
    address_zip_code,
    address_country,
    age_group,
    enabled_modules
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
    NEW.raw_user_meta_data->>'document',
    NEW.raw_user_meta_data->>'phone',
    COALESCE((NEW.raw_user_meta_data->>'type')::profile_type, 'PERSONAL'),
    (NEW.raw_user_meta_data->>'birth_date')::DATE,
    NEW.raw_user_meta_data->>'address_street',
    NEW.raw_user_meta_data->>'address_number',
    NEW.raw_user_meta_data->>'address_complement',
    NEW.raw_user_meta_data->>'address_neighborhood',
    NEW.raw_user_meta_data->>'address_city',
    NEW.raw_user_meta_data->>'address_state',
    NEW.raw_user_meta_data->>'address_zip_code',
    COALESCE(NEW.raw_user_meta_data->>'address_country', 'Brasil'),
    calculate_age_group((NEW.raw_user_meta_data->>'birth_date')::DATE),
    ARRAY['social', 'class', 'work', 'shop', 'ai']
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentários para documentação
COMMENT ON COLUMN public.profiles.birth_date IS 'Data de nascimento do usuário';
COMMENT ON COLUMN public.profiles.age_group IS 'Faixa etária: baby (0-2), child (3-12), teen (13-17), adult (18-59), senior (60+)';
COMMENT ON COLUMN public.profiles.address_street IS 'Logradouro (rua, avenida, etc)';
COMMENT ON COLUMN public.profiles.address_number IS 'Número do endereço';
COMMENT ON COLUMN public.profiles.address_complement IS 'Complemento (apto, bloco, etc)';
COMMENT ON COLUMN public.profiles.address_neighborhood IS 'Bairro';
COMMENT ON COLUMN public.profiles.address_city IS 'Cidade';
COMMENT ON COLUMN public.profiles.address_state IS 'Estado (UF)';
COMMENT ON COLUMN public.profiles.address_zip_code IS 'CEP';
COMMENT ON COLUMN public.profiles.address_country IS 'País';
