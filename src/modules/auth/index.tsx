import React, { useState } from 'react';
import {
  User,
  Building2,
  ArrowRight,
  Lock,
  Mail,
  Fingerprint,
  Phone,
  Calendar,
  MapPin,
  Home,
  ChevronDown,
} from 'lucide-react';
import { ProfileType } from '../../types';
import { isValidBirthDate, getAgeGroupInfo } from '../../lib/ageGroup';

interface AuthProps {
  onLogin: (profile: { name: string; email: string; document: string; type: ProfileType }) => void;
  onBack: () => void;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signUp: (
    email: string,
    password: string,
    metadata: {
      name: string;
      document: string;
      phone: string;
      type: 'PERSONAL' | 'BUSINESS';
      birth_date: string;
      address_street: string;
      address_number: string;
      address_complement?: string;
      address_neighborhood: string;
      address_city: string;
      address_state: string;
      address_zip_code: string;
      address_country?: string;
    }
  ) => Promise<{ data: any; error: any }>;
}

type AuthMode = 'LOGIN' | 'REGISTER';
type RegisterStep = 'BASIC' | 'ADDRESS';

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

export const Auth: React.FC<AuthProps> = ({ onLogin, onBack, signIn, signUp }) => {
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [registerStep, setRegisterStep] = useState<RegisterStep>('BASIC');
  const [profileType, setProfileType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State - Basic
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [document, setDocument] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');

  // Form State - Address
  const [addressStreet, setAddressStreet] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [addressComplement, setAddressComplement] = useState('');
  const [addressNeighborhood, setAddressNeighborhood] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressState, setAddressState] = useState('');
  const [addressZipCode, setAddressZipCode] = useState('');

  const ageGroupInfo = birthDate ? getAgeGroupInfo(birthDate) : null;

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressZipCode(formatCEP(e.target.value));
  };

  const validateBasicStep = (): boolean => {
    if (!name || !document || !phone || !birthDate || !email || !password) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return false;
    }
    if (!isValidBirthDate(birthDate)) {
      setError('Data de nascimento inválida.');
      return false;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return false;
    }
    return true;
  };

  const validateAddressStep = (): boolean => {
    if (
      !addressStreet ||
      !addressNumber ||
      !addressNeighborhood ||
      !addressCity ||
      !addressState ||
      !addressZipCode
    ) {
      setError('Por favor, preencha todos os campos de endereço obrigatórios.');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setError(null);
    if (validateBasicStep()) {
      setRegisterStep('ADDRESS');
    }
  };

  const handlePrevStep = () => {
    setError(null);
    setRegisterStep('BASIC');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'LOGIN') {
        const { data, error } = await signIn(email, password);
        if (error) {
          setError(
            error.message === 'Invalid login credentials'
              ? 'Email ou senha incorretos'
              : error.message
          );
        }
      } else {
        if (registerStep === 'BASIC') {
          if (validateBasicStep()) {
            setRegisterStep('ADDRESS');
          }
          setLoading(false);
          return;
        }

        if (!validateAddressStep()) {
          setLoading(false);
          return;
        }

        const { data, error } = await signUp(email, password, {
          name,
          document,
          phone,
          type: profileType,
          birth_date: birthDate,
          address_street: addressStreet,
          address_number: addressNumber,
          address_complement: addressComplement || undefined,
          address_neighborhood: addressNeighborhood,
          address_city: addressCity,
          address_state: addressState,
          address_zip_code: addressZipCode.replace(/\D/g, ''),
        });

        if (error) {
          setError(error.message);
        } else {
          alert('Conta criada com sucesso! Faça login.');
          setMode('LOGIN');
          resetForm();
        }
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
    }

    setLoading(false);
  };

  const resetForm = () => {
    setName('');
    setDocument('');
    setPassword('');
    setPhone('');
    setBirthDate('');
    setAddressStreet('');
    setAddressNumber('');
    setAddressComplement('');
    setAddressNeighborhood('');
    setAddressCity('');
    setAddressState('');
    setAddressZipCode('');
    setRegisterStep('BASIC');
  };

  const inputClass =
    'w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';
  const labelClass = 'text-xs font-semibold text-zinc-500 uppercase';

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="p-6 text-center bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800">
          <div className="mx-auto w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl mb-4">
            T
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {mode === 'LOGIN'
              ? 'Bem-vindo de volta'
              : registerStep === 'BASIC'
                ? 'Criar nova conta'
                : 'Seu endereço'}
          </h2>
          <p className="text-sm text-zinc-500 mt-2">
            {mode === 'LOGIN'
              ? 'Acesse sua conta Tymes'
              : registerStep === 'BASIC'
                ? 'Preencha seus dados pessoais'
                : 'Informe seu endereço completo'}
          </p>
          {mode === 'REGISTER' && (
            <div className="flex justify-center gap-2 mt-4">
              <div
                className={`w-2 h-2 rounded-full ${registerStep === 'BASIC' ? 'bg-indigo-600' : 'bg-zinc-300'}`}
              />
              <div
                className={`w-2 h-2 rounded-full ${registerStep === 'ADDRESS' ? 'bg-indigo-600' : 'bg-zinc-300'}`}
              />
            </div>
          )}
        </div>

        {/* Profile Type Toggle - Apenas no cadastro step 1 */}
        {mode === 'REGISTER' && registerStep === 'BASIC' && (
          <div className="flex p-2 bg-zinc-100 dark:bg-zinc-800/50 m-6 mb-0 rounded-lg">
            <button
              type="button"
              onClick={() => setProfileType('PERSONAL')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                profileType === 'PERSONAL'
                  ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              <User size={16} /> Pessoal
            </button>
            <button
              type="button"
              onClick={() => setProfileType('BUSINESS')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                profileType === 'BUSINESS'
                  ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              <Building2 size={16} /> Negócios
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-3">
          {mode === 'LOGIN' ? (
            <>
              <div className="space-y-1">
                <label className={labelClass}>Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-zinc-400" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="seu@email.com"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelClass}>Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-zinc-400" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className={inputClass}
                    placeholder="••••••••"
                    disabled={loading}
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </>
          ) : registerStep === 'BASIC' ? (
            <>
              <div className="space-y-1">
                <label className={labelClass}>
                  {profileType === 'PERSONAL' ? 'Nome Completo' : 'Razão Social'}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-zinc-400" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className={inputClass}
                    placeholder={profileType === 'PERSONAL' ? 'Seu nome' : 'Nome da empresa'}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelClass}>{profileType === 'PERSONAL' ? 'CPF' : 'CNPJ'}</label>
                <div className="relative">
                  <Fingerprint className="absolute left-3 top-3 text-zinc-400" size={18} />
                  <input
                    type="text"
                    value={document}
                    onChange={e => setDocument(e.target.value)}
                    className={inputClass}
                    placeholder={
                      profileType === 'PERSONAL' ? '000.000.000-00' : '00.000.000/0001-00'
                    }
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelClass}>Data de Nascimento</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 text-zinc-400" size={18} />
                  <input
                    type="date"
                    value={birthDate}
                    onChange={e => setBirthDate(e.target.value)}
                    className={inputClass}
                    disabled={loading}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
                {ageGroupInfo && (
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
                    Faixa etária: {ageGroupInfo.label}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className={labelClass}>Telefone / Celular</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-zinc-400" size={18} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className={inputClass}
                    placeholder="(00) 00000-0000"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelClass}>Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-zinc-400" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="seu@email.com"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelClass}>Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-zinc-400" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className={inputClass}
                    placeholder="••••••••"
                    disabled={loading}
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <label className={labelClass}>CEP</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-zinc-400" size={18} />
                  <input
                    type="text"
                    value={addressZipCode}
                    onChange={handleCEPChange}
                    className={inputClass}
                    placeholder="00000-000"
                    disabled={loading}
                    maxLength={9}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelClass}>Rua / Logradouro</label>
                <div className="relative">
                  <Home className="absolute left-3 top-3 text-zinc-400" size={18} />
                  <input
                    type="text"
                    value={addressStreet}
                    onChange={e => setAddressStreet(e.target.value)}
                    className={inputClass}
                    placeholder="Nome da rua"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={labelClass}>Número</label>
                  <input
                    type="text"
                    value={addressNumber}
                    onChange={e => setAddressNumber(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="123"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Complemento</label>
                  <input
                    type="text"
                    value={addressComplement}
                    onChange={e => setAddressComplement(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Apto 101"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelClass}>Bairro</label>
                <input
                  type="text"
                  value={addressNeighborhood}
                  onChange={e => setAddressNeighborhood(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nome do bairro"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className={labelClass}>Cidade</label>
                  <input
                    type="text"
                    value={addressCity}
                    onChange={e => setAddressCity(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Sua cidade"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Estado</label>
                  <div className="relative">
                    <select
                      value={addressState}
                      onChange={e => setAddressState(e.target.value)}
                      className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                      disabled={loading}
                    >
                      <option value="">UF</option>
                      {BRAZILIAN_STATES.map(state => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute right-2 top-3 text-zinc-400 pointer-events-none"
                      size={16}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {mode === 'REGISTER' && registerStep === 'ADDRESS' && (
            <button
              type="button"
              onClick={handlePrevStep}
              className="w-full text-sm text-zinc-500 hover:text-indigo-600 py-2"
              disabled={loading}
            >
              ← Voltar para dados pessoais
            </button>
          )}

          <button
            type={mode === 'REGISTER' && registerStep === 'BASIC' ? 'button' : 'submit'}
            onClick={mode === 'REGISTER' && registerStep === 'BASIC' ? handleNextStep : undefined}
            disabled={loading}
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            {loading
              ? 'Aguarde...'
              : mode === 'LOGIN'
                ? 'Entrar'
                : registerStep === 'BASIC'
                  ? 'Continuar'
                  : 'Cadastrar'}
            <ArrowRight size={18} />
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'LOGIN' ? 'REGISTER' : 'LOGIN');
                setError(null);
                resetForm();
              }}
              className="text-sm text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 underline underline-offset-2"
              disabled={loading}
            >
              {mode === 'LOGIN' ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
            </button>
          </div>
        </form>

        <div className="px-6 pb-4 text-center">
          <button
            onClick={onBack}
            className="text-xs text-zinc-400 hover:text-zinc-600"
            disabled={loading}
          >
            Voltar para Home
          </button>
        </div>
      </div>
    </div>
  );
};
