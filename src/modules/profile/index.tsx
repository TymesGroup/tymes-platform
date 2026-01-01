import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  MapPin,
  Save,
  Loader2,
  ChevronDown,
  ChevronUp,
  Building2,
  UserCircle,
  Camera,
  Check,
} from 'lucide-react';
import { ProfileType } from '../../types';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { AgeGroupBadge } from '../../components/shared/AgeGroupBadge';
import { getAgeGroupInfo, calculateAge } from '../../lib/ageGroup';
import { useAuth } from '../../lib/AuthContext';

const BRAZILIAN_STATES = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
];

const TABS = [
  { id: 'personal', label: 'Dados Pessoais', icon: User },
  { id: 'address', label: 'Endereço', icon: MapPin },
];

export const ProfileView: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const profileType = (profile?.type as ProfileType) || ProfileType.PERSONAL;

  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSavingRef = useRef(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [addressStreet, setAddressStreet] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [addressComplement, setAddressComplement] = useState('');
  const [addressNeighborhood, setAddressNeighborhood] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressState, setAddressState] = useState('');
  const [addressZipCode, setAddressZipCode] = useState('');

  const ageGroupInfo = birthDate ? getAgeGroupInfo(birthDate) : null;
  const age = birthDate ? calculateAge(birthDate) : null;

  useEffect(() => {
    if (profile && !isSavingRef.current) {
      setName(profile.name || '');
      setEmail(profile.email || '');
      setPhone(profile.phone || '');
      setBirthDate(profile.birth_date || '');
      setAddressStreet(profile.address_street || '');
      setAddressNumber(profile.address_number || '');
      setAddressComplement(profile.address_complement || '');
      setAddressNeighborhood(profile.address_neighborhood || '');
      setAddressCity(profile.address_city || '');
      setAddressState(profile.address_state || '');
      setAddressZipCode(profile.address_zip_code || '');
    }
  }, [profile?.id]);

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleSave = async () => {
    if (loading) return;

    setLoading(true);
    setError(null);
    setSuccess(false);
    isSavingRef.current = true;

    try {
      const { error: updateError } = await updateProfile({
        name,
        phone: phone?.replace(/\D/g, '') || null,
        birth_date: birthDate || null,
        address_street: addressStreet || null,
        address_number: addressNumber || null,
        address_complement: addressComplement || null,
        address_neighborhood: addressNeighborhood || null,
        address_city: addressCity || null,
        address_state: addressState || null,
        address_zip_code: addressZipCode?.replace(/\D/g, '') || null,
      });

      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar');
    } finally {
      setLoading(false);
      isSavingRef.current = false;
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  const inputClass =
    'w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none';
  const labelClass = 'block text-xs font-medium mb-1.5 text-zinc-500 uppercase tracking-wide';

  // Get initials for avatar
  const initials = name
    ? name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <div className="animate-in fade-in duration-500">
      <SectionHeader title="Meu Perfil" subtitle="Gerencie suas informações pessoais" />

      {/* Main Card Container */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Profile Header */}
        <div className="p-4 md:p-6 border-b border-zinc-100 dark:border-zinc-800 bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl md:text-3xl font-bold shadow-lg">
                {initials}
              </div>
              <button className="absolute bottom-0 right-0 p-1.5 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
                <Camera size={14} className="text-zinc-600 dark:text-zinc-400" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-lg md:text-xl font-bold mb-1">{name || 'Seu Nome'}</h2>
              <p className="text-zinc-500 text-sm mb-2">{email}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium ${
                    profileType === ProfileType.BUSINESS
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  }`}
                >
                  {profileType === ProfileType.BUSINESS ? (
                    <Building2 size={12} />
                  ) : (
                    <UserCircle size={12} />
                  )}
                  {profileType === ProfileType.BUSINESS ? 'Empresarial' : 'Pessoal'}
                </span>
                {ageGroupInfo && <AgeGroupBadge ageGroup={ageGroupInfo.key} size="sm" />}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-4 border-b border-zinc-100 dark:border-zinc-800 overflow-x-auto">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Success/Error Messages */}
        {(success || error) && (
          <div className="px-4 md:px-6 pt-4">
            {success && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
                <Check size={16} />
                Alterações salvas com sucesso!
              </div>
            )}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Tab Content */}
        <div className="p-4 md:p-6">
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>
                  {profileType === ProfileType.BUSINESS ? 'Razão Social' : 'Nome Completo'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className={inputClass}
                  placeholder={
                    profileType === ProfileType.BUSINESS ? 'Nome da empresa' : 'Seu nome completo'
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-400 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    {profileType === ProfileType.BUSINESS ? 'CNPJ' : 'CPF'}
                  </label>
                  <input
                    type="text"
                    disabled
                    value={profile?.document || ''}
                    className="w-full p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Telefone</label>
                  <input
                    type="tel"
                    value={formatPhone(phone)}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Data de Nascimento</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={e => setBirthDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className={inputClass}
                  />
                  {age !== null && (
                    <p className="text-xs text-zinc-500 mt-1">
                      {age} anos • {ageGroupInfo?.label}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'address' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>CEP</label>
                  <input
                    type="text"
                    value={formatCEP(addressZipCode)}
                    onChange={e => setAddressZipCode(e.target.value)}
                    placeholder="00000-000"
                    maxLength={9}
                    className={inputClass}
                  />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Rua / Logradouro</label>
                  <input
                    type="text"
                    value={addressStreet}
                    onChange={e => setAddressStreet(e.target.value)}
                    placeholder="Nome da rua"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Número</label>
                  <input
                    type="text"
                    value={addressNumber}
                    onChange={e => setAddressNumber(e.target.value)}
                    placeholder="123"
                    className={inputClass}
                  />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Complemento</label>
                  <input
                    type="text"
                    value={addressComplement}
                    onChange={e => setAddressComplement(e.target.value)}
                    placeholder="Apto, bloco, etc."
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Bairro</label>
                <input
                  type="text"
                  value={addressNeighborhood}
                  onChange={e => setAddressNeighborhood(e.target.value)}
                  placeholder="Nome do bairro"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className={labelClass}>Cidade</label>
                  <input
                    type="text"
                    value={addressCity}
                    onChange={e => setAddressCity(e.target.value)}
                    placeholder="Sua cidade"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Estado</label>
                  <select
                    value={addressState}
                    onChange={e => setAddressState(e.target.value)}
                    className={`${inputClass} appearance-none`}
                  >
                    <option value="">UF</option>
                    {BRAZILIAN_STATES.map(state => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex items-center justify-end pt-6 mt-6 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
