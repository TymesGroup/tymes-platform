import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  Fingerprint,
  Calendar,
  MapPin,
  Home,
  ChevronDown,
  Loader2,
  Building2,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { isValidBirthDate, getAgeGroupInfo } from '../../lib/ageGroup';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  moduleName?: string;
  moduleColor?: string;
  redirectTo?: string;
  redirectState?: any;
  onSuccess?: () => void;
}

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

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  moduleName,
  moduleColor = 'from-indigo-600 to-purple-600',
  redirectTo = '/app',
  redirectState,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [registerStep, setRegisterStep] = useState<RegisterStep>('BASIC');
  const [profileType, setProfileType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync mode with initialMode when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

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

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setDocument('');
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
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          setError(
            error.message === 'Invalid login credentials'
              ? 'Email ou senha incorretos'
              : error.message
          );
          setLoading(false);
          return;
        }

        await new Promise(resolve => setTimeout(resolve, 500));
        handleClose();
        navigate(redirectTo, { state: redirectState, replace: true });
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

        const { error } = await signUp(email, password, {
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
          setLoading(false);
          return;
        }

        await new Promise(resolve => setTimeout(resolve, 1500));
        handleClose();
        navigate(redirectTo, { state: redirectState, replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Erro inesperado. Tente novamente.');
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  const inputClass =
    'w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';
  const inputClassSimple =
    'w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold">
                {mode === 'login'
                  ? 'Entrar'
                  : registerStep === 'BASIC'
                    ? 'Criar Conta'
                    : 'Seu Endereço'}
              </h2>
              {moduleName && <p className="text-sm text-zinc-500 mt-1">Acessar {moduleName}</p>}
              {mode === 'signup' && (
                <div className="flex gap-1.5 mt-3">
                  <div
                    className={`w-8 h-1 rounded-full ${registerStep === 'BASIC' ? 'bg-indigo-600' : 'bg-zinc-200 dark:bg-zinc-700'}`}
                  />
                  <div
                    className={`w-8 h-1 rounded-full ${registerStep === 'ADDRESS' ? 'bg-indigo-600' : 'bg-zinc-200 dark:bg-zinc-700'}`}
                  />
                </div>
              )}
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Profile Type Toggle - Only for signup step 1 */}
          {mode === 'signup' && registerStep === 'BASIC' && (
            <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl mb-5">
              <button
                type="button"
                onClick={() => setProfileType('PERSONAL')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${profileType === 'PERSONAL' ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
              >
                <User size={16} /> Pessoal
              </button>
              <button
                type="button"
                onClick={() => setProfileType('BUSINESS')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${profileType === 'BUSINESS' ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
              >
                <Building2 size={16} /> Negócios
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'login' ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 text-zinc-400" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                      disabled={loading}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-zinc-400" size={18} />
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      disabled={loading}
                      className={inputClass}
                    />
                  </div>
                </div>
              </>
            ) : registerStep === 'BASIC' ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {profileType === 'PERSONAL' ? 'Nome Completo' : 'Razão Social'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 text-zinc-400" size={18} />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder={profileType === 'PERSONAL' ? 'Seu nome' : 'Nome da empresa'}
                      disabled={loading}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {profileType === 'PERSONAL' ? 'CPF' : 'CNPJ'}
                  </label>
                  <div className="relative">
                    <Fingerprint className="absolute left-3 top-3.5 text-zinc-400" size={18} />
                    <input
                      type="text"
                      value={document}
                      onChange={e => setDocument(e.target.value)}
                      placeholder={
                        profileType === 'PERSONAL' ? '000.000.000-00' : '00.000.000/0001-00'
                      }
                      disabled={loading}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Data de Nascimento</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3.5 text-zinc-400" size={18} />
                    <input
                      type="date"
                      value={birthDate}
                      onChange={e => setBirthDate(e.target.value)}
                      disabled={loading}
                      max={new Date().toISOString().split('T')[0]}
                      className={inputClass}
                    />
                  </div>
                  {ageGroupInfo && (
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
                      Faixa etária: {ageGroupInfo.label}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Telefone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 text-zinc-400" size={18} />
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="(00) 00000-0000"
                      disabled={loading}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 text-zinc-400" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                      disabled={loading}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-zinc-400" size={18} />
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      disabled={loading}
                      className={inputClass}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">CEP</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 text-zinc-400" size={18} />
                    <input
                      type="text"
                      value={formatCEP(addressZipCode)}
                      onChange={e => setAddressZipCode(e.target.value)}
                      placeholder="00000-000"
                      maxLength={9}
                      disabled={loading}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Rua / Logradouro</label>
                  <div className="relative">
                    <Home className="absolute left-3 top-3.5 text-zinc-400" size={18} />
                    <input
                      type="text"
                      value={addressStreet}
                      onChange={e => setAddressStreet(e.target.value)}
                      placeholder="Nome da rua"
                      disabled={loading}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Número</label>
                    <input
                      type="text"
                      value={addressNumber}
                      onChange={e => setAddressNumber(e.target.value)}
                      placeholder="123"
                      disabled={loading}
                      className={inputClassSimple}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Complemento</label>
                    <input
                      type="text"
                      value={addressComplement}
                      onChange={e => setAddressComplement(e.target.value)}
                      placeholder="Apto 101"
                      disabled={loading}
                      className={inputClassSimple}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bairro</label>
                  <input
                    type="text"
                    value={addressNeighborhood}
                    onChange={e => setAddressNeighborhood(e.target.value)}
                    placeholder="Nome do bairro"
                    disabled={loading}
                    className={inputClassSimple}
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">Cidade</label>
                    <input
                      type="text"
                      value={addressCity}
                      onChange={e => setAddressCity(e.target.value)}
                      placeholder="Sua cidade"
                      disabled={loading}
                      className={inputClassSimple}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Estado</label>
                    <div className="relative">
                      <select
                        value={addressState}
                        onChange={e => setAddressState(e.target.value)}
                        disabled={loading}
                        className={`${inputClassSimple} appearance-none pr-8`}
                      >
                        <option value="">UF</option>
                        {BRAZILIAN_STATES.map(state => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-2 top-3.5 text-zinc-400 pointer-events-none"
                        size={16}
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setRegisterStep('BASIC');
                    setError(null);
                  }}
                  className="w-full text-sm text-zinc-500 hover:text-indigo-600 py-2 flex items-center justify-center gap-1"
                  disabled={loading}
                >
                  <ArrowLeft size={14} /> Voltar para dados pessoais
                </button>
              </>
            )}

            <button
              type={mode === 'signup' && registerStep === 'BASIC' ? 'button' : 'submit'}
              onClick={mode === 'signup' && registerStep === 'BASIC' ? handleNextStep : undefined}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : null}
              {loading
                ? 'Aguarde...'
                : mode === 'login'
                  ? 'Entrar'
                  : registerStep === 'BASIC'
                    ? 'Continuar'
                    : 'Criar Conta'}
            </button>

            <div className="text-center text-sm text-zinc-500 pt-2">
              {mode === 'login' ? (
                <>
                  Não tem uma conta?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setError(null);
                      resetForm();
                    }}
                    className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    Criar conta
                  </button>
                </>
              ) : (
                <>
                  Já tem uma conta?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setError(null);
                      resetForm();
                    }}
                    className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    Entrar
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
