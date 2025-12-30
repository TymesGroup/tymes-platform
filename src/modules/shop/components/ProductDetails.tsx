import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
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
  Pause,
  MessageSquare,
  ThumbsUp,
  Package,
  Clock,
  Award,
  CheckCircle,
  AlertCircle,
  Building2,
  MapPin,
  Send,
  X,
  ZoomIn,
  ExternalLink,
  Tag,
  Layers,
  Info,
  ChevronDown,
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useCart } from '../../../lib/CartContext';
import { useFavorites } from '../../../lib/FavoritesContext';
import { useAuth } from '../../../lib/AuthContext';

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

interface ProductSpec {
  id: string;
  name: string;
  value: string;
  group_name: string;
}

interface ProductVariation {
  id: string;
  name: string;
  value: string;
  price_modifier: number;
  stock: number;
  sku?: string;
  image_url?: string;
  is_available: boolean;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  images?: string[];
  helpful_count: number;
  verified_purchase: boolean;
  created_at: string;
  user: { id: string; name: string; avatar_url?: string };
}

interface Question {
  id: string;
  question: string;
  answer?: string;
  answered_at?: string;
  created_at: string;
  user: { name: string };
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
  category: string;
  image?: string;
  stock?: number;
  rating?: number;
  total_reviews?: number;
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: { width: number; height: number; depth: number };
  warranty_months?: number;
  views_count?: number;
  sales_count?: number;
  tags?: string[];
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
  const { user } = useAuth();
  const { addItem, openCart } = useCart();
  const { isFavorited, toggleFavorite } = useFavorites();

