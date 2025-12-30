import { supabase } from '../../../lib/supabase';
import { Tables, TablesInsert } from '../../../types/database.types';

export type Product = Tables<'products'>;
export type Store = Tables<'stores'>;
export type CartItem = Tables<'cart_items'>;
export type Favorite = Tables<'favorites'>;
export type Order = Tables<'orders'>;
export type OrderItem = Tables<'order_items'>;
export type ProductReview = Tables<'product_reviews'>;

export interface CartItemWithProduct extends CartItem {
  product: Product;
}

export interface OrderWithItems extends Order {
  order_items: (OrderItem & { product: Product | null })[];
}

// ============ PRODUCTS ============
export const productService = {
  async getAll(filters?: { category?: string; status?: string; storeId?: string }) {
    let query = supabase.from('products').select('*').order('created_at', { ascending: false });

    if (filters?.category) query = query.eq('category', filters.category);
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.storeId) query = query.eq('store_id', filters.storeId);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*, store:stores(*)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('created_by', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async create(product: TablesInsert<'products'>) {
    const { data, error } = await supabase.from('products').insert(product).select().single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  },

  async search(term: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${term}%,description.ilike.%${term}%`)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
};

// ============ STORES ============
export const storeService = {
  async getAll() {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('status', 'active')
      .order('rating', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('stores')
      .select('*, products(*)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async getByOwner(ownerId: string) {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('owner_id', ownerId)
      .single();
    if (error) return null;
    return data;
  },

  async create(store: TablesInsert<'stores'>) {
    const { data, error } = await supabase.from('stores').insert(store).select().single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Store>) {
    const { data, error } = await supabase
      .from('stores')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ============ CART ============
export const cartService = {
  async getItems(userId: string): Promise<CartItemWithProduct[]> {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as CartItemWithProduct[];
  },

  async addItem(userId: string, productId: string, quantity = 1) {
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (existing) {
      return this.updateQuantity(existing.id, (existing.quantity || 0) + quantity);
    }

    const { data, error } = await supabase
      .from('cart_items')
      .insert({ user_id: userId, product_id: productId, quantity })
      .select('*, product:products(*)')
      .single();
    if (error) throw error;
    return data;
  },

  async updateQuantity(itemId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeItem(itemId);
    }
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq('id', itemId)
      .select('*, product:products(*)')
      .single();
    if (error) throw error;
    return data;
  },

  async removeItem(itemId: string) {
    const { error } = await supabase.from('cart_items').delete().eq('id', itemId);
    if (error) throw error;
  },

  async clearCart(userId: string) {
    const { error } = await supabase.from('cart_items').delete().eq('user_id', userId);
    if (error) throw error;
  },

  async getCount(userId: string) {
    const { count, error } = await supabase
      .from('cart_items')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    if (error) throw error;
    return count || 0;
  },
};

// ============ FAVORITES ============
export const favoriteService = {
  async getAll(userId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .select('*, product:products(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async add(userId: string, productId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, product_id: productId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(userId: string, productId: string) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
    if (error) throw error;
  },

  async isFavorite(userId: string, productId: string) {
    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();
    return !!data;
  },

  async toggle(userId: string, productId: string) {
    const isFav = await this.isFavorite(userId, productId);
    if (isFav) {
      await this.remove(userId, productId);
      return false;
    } else {
      await this.add(userId, productId);
      return true;
    }
  },
};

// ============ ORDERS ============
export const orderService = {
  async getByUser(userId: string): Promise<OrderWithItems[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, product:products(*))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as OrderWithItems[];
  },

  async getBySeller(userId: string): Promise<OrderWithItems[]> {
    const { data: store } = await supabase
      .from('stores')
      .select('id')
      .eq('owner_id', userId)
      .single();

    if (!store) return [];

    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, product:products(*))')
      .eq('store_id', store.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as OrderWithItems[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, product:products(*))')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async createFromCart(userId: string, shippingAddress: object, paymentMethod: string) {
    const cartItems = await cartService.getItems(userId);
    if (cartItems.length === 0) throw new Error('Carrinho vazio');

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.product.price * (item.quantity || 1),
      0
    );

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity || 1,
      unit_price: item.product.price,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) throw itemsError;

    await cartService.clearCart(userId);
    return order;
  },

  async updateStatus(orderId: string, status: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ============ REVIEWS ============
export const reviewService = {
  async getByProduct(productId: string) {
    const { data, error } = await supabase
      .from('product_reviews')
      .select('*, user:profiles(name, avatar_url)')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async create(review: TablesInsert<'product_reviews'>) {
    const { data, error } = await supabase.from('product_reviews').insert(review).select().single();
    if (error) throw error;

    // Atualizar rating do produto
    await this.updateProductRating(review.product_id);
    return data;
  },

  async updateProductRating(productId: string) {
    const { data: reviews } = await supabase
      .from('product_reviews')
      .select('rating')
      .eq('product_id', productId);

    if (reviews && reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await supabase
        .from('products')
        .update({ rating: avgRating, total_reviews: reviews.length })
        .eq('id', productId);
    }
  },
};

// ============ PRODUCT MEDIA ============
export const productMediaService = {
  async getByProduct(productId: string) {
    const { data, error } = await supabase
      .from('product_media')
      .select('*')
      .eq('product_id', productId)
      .order('position');
    if (error) throw error;
    return data;
  },

  async add(
    productId: string,
    url: string,
    type: 'image' | 'video',
    position = 0,
    isPrimary = false
  ) {
    // If setting as primary, unset other primaries first
    if (isPrimary) {
      await supabase
        .from('product_media')
        .update({ is_primary: false })
        .eq('product_id', productId);
    }

    const { data, error } = await supabase
      .from('product_media')
      .insert({ product_id: productId, url, type, position, is_primary: isPrimary })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(
    id: string,
    updates: { url?: string; position?: number; alt_text?: string; is_primary?: boolean }
  ) {
    const { data, error } = await supabase
      .from('product_media')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from('product_media').delete().eq('id', id);
    if (error) throw error;
  },

  async reorder(productId: string, mediaIds: string[]) {
    const updates = mediaIds.map((id, index) =>
      supabase.from('product_media').update({ position: index }).eq('id', id)
    );
    await Promise.all(updates);
  },
};

// ============ PRODUCT SPECIFICATIONS ============
export const productSpecService = {
  async getByProduct(productId: string) {
    const { data, error } = await supabase
      .from('product_specifications')
      .select('*')
      .eq('product_id', productId)
      .order('position');
    if (error) throw error;
    return data;
  },

  async add(productId: string, name: string, value: string, groupName = 'Geral', position = 0) {
    const { data, error } = await supabase
      .from('product_specifications')
      .insert({ product_id: productId, name, value, group_name: groupName, position })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(
    id: string,
    updates: { name?: string; value?: string; group_name?: string; position?: number }
  ) {
    const { data, error } = await supabase
      .from('product_specifications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from('product_specifications').delete().eq('id', id);
    if (error) throw error;
  },

  async bulkAdd(productId: string, specs: { name: string; value: string; group_name?: string }[]) {
    const items = specs.map((spec, index) => ({
      product_id: productId,
      name: spec.name,
      value: spec.value,
      group_name: spec.group_name || 'Geral',
      position: index,
    }));
    const { data, error } = await supabase.from('product_specifications').insert(items).select();
    if (error) throw error;
    return data;
  },
};

// ============ PRODUCT VARIATIONS ============
export const productVariationService = {
  async getByProduct(productId: string) {
    const { data, error } = await supabase
      .from('product_variations')
      .select('*')
      .eq('product_id', productId);
    if (error) throw error;
    return data;
  },

  async add(
    productId: string,
    variation: {
      name: string;
      value: string;
      price_modifier?: number;
      stock?: number;
      sku?: string;
      image_url?: string;
    }
  ) {
    const { data, error } = await supabase
      .from('product_variations')
      .insert({ product_id: productId, ...variation })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(
    id: string,
    updates: Partial<{
      name: string;
      value: string;
      price_modifier: number;
      stock: number;
      sku: string;
      image_url: string;
      is_available: boolean;
    }>
  ) {
    const { data, error } = await supabase
      .from('product_variations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from('product_variations').delete().eq('id', id);
    if (error) throw error;
  },

  async bulkAdd(
    productId: string,
    variations: {
      name: string;
      value: string;
      price_modifier?: number;
      stock?: number;
      sku?: string;
    }[]
  ) {
    const items = variations.map(v => ({ product_id: productId, ...v }));
    const { data, error } = await supabase.from('product_variations').insert(items).select();
    if (error) throw error;
    return data;
  },
};

// ============ PRODUCT QUESTIONS ============
export const productQuestionService = {
  async getByProduct(productId: string) {
    const { data, error } = await supabase
      .from('product_questions')
      .select('*, user:profiles!product_questions_user_id_fkey(name, avatar_url)')
      .eq('product_id', productId)
      .eq('is_public', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async ask(productId: string, userId: string, question: string) {
    const { data, error } = await supabase
      .from('product_questions')
      .insert({ product_id: productId, user_id: userId, question })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async answer(questionId: string, answeredBy: string, answer: string) {
    const { data, error } = await supabase
      .from('product_questions')
      .update({
        answer,
        answered_by: answeredBy,
        answered_at: new Date().toISOString(),
      })
      .eq('id', questionId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(questionId: string) {
    const { error } = await supabase.from('product_questions').delete().eq('id', questionId);
    if (error) throw error;
  },

  async getUnanswered(sellerId: string) {
    // Get all products by this seller
    const { data: products } = await supabase
      .from('products')
      .select('id')
      .eq('created_by', sellerId);

    if (!products?.length) return [];

    const productIds = products.map(p => p.id);

    const { data, error } = await supabase
      .from('product_questions')
      .select('*, user:profiles!product_questions_user_id_fkey(name), product:products(name)')
      .in('product_id', productIds)
      .is('answer', null)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },
};

// ============ REVIEW HELPFUL VOTES ============
export const reviewVoteService = {
  async vote(reviewId: string, userId: string) {
    const { data, error } = await supabase
      .from('review_helpful_votes')
      .insert({ review_id: reviewId, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async unvote(reviewId: string, userId: string) {
    const { error } = await supabase
      .from('review_helpful_votes')
      .delete()
      .eq('review_id', reviewId)
      .eq('user_id', userId);
    if (error) throw error;
  },

  async hasVoted(reviewId: string, userId: string) {
    const { data } = await supabase
      .from('review_helpful_votes')
      .select('id')
      .eq('review_id', reviewId)
      .eq('user_id', userId)
      .single();
    return !!data;
  },

  async toggle(reviewId: string, userId: string) {
    const hasVoted = await this.hasVoted(reviewId, userId);
    if (hasVoted) {
      await this.unvote(reviewId, userId);
      return false;
    } else {
      await this.vote(reviewId, userId);
      return true;
    }
  },
};

// ============ PRODUCT ANALYTICS ============
export const productAnalyticsService = {
  async incrementViews(productId: string) {
    await supabase.rpc('increment_product_views', { p_product_id: productId });
  },

  async getStats(productId: string) {
    const { data, error } = await supabase
      .from('products')
      .select('views_count, sales_count, rating, total_reviews')
      .eq('id', productId)
      .single();
    if (error) throw error;
    return data;
  },

  async getSellerStats(sellerId: string) {
    const { data: products } = await supabase
      .from('products')
      .select('id, views_count, sales_count, rating, total_reviews')
      .eq('created_by', sellerId);

    if (!products?.length) return { totalViews: 0, totalSales: 0, avgRating: 0, totalReviews: 0 };

    return {
      totalViews: products.reduce((sum, p) => sum + (p.views_count || 0), 0),
      totalSales: products.reduce((sum, p) => sum + (p.sales_count || 0), 0),
      avgRating:
        products.filter(p => p.rating).reduce((sum, p) => sum + (p.rating || 0), 0) /
          products.filter(p => p.rating).length || 0,
      totalReviews: products.reduce((sum, p) => sum + (p.total_reviews || 0), 0),
    };
  },
};
