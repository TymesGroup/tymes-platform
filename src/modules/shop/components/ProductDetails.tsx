/**
 * ProductDetails - Página de detalhes do produto
 * Design moderno com foco em conversão e UX
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  ShoppingBag,
  Star,
  Truck,
  Shield,
  Store,
  Minus,
  Plus,
  Share2,
  ChevronLeft,
  ChevronRight,
  Play,
  Package,
  Clock,
  Award,
  CheckCircle,
  AlertCircle,
  Building2,
  ExternalLink,
  Zap,
  Users,
  Loader2,
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useBag } from '../../../lib/BagContext';
import { useFavorites } from '../../../lib/FavoritesContext';
import { useAuth } from '../../../lib/AuthContext';
import { ProfileType } from '../../../types';

interface ProductDetailsProps {
  productId: string;
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

interface ProductMedia {
  id: string;
  url: string;
  type: 'image' | 'video';
  position: number;
  alt_text?: string;
  is_primary: boolean;
}

interface StoreInfo {
  id: string;
  name: string;
  logo_url?: string;
  rating?: number;
  total_sales?: number;
  owner_id: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  category: string;
  image?: string;
  stock?: number;
  rating?: number;
  total_reviews?: number;
  brand?: string;
  sku?: string;
  warranty_months?: number;
  sales_count?: number;
  created_by?: string;
  store_id?: string;
  store?: StoreInfo;
  seller?: { id: string; name: string; avatar_url?: string; type: string };
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  productId,
  onBack,
  onNavigate,
}) => {
  const { user, profile } = useAuth();
  const { addItem, items: bagItems, openBag } = useBag();
  const { isFavorited, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [media, setMedia] = useState<ProductMedia[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'about' | 'specs' | 'reviews'>('about');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const isFav = isFavorited(productId, 'product');
  const inBag = bagItems.some(item => item.product_id === productId);
  const accountType = profile?.type === ProfileType.BUSINESS ? 'business' : 'personal';

  const loadProductData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select(
          `
          *,
          store:stores(id, name, logo_url, rating, total_sales, owner_id),
          seller:profiles!products_created_by_fkey(id, name, avatar_url, type)
        `
        )
        .eq('id', productId)
        .single();

      if (productError) throw productError;
      setProduct(productData);

      // Increment views
      await supabase.rpc('increment_product_views', { p_product_id: productId }).catch(() => {});

      // Fetch media
      const { data: mediaData } = await supabase
        .from('product_media')
        .select('*')
        .eq('product_id', productId)
        .order('position');

      if (mediaData && mediaData.length > 0) {
        setMedia(mediaData);
      } else if (productData?.image) {
        setMedia([
          { id: '1', url: productData.image, type: 'image', position: 0, is_primary: true },
        ]);
      }

      // Fetch related products
      if (productData?.category) {
        const { data: relatedData } = await supabase
          .from('products')
          .select('id, name, price, image, rating, total_reviews, category')
          .eq('category', productData.category)
          .neq('id', productId)
          .eq('status', 'active')
          .limit(4);
        setRelatedProducts(relatedData || []);
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadProductData();
  }, [loadProductData]);

  // Adicionar à Bolsa - NÃO abre modal, apenas adiciona
  const handleAddToCart = async () => {
    if (!user) {
      alert('Faça login para adicionar à bolsa');
      return;
    }

    setIsAddingToCart(true);
    try {
      await addItem(productId, quantity);
      setAddedToCart(true);
      // Feedback visual temporário
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao adicionar à bolsa');
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Comprar Agora - Adiciona à bolsa e vai direto para checkout
  const handleBuyNow = async () => {
    if (!user) {
      alert('Faça login para comprar');
      return;
    }

    setIsBuying(true);
    try {
      if (!inBag) {
        await addItem(productId, quantity);
      }
      // Vai direto para o checkout
      navigate(`/${accountType}/checkout`);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao processar compra');
    } finally {
      setIsBuying(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      alert('Faça login para favoritar');
      return;
    }

    setIsTogglingFavorite(true);
    try {
      await toggleFavorite(productId, 'product');
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const navigateMedia = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setSelectedMediaIndex(i => (i === 0 ? media.length - 1 : i - 1));
    } else {
      setSelectedMediaIndex(i => (i === media.length - 1 ? 0 : i + 1));
    }
    setVideoPlaying(false);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-16">
        <Package className="w-16 h-16 mx-auto text-zinc-300 mb-4" />
        <p className="text-zinc-500 text-lg">Produto não encontrado</p>
        <button onClick={onBack} className="mt-4 text-pink-600 hover:underline">
          Voltar
        </button>
      </div>
    );
  }

  const currentMedia = media[selectedMediaIndex];
  const defaultImage = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800';
  const price = product.price;
  const originalPrice = product.original_price || price * 1.2;
  const rating = product.rating || 4.7;
  const totalReviews = product.total_reviews || 128;
  const salesCount = product.sales_count || 500;
  const discount = originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <button
        onClick={onBack}
        className="flex items-center text-sm text-zinc-500 hover:text-pink-600 transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" /> Voltar
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="aspect-square rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative group">
            {currentMedia?.type === 'video' ? (
              <div className="relative w-full h-full">
                <video
                  src={currentMedia.url}
                  className="w-full h-full object-cover"
                  controls={videoPlaying}
                  autoPlay={videoPlaying}
                  onClick={() => setVideoPlaying(!videoPlaying)}
                />
                {!videoPlaying && (
                  <button
                    onClick={() => setVideoPlaying(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black/30"
                  >
                    <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center">
                      <Play size={32} className="text-zinc-900 ml-1" />
                    </div>
                  </button>
                )}
              </div>
            ) : (
              <img
                src={currentMedia?.url || product.image || defaultImage}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={e => {
                  e.currentTarget.src = defaultImage;
                }}
              />
            )}

            {/* Navigation Arrows */}
            {media.length > 1 && (
              <>
                <button
                  onClick={() => navigateMedia('prev')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-zinc-900/90 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => navigateMedia('next')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-zinc-900/90 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={handleToggleFavorite}
                disabled={isTogglingFavorite}
                className={`p-3 rounded-full transition-colors ${isFav ? 'bg-rose-500 text-white' : 'bg-white/90 text-zinc-600 hover:bg-white'} disabled:opacity-50`}
              >
                <Bookmark size={20} className={isFav ? 'fill-white' : ''} />
              </button>
              <button className="p-3 rounded-full bg-white/90 text-zinc-600 hover:bg-white transition-colors">
                <Share2 size={20} />
              </button>
            </div>

            {/* Discount Badge */}
            {discount > 0 && (
              <div className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                -{discount}%
              </div>
            )}

            {/* Media Counter */}
            {media.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 text-white text-sm">
                {selectedMediaIndex + 1} / {media.length}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {media.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {media.map((m, index) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedMediaIndex(index);
                    setVideoPlaying(false);
                  }}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === selectedMediaIndex
                      ? 'border-pink-600 ring-2 ring-pink-600/20'
                      : 'border-transparent hover:border-zinc-300'
                  }`}
                >
                  {m.type === 'video' ? (
                    <div className="w-full h-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                      <Play size={20} className="text-zinc-500" />
                    </div>
                  ) : (
                    <img src={m.url} alt="" className="w-full h-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Product Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-pink-500 uppercase font-bold tracking-wider bg-pink-50 dark:bg-pink-900/20 px-2 py-1 rounded-full">
                {product.category}
              </span>
              {product.brand && (
                <span className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-1 rounded-full">
                  {product.brand}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{product.name}</h1>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="flex items-center gap-1 text-amber-500">
                <Star size={18} fill="currentColor" />
                <span className="font-bold">{rating.toFixed(1)}</span>
                <span className="text-zinc-500 text-sm">({totalReviews} avaliações)</span>
              </div>
              <div className="flex items-center gap-1 text-zinc-500">
                <Users size={18} />
                <span>{salesCount}+ vendidos</span>
              </div>
              {product.stock !== undefined && product.stock > 0 && (
                <div className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle size={18} />
                  <span>{product.stock} em estoque</span>
                </div>
              )}
            </div>

            {/* Seller Info */}
            {(product.store || product.seller) && (
              <div className="flex items-center gap-4 mt-6 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                {product.store?.logo_url || product.seller?.avatar_url ? (
                  <img
                    src={product.store?.logo_url || product.seller?.avatar_url}
                    alt=""
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                    <Store size={24} className="text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-lg">
                      {product.store?.name || product.seller?.name}
                    </p>
                    {product.seller?.type === 'BUSINESS' && (
                      <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-600 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                        <Building2 size={12} /> PRO
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-zinc-500">
                    {product.store?.rating && (
                      <span className="flex items-center gap-1">
                        <Star size={14} className="text-amber-400 fill-amber-400" />
                        {product.store.rating.toFixed(1)}
                      </span>
                    )}
                    {product.store?.total_sales && <span>{product.store.total_sales}+ vendas</span>}
                  </div>
                </div>
                <button
                  onClick={() => onNavigate?.(`STORE:${product.store?.id || product.created_by}`)}
                  className="px-4 py-2 border border-pink-600 text-pink-600 rounded-lg font-medium hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors flex items-center gap-2"
                >
                  <ExternalLink size={16} /> Ver Loja
                </button>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex gap-6">
              {(['about', 'specs', 'reviews'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 font-medium transition-colors ${activeTab === tab ? 'text-pink-600 border-b-2 border-pink-600' : 'text-zinc-500 hover:text-zinc-700'}`}
                >
                  {tab === 'about'
                    ? 'Descrição'
                    : tab === 'specs'
                      ? 'Especificações'
                      : 'Avaliações'}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <p className="text-zinc-600 dark:text-zinc-400 whitespace-pre-line leading-relaxed">
                {product.description ||
                  'Produto de alta qualidade com garantia de satisfação. Entre em contato para mais informações.'}
              </p>
              <div>
                <h3 className="font-bold text-lg mb-3">Benefícios</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    'Produto original com garantia',
                    'Entrega rápida e segura',
                    'Suporte ao cliente 24/7',
                    'Devolução em até 7 dias',
                    'Pagamento seguro',
                    'Qualidade verificada',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-zinc-600 dark:text-zinc-400">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {product.brand && (
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                    <p className="text-sm text-zinc-500">Marca</p>
                    <p className="font-medium">{product.brand}</p>
                  </div>
                )}
                {product.sku && (
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                    <p className="text-sm text-zinc-500">SKU</p>
                    <p className="font-medium">{product.sku}</p>
                  </div>
                )}
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                  <p className="text-sm text-zinc-500">Garantia</p>
                  <p className="font-medium">{product.warranty_months || 12} meses</p>
                </div>
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                  <p className="text-sm text-zinc-500">Categoria</p>
                  <p className="font-medium">{product.category}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                <div className="text-center">
                  <p className="text-4xl font-bold text-pink-600">{rating.toFixed(1)}</p>
                  <div className="flex items-center justify-center mt-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        size={14}
                        className={
                          s <= Math.round(rating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-zinc-300'
                        }
                      />
                    ))}
                  </div>
                  <p className="text-sm text-zinc-500 mt-1">{totalReviews} avaliações</p>
                </div>
              </div>
              <p className="text-zinc-500 text-center py-8">
                Avaliações dos clientes aparecerão aqui.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar - Purchase Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-pink-600">{formatPrice(price)}</span>
                {discount > 0 && (
                  <span className="text-lg text-zinc-400 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>
              {discount > 0 && (
                <span className="text-sm text-emerald-600 font-medium">
                  {discount}% de desconto
                </span>
              )}
              <p className="text-sm text-zinc-500 mt-1">
                ou 12x de {formatPrice(price / 12)} sem juros
              </p>
            </div>

            {/* Quantity */}
            <div>
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
                Quantidade
              </label>
              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1 w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Stock Status */}
            {product.stock !== undefined && (
              <div
                className={`flex items-center gap-2 ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}
              >
                {product.stock > 0 ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                <span className="text-sm font-medium">
                  {product.stock > 0 ? `${product.stock} em estoque` : 'Esgotado'}
                </span>
              </div>
            )}

            {/* Comprar Agora - Vai direto para checkout */}
            <button
              onClick={handleBuyNow}
              disabled={isBuying || product.stock === 0}
              className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-4 rounded-xl font-bold hover:from-pink-700 hover:to-rose-700 transition-all shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBuying ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <Zap size={18} />
                  Comprar Agora
                </>
              )}
            </button>

            {/* Adicionar à Bolsa - Apenas adiciona, não abre modal */}
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.stock === 0}
              className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                addedToCart || inBag
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-200 dark:border-emerald-800'
                  : 'border border-pink-600 text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isAddingToCart ? (
                <Loader2 size={18} className="animate-spin" />
              ) : addedToCart ? (
                <>
                  <CheckCircle size={18} />
                  Adicionado!
                </>
              ) : inBag ? (
                <>
                  <CheckCircle size={18} />
                  Na Bolsa
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  Adicionar à Bolsa
                </>
              )}
            </button>

            <p className="text-xs text-zinc-500 text-center">
              Garantia de 7 dias ou seu dinheiro de volta
            </p>

            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 space-y-3">
              <h4 className="font-medium">Este produto inclui:</h4>
              <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-emerald-500" /> Frete grátis acima de R$ 100
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-blue-500" /> Entrega em 3-5 dias úteis
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-purple-500" /> Garantia de{' '}
                  {product.warranty_months || 12} meses
                </div>
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-amber-500" /> Produto verificado
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
          <h2 className="text-xl font-bold mb-6">Produtos Relacionados</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map(p => (
              <button
                key={p.id}
                onClick={() => onNavigate?.(`PRODUCT:${p.id}`)}
                className="group text-left"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 mb-3">
                  <img
                    src={p.image || defaultImage}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <p className="font-medium text-sm line-clamp-2 group-hover:text-pink-600 transition-colors">
                  {p.name}
                </p>
                <p className="text-pink-600 font-bold mt-1">{formatPrice(p.price)}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
