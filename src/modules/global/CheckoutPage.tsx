import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  FileText,
  CheckCircle,
  ArrowRight,
  Loader2,
  Package,
  Banknote,
  QrCode,
  Building2,
  ShoppingBag,
  Truck,
  Home,
  Briefcase,
  Plus,
  Star,
  Trash2,
  GraduationCap,
  AlertCircle,
} from 'lucide-react';
import { useCheckout, ShippingAddress, CombinedBagItem } from '../../lib/CheckoutContext';
import { useAuth } from '../../lib/AuthContext';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { addressService, UserAddress, CreateAddressData } from '../../lib/addressService';

interface CheckoutPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

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

const PAYMENT_METHODS = [
  { id: 'pix', label: 'PIX', icon: QrCode, description: 'Pagamento instantâneo' },
  {
    id: 'credit_card',
    label: 'Cartão de Crédito',
    icon: CreditCard,
    description: 'Até 12x sem juros',
  },
  { id: 'debit_card', label: 'Cartão de Débito', icon: CreditCard, description: 'Débito à vista' },
  { id: 'boleto', label: 'Boleto Bancário', icon: Banknote, description: 'Vencimento em 3 dias' },
  { id: 'bank_transfer', label: 'Transferência', icon: Building2, description: 'TED/DOC' },
];

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBack, onSuccess }) => {
  const { user, profile } = useAuth();
  const {
    step,
    setStep,
    shippingAddress,
    setShippingAddress,
    paymentMethod,
    setPaymentMethod,
    notes,
    setNotes,
    createOrder,
    processPayment,
    loading,
    error,
    orderId,
    allItems,
    combinedTotalAmount,
    combinedTotalItems,
    hasPhysicalProducts,
    hasDigitalItems,
    resetCheckout,
  } = useCheckout();

  // Reset checkout to initial state when page mounts
  // This ensures a fresh checkout flow every time the user navigates to this page
  useEffect(() => {
    // If step is success or processing (from a previous order), reset to start fresh
    // This prevents showing the success/processing screen from a previous completed order
    if (step === 'success' || step === 'processing') {
      resetCheckout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Estados para endereços salvos
  const [savedAddresses, setSavedAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [savingAddress, setSavingAddress] = useState(false);
  const [newAddressLabel, setNewAddressLabel] = useState('Casa');
  const [saveAsDefault, setSaveAsDefault] = useState(false);

  const [addressForm, setAddressForm] = useState<ShippingAddress>({
    street: profile?.address_street || '',
    number: profile?.address_number || '',
    complement: profile?.address_complement || '',
    neighborhood: profile?.address_neighborhood || '',
    city: profile?.address_city || '',
    state: profile?.address_state || '',
    zip_code: profile?.address_zip_code || '',
  });

  // Carregar endereços salvos do usuário
  useEffect(() => {
    const loadAddresses = async () => {
      if (!user?.id) {
        setLoadingAddresses(false);
        return;
      }

      setLoadingAddresses(true);
      const addresses = await addressService.getAddresses(user.id);
      setSavedAddresses(addresses);

      // Se tem endereço padrão, seleciona automaticamente
      const defaultAddr = addresses.find(a => a.is_default);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
        setAddressForm({
          street: defaultAddr.street,
          number: defaultAddr.number,
          complement: defaultAddr.complement || '',
          neighborhood: defaultAddr.neighborhood,
          city: defaultAddr.city,
          state: defaultAddr.state,
          zip_code: defaultAddr.zip_code,
        });
      } else if (addresses.length === 0) {
        // Se não tem endereços salvos, mostra o formulário
        setShowNewAddressForm(true);
      }

      setLoadingAddresses(false);
    };

    loadAddresses();
  }, [user?.id]);

  useEffect(() => {
    if (shippingAddress) {
      setAddressForm(shippingAddress);
    }
  }, [shippingAddress]);

  // Se só tem itens digitais, pula direto para pagamento
  useEffect(() => {
    if (!hasPhysicalProducts && hasDigitalItems && step === 'address') {
      setStep('payment');
    }
  }, [hasPhysicalProducts, hasDigitalItems, step, setStep]);

  // Track if payment processing has been initiated
  const processingInitiated = React.useRef(false);

  // Auto-process payment when entering processing step
  useEffect(() => {
    if (step === 'processing' && !processingInitiated.current) {
      processingInitiated.current = true;
      processPayment();
    }
    // Reset flag when leaving processing step
    if (step !== 'processing') {
      processingInitiated.current = false;
    }
  }, [step, processPayment]);

  // Selecionar um endereço salvo
  const handleSelectAddress = (address: UserAddress) => {
    setSelectedAddressId(address.id);
    setAddressForm({
      street: address.street,
      number: address.number,
      complement: address.complement || '',
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      zip_code: address.zip_code,
    });
    setShowNewAddressForm(false);
  };

  // Salvar novo endereço
  const handleSaveNewAddress = async () => {
    if (!user?.id) return;

    setSavingAddress(true);
    const newAddress = await addressService.createAddress(user.id, {
      label: newAddressLabel,
      is_default: saveAsDefault,
      street: addressForm.street,
      number: addressForm.number,
      complement: addressForm.complement || undefined,
      neighborhood: addressForm.neighborhood,
      city: addressForm.city,
      state: addressForm.state,
      zip_code: addressForm.zip_code,
    });

    if (newAddress) {
      setSavedAddresses(prev => [
        newAddress,
        ...prev.map(a => (saveAsDefault ? { ...a, is_default: false } : a)),
      ]);
      setSelectedAddressId(newAddress.id);
      setShowNewAddressForm(false);
      setNewAddressLabel('Casa');
      setSaveAsDefault(false);
    }
    setSavingAddress(false);
  };

  // Deletar endereço
  const handleDeleteAddress = async (addressId: string) => {
    const success = await addressService.deleteAddress(addressId);
    if (success) {
      setSavedAddresses(prev => prev.filter(a => a.id !== addressId));
      if (selectedAddressId === addressId) {
        setSelectedAddressId(null);
        setAddressForm({
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
          zip_code: '',
        });
      }
    }
  };

  // Definir como padrão
  const handleSetDefault = async (addressId: string) => {
    const success = await addressService.setAsDefault(addressId);
    if (success) {
      setSavedAddresses(prev =>
        prev.map(a => ({
          ...a,
          is_default: a.id === addressId,
        }))
      );
    }
  };

  // Ícone do label do endereço
  const getAddressIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'trabalho':
      case 'work':
        return Briefcase;
      default:
        return Home;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Se o usuário está logado e não tem endereços salvos, salva automaticamente
    if (user?.id && savedAddresses.length === 0) {
      setSavingAddress(true);
      const newAddress = await addressService.createAddress(user.id, {
        label: newAddressLabel,
        is_default: true,
        street: addressForm.street,
        number: addressForm.number,
        complement: addressForm.complement || undefined,
        neighborhood: addressForm.neighborhood,
        city: addressForm.city,
        state: addressForm.state,
        zip_code: addressForm.zip_code,
      });

      if (newAddress) {
        setSavedAddresses([newAddress]);
      }
      setSavingAddress(false);
    }

    setShippingAddress(addressForm);
    setStep('payment');
  };

  const handlePaymentSubmit = () => {
    if (paymentMethod) {
      setStep('review');
    }
  };

  const handleConfirmOrder = async () => {
    await createOrder();
    // Don't call onSuccess here - let the flow go through processing -> success steps
  };

  // Se não há itens na bolsa, mostrar mensagem
  if (allItems.length === 0 && step !== 'success' && step !== 'processing') {
    return (
      <div className="animate-in fade-in duration-500">
        <SectionHeader title="Checkout" subtitle="Finalize sua compra" />

        {/* Empty State */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="flex flex-col items-center justify-center py-16">
            <ShoppingBag size={64} className="text-zinc-300 dark:text-zinc-700 mb-4" />
            <h3 className="text-xl font-bold mb-2">Bolsa vazia</h3>
            <p className="text-zinc-500 mb-6">Adicione produtos à bolsa para continuar</p>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              Voltar às compras
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderStepIndicator = () => {
    // Se só tem itens digitais, pula o step de endereço
    const steps = hasPhysicalProducts
      ? [
          { key: 'address', label: 'Endereço', icon: MapPin },
          { key: 'payment', label: 'Pagamento', icon: CreditCard },
          { key: 'review', label: 'Revisão', icon: FileText },
        ]
      : [
          { key: 'payment', label: 'Pagamento', icon: CreditCard },
          { key: 'review', label: 'Revisão', icon: FileText },
        ];

    const currentStepIndex = steps.findIndex(s => s.key === step);

    return (
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((s, i) => {
          const StepIcon = s.icon;
          const isActive = step === s.key;
          const isCompleted = currentStepIndex > i || step === 'success';

          return (
            <React.Fragment key={s.key}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500'
                  }`}
                >
                  {isCompleted && !isActive ? <CheckCircle size={20} /> : <StepIcon size={20} />}
                </div>
                <span
                  className={`text-xs mt-2 font-medium ${isActive ? 'text-indigo-600' : 'text-zinc-500'}`}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-16 h-1 rounded-full mb-6 ${
                    isCompleted ? 'bg-green-500' : 'bg-zinc-200 dark:bg-zinc-700'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const renderAddressStep = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Endereço de Entrega</h3>
              <p className="text-sm text-zinc-500">Selecione ou adicione um endereço</p>
            </div>
          </div>

          {/* Endereços Salvos */}
          {loadingAddresses ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              <span className="ml-2 text-zinc-500">Carregando endereços...</span>
            </div>
          ) : (
            <>
              {savedAddresses.length > 0 && !showNewAddressForm && (
                <div className="space-y-3 mb-6">
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-3">
                    Endereços salvos
                  </p>
                  {savedAddresses.map(address => {
                    const AddressIcon = getAddressIcon(address.label);
                    const isSelected = selectedAddressId === address.id;

                    return (
                      <div
                        key={address.id}
                        onClick={() => handleSelectAddress(address)}
                        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                            : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                            }`}
                          >
                            <AddressIcon size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{address.label}</span>
                              {address.is_default && (
                                <span className="px-2 py-0.5 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full flex items-center gap-1">
                                  <Star size={10} fill="currentColor" />
                                  Padrão
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                              {address.street}, {address.number}
                              {address.complement && ` - ${address.complement}`}
                            </p>
                            <p className="text-sm text-zinc-500">
                              {address.neighborhood}, {address.city} - {address.state}
                            </p>
                            <p className="text-xs text-zinc-400">CEP: {address.zip_code}</p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                isSelected
                                  ? 'border-indigo-600 bg-indigo-600'
                                  : 'border-zinc-300 dark:border-zinc-600'
                              }`}
                            >
                              {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                          </div>
                        </div>

                        {/* Ações do endereço */}
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                          {!address.is_default && (
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                handleSetDefault(address.id);
                              }}
                              className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                            >
                              <Star size={12} />
                              Definir como padrão
                            </button>
                          )}
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleDeleteAddress(address.id);
                            }}
                            className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 ml-auto"
                          >
                            <Trash2 size={12} />
                            Remover
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Botão para adicionar novo endereço */}
                  <button
                    onClick={() => {
                      setShowNewAddressForm(true);
                      setSelectedAddressId(null);
                      setAddressForm({
                        street: '',
                        number: '',
                        complement: '',
                        neighborhood: '',
                        city: '',
                        state: '',
                        zip_code: '',
                      });
                    }}
                    className="w-full p-4 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors flex items-center justify-center gap-2 text-zinc-500 hover:text-indigo-600"
                  >
                    <Plus size={20} />
                    Adicionar novo endereço
                  </button>
                </div>
              )}

              {/* Formulário de novo endereço */}
              {(showNewAddressForm || savedAddresses.length === 0) && (
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  {savedAddresses.length > 0 && (
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Novo endereço</h4>
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewAddressForm(false);
                          if (savedAddresses.length > 0) {
                            const defaultAddr =
                              savedAddresses.find(a => a.is_default) || savedAddresses[0];
                            handleSelectAddress(defaultAddr);
                          }
                        }}
                        className="text-sm text-zinc-500 hover:text-zinc-700"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}

                  {/* Label do endereço */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome do endereço</label>
                    <div className="flex gap-2">
                      {['Casa', 'Trabalho', 'Outro'].map(label => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setNewAddressLabel(label)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            newAddressLabel === label
                              ? 'bg-indigo-600 text-white'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-2">Rua</label>
                      <input
                        type="text"
                        value={addressForm.street}
                        onChange={e => setAddressForm({ ...addressForm, street: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Número</label>
                      <input
                        type="text"
                        value={addressForm.number}
                        onChange={e => setAddressForm({ ...addressForm, number: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Complemento</label>
                    <input
                      type="text"
                      value={addressForm.complement}
                      onChange={e => setAddressForm({ ...addressForm, complement: e.target.value })}
                      placeholder="Apto, bloco, etc."
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Bairro</label>
                    <input
                      type="text"
                      value={addressForm.neighborhood}
                      onChange={e =>
                        setAddressForm({ ...addressForm, neighborhood: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-2">Cidade</label>
                      <input
                        type="text"
                        value={addressForm.city}
                        onChange={e => setAddressForm({ ...addressForm, city: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Estado</label>
                      <select
                        value={addressForm.state}
                        onChange={e => setAddressForm({ ...addressForm, state: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">UF</option>
                        {BRAZILIAN_STATES.map(uf => (
                          <option key={uf} value={uf}>
                            {uf}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">CEP</label>
                    <input
                      type="text"
                      value={addressForm.zip_code}
                      onChange={e => setAddressForm({ ...addressForm, zip_code: e.target.value })}
                      required
                      maxLength={9}
                      placeholder="00000-000"
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Opção de salvar endereço */}
                  {user && (
                    <div className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={saveAsDefault}
                          onChange={e => setSaveAsDefault(e.target.checked)}
                          className="w-4 h-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm">Salvar como endereço padrão</span>
                      </label>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={onBack}
                      className="flex-1 py-3 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                    >
                      <ArrowLeft size={18} />
                      Voltar
                    </button>
                    {user && showNewAddressForm && savedAddresses.length > 0 ? (
                      <button
                        type="button"
                        onClick={handleSaveNewAddress}
                        disabled={
                          savingAddress ||
                          !addressForm.street ||
                          !addressForm.number ||
                          !addressForm.neighborhood ||
                          !addressForm.city ||
                          !addressForm.state ||
                          !addressForm.zip_code
                        }
                        className="flex-1 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {savingAddress ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <>
                            Salvar e Continuar
                            <ArrowRight size={18} />
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                      >
                        Continuar
                        <ArrowRight size={18} />
                      </button>
                    )}
                  </div>
                </form>
              )}

              {/* Botão continuar quando endereço selecionado */}
              {!showNewAddressForm && savedAddresses.length > 0 && selectedAddressId && (
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={onBack}
                    className="flex-1 py-3 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={18} />
                    Voltar
                  </button>
                  <button
                    onClick={() => {
                      setShippingAddress(addressForm);
                      setStep('payment');
                    }}
                    className="flex-1 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Continuar
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Order Summary Sidebar */}
      {renderOrderSummary()}
    </div>
  );

  const renderPaymentStep = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Forma de Pagamento</h3>
              <p className="text-sm text-zinc-500">Escolha como deseja pagar</p>
            </div>
          </div>

          <div className="space-y-3">
            {PAYMENT_METHODS.map(method => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                  paymentMethod === method.id
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    paymentMethod === method.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                  }`}
                >
                  <method.icon size={24} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">{method.label}</p>
                  <p className="text-sm text-zinc-500">{method.description}</p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === method.id
                      ? 'border-indigo-600 bg-indigo-600'
                      : 'border-zinc-300 dark:border-zinc-600'
                  }`}
                >
                  {paymentMethod === method.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-4 pt-6">
            <button
              onClick={() => (hasPhysicalProducts ? setStep('address') : onBack())}
              className="flex-1 py-3 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} />
              Voltar
            </button>
            <button
              onClick={handlePaymentSubmit}
              disabled={!paymentMethod}
              className="flex-1 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {renderOrderSummary()}
    </div>
  );

  const renderReviewStep = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {/* Address Review - only for physical products */}
        {hasPhysicalProducts && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <h4 className="font-bold">Endereço de Entrega</h4>
              </div>
              <button
                onClick={() => setStep('address')}
                className="text-sm text-indigo-600 hover:underline"
              >
                Alterar
              </button>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400">
              {shippingAddress?.street}, {shippingAddress?.number}
              {shippingAddress?.complement && ` - ${shippingAddress.complement}`}
              <br />
              {shippingAddress?.neighborhood}, {shippingAddress?.city} - {shippingAddress?.state}
              <br />
              CEP: {shippingAddress?.zip_code}
            </p>
          </div>
        )}

        {/* Digital Items Notice */}
        {hasDigitalItems && (
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 p-6">
            <div className="flex items-center gap-3 mb-2">
              <GraduationCap className="w-5 h-5 text-purple-600" />
              <h4 className="font-bold text-purple-700 dark:text-purple-300">Itens Digitais</h4>
            </div>
            <p className="text-purple-600 dark:text-purple-400 text-sm">
              Cursos e serviços serão liberados imediatamente após a confirmação do pagamento.
            </p>
          </div>
        )}

        {/* Payment Review */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              <h4 className="font-bold">Forma de Pagamento</h4>
            </div>
            <button
              onClick={() => setStep('payment')}
              className="text-sm text-indigo-600 hover:underline"
            >
              Alterar
            </button>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400">
            {PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label}
          </p>
        </div>

        {/* Notes */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
          <label className="block font-bold mb-3">Observações (opcional)</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Instruções especiais para entrega..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={() => setStep('payment')}
            disabled={loading}
            className="flex-1 py-3 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>
          <button
            onClick={handleConfirmOrder}
            disabled={loading}
            className="flex-1 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                Confirmar Pedido
                <CheckCircle size={18} />
              </>
            )}
          </button>
        </div>
      </div>

      {renderOrderSummary()}
    </div>
  );

  // Modal overlay for processing and success/error states
  const renderModal = () => {
    if (step !== 'processing' && step !== 'success') return null;

    const isProcessing = step === 'processing';
    const hasError = !!error;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Modal */}
        <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden animate-in zoom-in-95 fade-in duration-200">
          {isProcessing && !hasError ? (
            // Processing State
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-5">
                <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Processando</h3>
              <p className="text-sm text-zinc-500">Aguarde enquanto confirmamos seu pedido...</p>
            </div>
          ) : hasError ? (
            // Error State
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-5">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Erro no Pedido</h3>
              <p className="text-sm text-zinc-500 mb-6">{error}</p>
              <button
                onClick={() => setStep('review')}
                className="w-full py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
          ) : (
            // Success State
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pedido Confirmado!</h3>
              <p className="text-sm text-zinc-500 mb-1">Pedido #{orderId?.slice(0, 8)}</p>
              <p className="text-sm text-zinc-400 mb-6">
                {hasDigitalItems && !hasPhysicalProducts
                  ? 'Acesso liberado! Confira seus pedidos.'
                  : 'Você receberá atualizações por email.'}
              </p>
              <button
                onClick={onSuccess}
                className="w-full py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Ver Meus Pedidos
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderOrderSummary = () => {
    const getItemIcon = (item: CombinedBagItem) => {
      if (item.type === 'course') return GraduationCap;
      if (item.type === 'service') return Briefcase;
      return Package;
    };

    const getItemTypeLabel = (type: string) => {
      switch (type) {
        case 'course':
          return 'Curso';
        case 'service':
          return 'Serviço';
        default:
          return 'Produto';
      }
    };

    const getItemTypeColor = (type: string) => {
      switch (type) {
        case 'course':
          return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
        case 'service':
          return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400';
        default:
          return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
      }
    };

    return (
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 sticky top-24">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Package size={20} />
            Resumo do Pedido
          </h3>

          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {allItems.map(item => {
              const ItemIcon = getItemIcon(item);
              return (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ItemIcon size={16} className="text-zinc-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      {item.type !== 'product' && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full ${getItemTypeColor(item.type)}`}
                        >
                          {getItemTypeLabel(item.type)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500">Qtd: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Info about digital items */}
          {hasDigitalItems && (
            <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-2">
                <GraduationCap size={14} />
                Itens digitais: acesso imediato após confirmação
              </p>
            </div>
          )}

          <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">
                Subtotal ({combinedTotalItems} {combinedTotalItems === 1 ? 'item' : 'itens'})
              </span>
              <span>{formatPrice(combinedTotalAmount)}</span>
            </div>
            {hasPhysicalProducts && (
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Frete</span>
                <span className="text-emerald-500">Grátis</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-zinc-200 dark:border-zinc-700">
              <span>Total</span>
              <span className="text-indigo-600">{formatPrice(combinedTotalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-500">
      <SectionHeader title="Checkout" subtitle="Finalize sua compra" />

      {/* Checkout Content */}
      <div>
        {step !== 'success' && step !== 'processing' && renderStepIndicator()}

        {step === 'address' && renderAddressStep()}
        {step === 'payment' && renderPaymentStep()}
        {(step === 'review' || step === 'processing' || step === 'success') && renderReviewStep()}
      </div>

      {/* Modal for processing/success/error */}
      {renderModal()}
    </div>
  );
};