  // State
  const [product, setProduct] = useState<Product | null>(null);
  const [media, setMedia] = useState<ProductMedia[]>([]);
  const [specs, setSpecs] = useState<ProductSpec[]>([]);
  const [variations, setVariations] = useState<ProductVariation[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [storeProducts, setStoreProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // UI State
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews' | 'questions'>(
    'description'
  );
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [expandedSpecs, setExpandedSpecs] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const isFav = isFavorited(productId);

  // Load all product data
  const loadProductData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch product with store and seller info
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

      // Fetch specifications
      const { data: specsData } = await supabase
        .from('product_specifications')
        .select('*')
        .eq('product_id', productId)
        .order('position');
      setSpecs(specsData || []);

      // Fetch variations
      const { data: variationsData } = await supabase
        .from('product_variations')
        .select('*')
        .eq('product_id', productId);
      setVariations(variationsData || []);

      // Fetch reviews with user info
      const { data: reviewsData } = await supabase
        .from('product_reviews')
        .select(
          `
                    *,
                    user:profiles!product_reviews_user_id_fkey(id, name, avatar_url)
                `
        )
        .eq('product_id', productId)
        .order('created_at', { ascending: false })
        .limit(10);
      setReviews(reviewsData || []);

      // Fetch questions
      const { data: questionsData } = await supabase
        .from('product_questions')
        .select(
          `
                    *,
                    user:profiles!product_questions_user_id_fkey(name)
                `
        )
        .eq('product_id', productId)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(10);
      setQuestions(questionsData || []);

      // Fetch similar products (same category)
      if (productData?.category) {
        const { data: similarData } = await supabase
          .from('products')
          .select('id, name, price, image, rating, total_reviews, category')
          .eq('category', productData.category)
          .neq('id', productId)
          .eq('status', 'active')
          .limit(8);
        setSimilarProducts(similarData || []);
      }

      // Fetch store products
      if (productData?.store_id) {
        const { data: storeData } = await supabase
          .from('products')
          .select('id, name, price, image, rating, total_reviews, category')
          .eq('store_id', productData.store_id)
          .neq('id', productId)
          .eq('status', 'active')
          .limit(8);
        setStoreProducts(storeData || []);
      } else if (productData?.created_by) {
        const { data: sellerData } = await supabase
          .from('products')
          .select('id, name, price, image, rating, total_reviews, category')
          .eq('created_by', productData.created_by)
          .neq('id', productId)
          .eq('status', 'active')
          .limit(8);
        setStoreProducts(sellerData || []);
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

  // Handlers
  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await addItem(productId, quantity);
      openCart();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao adicionar ao carrinho');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      await toggleFavorite(productId);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao favoritar');
    }
  };

  const handleAskQuestion = async () => {
    if (!newQuestion.trim() || !user) return;
    try {
      await supabase.from('product_questions').insert({
        product_id: productId,
        user_id: user.id,
        question: newQuestion.trim(),
      });
      setNewQuestion('');
      loadProductData();
    } catch (error) {
      console.error('Error asking question:', error);
    }
  };

  const handleVoteHelpful = async (reviewId: string) => {
    if (!user) return;
    try {
      await supabase.from('review_helpful_votes').insert({
        review_id: reviewId,
        user_id: user.id,
      });
      loadProductData();
    } catch (error) {
      console.error('Error voting:', error);
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

  const calculateFinalPrice = () => {
    let price = product?.price || 0;
    Object.entries(selectedVariations).forEach(([name, value]) => {
      const variation = variations.find(v => v.name === name && v.value === value);
      if (variation) price += variation.price_modifier;
    });
    return price;
  };

  const groupedVariations = variations.reduce(
    (acc, v) => {
      if (!acc[v.name]) acc[v.name] = [];
      acc[v.name].push(v);
      return acc;
    },
    {} as Record<string, ProductVariation[]>
  );

  const groupedSpecs = specs.reduce(
    (acc, s) => {
      if (!acc[s.group_name]) acc[s.group_name] = [];
      acc[s.group_name].push(s);
      return acc;
    },
    {} as Record<string, ProductSpec[]>
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage:
      reviews.length > 0
        ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100
        : 0,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-16">
        <Package className="w-16 h-16 mx-auto text-zinc-300 mb-4" />
        <p className="text-zinc-500 text-lg">Produto não encontrado</p>
        <button onClick={onBack} className="mt-4 text-indigo-600 hover:underline">
          Voltar
        </button>
      </div>
    );
  }

  const currentMedia = media[selectedMediaIndex];
  const finalPrice = calculateFinalPrice();
  const defaultImage = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800';

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={18} /> Voltar para vitrine
      </button>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
        {/* Left: Media Gallery */}
        <div className="space-y-4">
          {/* Main Image/Video */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 group">
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
                alt={currentMedia?.alt_text || product.name}
                className="w-full h-full object-cover cursor-zoom-in"
                onClick={() => setShowImageModal(true)}
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
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-zinc-900/90 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => navigateMedia('next')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-zinc-900/90 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Zoom Button */}
            <button
              onClick={() => setShowImageModal(true)}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-zinc-900/90 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ZoomIn size={20} />
            </button>

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
                      ? 'border-indigo-600 ring-2 ring-indigo-600/20'
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
        </div>

        {/* Right: Product Info */}
        <div className="space-y-6">
          {/* Category & Brand */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs text-indigo-600 uppercase font-bold tracking-wider bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-full">
              {product.category}
            </span>
            {product.brand && (
              <span className="text-xs text-zinc-500 uppercase font-medium">{product.brand}</span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl lg:text-3xl font-bold text-zinc-900 dark:text-white leading-tight">
            {product.name}
          </h1>

          {/* Rating & Stats */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  size={18}
                  className={
                    star <= (product.rating || 0)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-zinc-300'
                  }
                />
              ))}
              <span className="ml-2 text-sm font-medium">
                {product.rating?.toFixed(1) || '0.0'}
              </span>
            </div>
            <span className="text-sm text-zinc-500">({product.total_reviews || 0} avaliações)</span>
            {product.sales_count && product.sales_count > 0 && (
              <span className="text-sm text-emerald-600 font-medium">
                {product.sales_count}+ vendidos
              </span>
            )}
          </div>

          {/* Price */}
          <div className="bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-800/50 dark:to-zinc-800 rounded-2xl p-5">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-indigo-600">{formatPrice(finalPrice)}</span>
              {finalPrice !== product.price && (
                <span className="text-lg text-zinc-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            <p className="text-sm text-emerald-600 mt-1 font-medium">
              ou 12x de {formatPrice(finalPrice / 12)} sem juros
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              à vista com 5% de desconto: {formatPrice(finalPrice * 0.95)}
            </p>
          </div>

          {/* Variations */}
          {Object.keys(groupedVariations).length > 0 && (
            <div className="space-y-4">
              {Object.entries(groupedVariations).map(([name, options]) => (
                <div key={name}>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
                    {name}:{' '}
                    <span className="text-indigo-600">
                      {selectedVariations[name] || 'Selecione'}
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {options.map(option => (
                      <button
                        key={option.id}
                        onClick={() =>
                          setSelectedVariations(prev => ({ ...prev, [name]: option.value }))
                        }
                        disabled={!option.is_available}
                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                          selectedVariations[name] === option.value
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600'
                            : option.is_available
                              ? 'border-zinc-200 dark:border-zinc-700 hover:border-indigo-300'
                              : 'border-zinc-100 text-zinc-300 cursor-not-allowed line-through'
                        }`}
                      >
                        {option.value}
                        {option.price_modifier !== 0 && (
                          <span className="ml-1 text-xs">
                            ({option.price_modifier > 0 ? '+' : ''}
                            {formatPrice(option.price_modifier)})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity & Stock */}
          <div className="flex items-center gap-6">
            <div>
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
                Quantidade
              </label>
              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="w-14 text-center font-bold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
            {product.stock !== null && product.stock !== undefined && (
              <div
                className={`flex items-center gap-2 ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}
              >
                {product.stock > 0 ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                <span className="text-sm font-medium">
                  {product.stock > 0 ? `${product.stock} em estoque` : 'Esgotado'}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.stock === 0}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAddingToCart ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
              ) : (
                <>
                  <ShoppingCart size={22} />
                  Adicionar ao Carrinho
                </>
              )}
            </button>
            <button
              onClick={handleToggleFavorite}
              className={`p-4 rounded-xl border-2 transition-all ${
                isFav
                  ? 'bg-rose-50 border-rose-200 text-rose-500 dark:bg-rose-900/20 dark:border-rose-800'
                  : 'border-zinc-200 dark:border-zinc-700 hover:border-rose-300 hover:text-rose-500'
              }`}
            >
              <Heart size={22} className={isFav ? 'fill-rose-500' : ''} />
            </button>
            <button className="p-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-indigo-300 transition-all">
              <Share2 size={22} />
            </button>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/10">
              <Truck size={20} className="text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  Frete Grátis
                </p>
                <p className="text-xs text-emerald-600/70">Acima de R$ 100</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/10">
              <Shield size={20} className="text-indigo-600" />
              <div>
                <p className="text-sm font-medium text-indigo-700 dark:text-indigo-400">Garantia</p>
                <p className="text-xs text-indigo-600/70">{product.warranty_months || 12} meses</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10">
              <Clock size={20} className="text-amber-600" />
              <div>
                <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                  Entrega Rápida
                </p>
                <p className="text-xs text-amber-600/70">3-5 dias úteis</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/10">
              <Award size={20} className="text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-400">
                  Qualidade
                </p>
                <p className="text-xs text-purple-600/70">Produto verificado</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Store/Seller Info */}
      {(product.store || product.seller) && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {product.store?.logo_url || product.seller?.avatar_url ? (
                <img
                  src={product.store?.logo_url || product.seller?.avatar_url}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Store size={28} className="text-white" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-white">
                    {product.store?.name || product.seller?.name}
                  </h3>
                  {product.seller?.type === 'BUSINESS' && (
                    <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <Building2 size={12} /> PRO
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-zinc-500">
                  {product.store?.rating && (
                    <span className="flex items-center gap-1">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      {product.store.rating.toFixed(1)}
                    </span>
                  )}
                  {product.store?.total_sales && <span>{product.store.total_sales}+ vendas</span>}
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate?.(`STORE:${product.store?.id || product.created_by}`)}
              className="px-5 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 text-indigo-600 font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors flex items-center gap-2"
            >
              Ver Loja <ExternalLink size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex gap-1 overflow-x-auto">
          {[
            { id: 'description', label: 'Descrição', icon: Info },
            { id: 'specs', label: 'Especificações', icon: Layers },
            { id: 'reviews', label: `Avaliações (${reviews.length})`, icon: Star },
            { id: 'questions', label: `Perguntas (${questions.length})`, icon: MessageSquare },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-zinc-500 hover:text-zinc-700'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
        {/* Description Tab */}
        {activeTab === 'description' && (
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap leading-relaxed">
              {product.description || 'Sem descrição disponível.'}
            </p>
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <Tag size={16} className="text-zinc-400" />
                {product.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === 'specs' && (
          <div className="space-y-6">
            {Object.keys(groupedSpecs).length > 0 ? (
              Object.entries(groupedSpecs).map(([group, items]) => (
                <div key={group}>
                  <button
                    onClick={() => setExpandedSpecs(!expandedSpecs)}
                    className="flex items-center justify-between w-full text-left mb-3"
                  >
                    <h3 className="font-bold text-zinc-900 dark:text-white">{group}</h3>
                    <ChevronDown
                      size={20}
                      className={`transition-transform ${expandedSpecs ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {expandedSpecs && (
                    <div className="space-y-2">
                      {items.map(spec => (
                        <div
                          key={spec.id}
                          className="flex justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                        >
                          <span className="text-zinc-500">{spec.name}</span>
                          <span className="font-medium text-zinc-900 dark:text-white">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="space-y-2">
                {product.brand && (
                  <div className="flex justify-between py-3 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-500">Marca</span>
                    <span className="font-medium">{product.brand}</span>
                  </div>
                )}
                {product.sku && (
                  <div className="flex justify-between py-3 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-500">SKU</span>
                    <span className="font-medium">{product.sku}</span>
                  </div>
                )}
                {product.weight && (
                  <div className="flex justify-between py-3 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-500">Peso</span>
                    <span className="font-medium">{product.weight} kg</span>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex justify-between py-3 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-500">Dimensões</span>
                    <span className="font-medium">
                      {product.dimensions.width} x {product.dimensions.height} x{' '}
                      {product.dimensions.depth} cm
                    </span>
                  </div>
                )}
                {product.warranty_months && (
                  <div className="flex justify-between py-3">
                    <span className="text-zinc-500">Garantia</span>
                    <span className="font-medium">{product.warranty_months} meses</span>
                  </div>
                )}
                {!product.brand && !product.sku && !product.weight && !product.dimensions && (
                  <p className="text-zinc-500 text-center py-8">
                    Nenhuma especificação disponível.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-8">
            {/* Rating Summary */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-6xl font-bold text-zinc-900 dark:text-white">
                  {product.rating?.toFixed(1) || '0.0'}
                </div>
                <div className="flex justify-center gap-1 my-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      size={24}
                      className={
                        star <= (product.rating || 0)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-zinc-300'
                      }
                    />
                  ))}
                </div>
                <p className="text-zinc-500">{product.total_reviews || 0} avaliações</p>
              </div>
              <div className="space-y-2">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm w-8">{rating}★</span>
                    <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-zinc-500 w-8">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            {reviews.length > 0 ? (
              <div className="space-y-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                {reviews.map(review => (
                  <div
                    key={review.id}
                    className="pb-6 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                  >
                    <div className="flex items-start gap-4">
                      {review.user?.avatar_url ? (
                        <img
                          src={review.user.avatar_url}
                          alt=""
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                          <span className="font-bold text-indigo-600">
                            {review.user?.name?.[0] || 'U'}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-medium">{review.user?.name || 'Usuário'}</span>
                          {review.verified_purchase && (
                            <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle size={12} /> Compra verificada
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                size={14}
                                className={
                                  star <= review.rating
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-zinc-300'
                                }
                              />
                            ))}
                          </div>
                          <span className="text-xs text-zinc-500">
                            {new Date(review.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                            {review.comment}
                          </p>
                        )}
                        {review.images && review.images.length > 0 && (
                          <div className="flex gap-2 mt-3">
                            {review.images.map((img, i) => (
                              <img
                                key={i}
                                src={img}
                                alt=""
                                className="w-20 h-20 rounded-lg object-cover"
                              />
                            ))}
                          </div>
                        )}
                        <button
                          onClick={() => handleVoteHelpful(review.id)}
                          className="flex items-center gap-2 mt-3 text-sm text-zinc-500 hover:text-indigo-600 transition-colors"
                        >
                          <ThumbsUp size={14} />
                          Útil ({review.helpful_count || 0})
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500 text-center py-8">
                Este produto ainda não possui avaliações.
              </p>
            )}
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div className="space-y-6">
            {/* Ask Question */}
            {user && (
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newQuestion}
                  onChange={e => setNewQuestion(e.target.value)}
                  placeholder="Faça uma pergunta sobre este produto..."
                  className="flex-1 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  onClick={handleAskQuestion}
                  disabled={!newQuestion.trim()}
                  className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Send size={18} /> Enviar
                </button>
              </div>
            )}

            {/* Questions List */}
            {questions.length > 0 ? (
              <div className="space-y-4">
                {questions.map(q => (
                  <div key={q.id} className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                    <div className="flex items-start gap-3">
                      <MessageSquare size={18} className="text-indigo-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-zinc-900 dark:text-white">{q.question}</p>
                        <p className="text-xs text-zinc-500 mt-1">
                          {q.user?.name} • {new Date(q.created_at).toLocaleDateString('pt-BR')}
                        </p>
                        {q.answer && (
                          <div className="mt-3 pl-4 border-l-2 border-indigo-200 dark:border-indigo-800">
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">{q.answer}</p>
                            <p className="text-xs text-zinc-500 mt-1">
                              Resposta do vendedor •{' '}
                              {q.answered_at && new Date(q.answered_at).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500 text-center py-8">
                Nenhuma pergunta ainda. Seja o primeiro a perguntar!
              </p>
            )}
          </div>
        )}
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Layers size={22} className="text-indigo-600" />
            Produtos Similares
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similarProducts.slice(0, 4).map(p => (
              <button
                key={p.id}
                onClick={() => onNavigate?.(`PRODUCT_DETAILS:${p.id}`)}
                className="group bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-indigo-300 transition-all text-left"
              >
                <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <img
                    src={p.image || defaultImage}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={e => {
                      e.currentTarget.src = defaultImage;
                    }}
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm line-clamp-2 text-zinc-900 dark:text-white">
                    {p.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs text-zinc-500">{p.rating?.toFixed(1) || '0.0'}</span>
                  </div>
                  <p className="font-bold text-indigo-600 mt-2">{formatPrice(p.price)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Store Products */}
      {storeProducts.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Store size={22} className="text-indigo-600" />
            Mais produtos desta loja
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {storeProducts.slice(0, 4).map(p => (
              <button
                key={p.id}
                onClick={() => onNavigate?.(`PRODUCT_DETAILS:${p.id}`)}
                className="group bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-indigo-300 transition-all text-left"
              >
                <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <img
                    src={p.image || defaultImage}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={e => {
                      e.currentTarget.src = defaultImage;
                    }}
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm line-clamp-2 text-zinc-900 dark:text-white">
                    {p.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs text-zinc-500">{p.rating?.toFixed(1) || '0.0'}</span>
                  </div>
                  <p className="font-bold text-indigo-600 mt-2">{formatPrice(p.price)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && currentMedia?.type === 'image' && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X size={24} />
          </button>
          {media.length > 1 && (
            <>
              <button
                onClick={e => {
                  e.stopPropagation();
                  navigateMedia('prev');
                }}
                className="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={e => {
                  e.stopPropagation();
                  navigateMedia('next');
                }}
                className="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}
          <img
            src={currentMedia.url}
            alt={currentMedia.alt_text || product.name}
            className="max-w-full max-h-[90vh] object-contain"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};
