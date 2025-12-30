import { supabase } from './supabase';

export interface UserAddress {
  id: string;
  user_id: string;
  label: string;
  is_default: boolean;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAddressData {
  label: string;
  is_default?: boolean;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  country?: string;
}

export const addressService = {
  // Buscar todos os endereços do usuário
  async getAddresses(userId: string): Promise<UserAddress[]> {
    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching addresses:', error);
      return [];
    }

    return data || [];
  },

  // Buscar endereço padrão
  async getDefaultAddress(userId: string): Promise<UserAddress | null> {
    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', userId)
      .eq('is_default', true)
      .maybeSingle();

    if (error) {
      console.error('Error fetching default address:', error);
      return null;
    }

    return data;
  },

  // Criar novo endereço
  async createAddress(userId: string, address: CreateAddressData): Promise<UserAddress | null> {
    const { data, error } = await supabase
      .from('user_addresses')
      .insert({
        user_id: userId,
        ...address,
        country: address.country || 'Brasil',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating address:', error);
      return null;
    }

    return data;
  },

  // Atualizar endereço
  async updateAddress(
    addressId: string,
    address: Partial<CreateAddressData>
  ): Promise<UserAddress | null> {
    const { data, error } = await supabase
      .from('user_addresses')
      .update({
        ...address,
        updated_at: new Date().toISOString(),
      })
      .eq('id', addressId)
      .select()
      .single();

    if (error) {
      console.error('Error updating address:', error);
      return null;
    }

    return data;
  },

  // Definir como padrão
  async setAsDefault(addressId: string): Promise<boolean> {
    const { error } = await supabase
      .from('user_addresses')
      .update({ is_default: true, updated_at: new Date().toISOString() })
      .eq('id', addressId);

    if (error) {
      console.error('Error setting default address:', error);
      return false;
    }

    return true;
  },

  // Deletar endereço
  async deleteAddress(addressId: string): Promise<boolean> {
    const { error } = await supabase.from('user_addresses').delete().eq('id', addressId);

    if (error) {
      console.error('Error deleting address:', error);
      return false;
    }

    return true;
  },
};
