import React, { useState, useEffect } from 'react';
import { ProfileType } from '../../types';
import { ModuleSettings } from '../../components/shared/ModuleSettings';
import { useAuth } from '../../lib/AuthContext';

// Components
import { ShopStats } from './components/ShopStats';
import { ShopMarketplace } from './components/ShopMarketplace';
import { ShopInventory } from './components/ShopInventory';
import { ShopOrders } from './components/ShopOrders';
import { ShopCreateProduct } from './components/ShopCreateProduct';
import { ShopSaves } from './components/ShopSaves';
import { ShopOffers } from './components/ShopOffers';
import { ShopCart } from './components/ShopCart';
import { ProductDetails } from './components/ProductDetails';
import { StorePage } from './components/StorePage';
import { RecommendedPage } from './components/RecommendedPage';
import { FeaturedStoresPage } from './components/FeaturedStoresPage';

interface ShopModuleProps {
  page: string;
  profile: ProfileType;
  onNavigate?: (page: string) => void;
  itemId?: string; // ID from URL for product/store details
}

export const ShopModule: React.FC<ShopModuleProps> = ({ page, profile, onNavigate, itemId }) => {
  const { user } = useAuth();
  const isBusiness = profile === ProfileType.BUSINESS;
  const [selectedProductId, setSelectedProductId] = useState<string | null>(itemId || null);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  // Update selectedProductId when itemId changes from URL
  useEffect(() => {
    if (itemId && (page === 'PRODUCT_DETAILS' || page === 'PRODUCT')) {
      setSelectedProductId(itemId);
    } else if (itemId && page === 'STORE') {
      setSelectedStoreId(itemId);
    }
  }, [itemId, page]);

  const handleBackToInventory = () => {
    onNavigate?.('INVENTORY');
  };

  const handleSaveProduct = (data: any) => {
    console.log('Saving product:', data);
    onNavigate?.('INVENTORY');
  };

  const handleNavigate = (targetPage: string) => {
    // Check if navigating to product details
    if (targetPage.startsWith('PRODUCT_DETAILS:') || targetPage.startsWith('PRODUCT:')) {
      const productId = targetPage.split(':')[1];
      setSelectedProductId(productId);
      setSelectedStoreId(null);
      // Pass the full page with ID to generate correct URL
      onNavigate?.(targetPage);
    } else if (targetPage.startsWith('STORE:')) {
      const storeId = targetPage.split(':')[1];
      setSelectedStoreId(storeId);
      setSelectedProductId(null);
      onNavigate?.(targetPage);
    } else {
      setSelectedProductId(null);
      setSelectedStoreId(null);
      onNavigate?.(targetPage);
    }
  };

  // If on store page
  if (page === 'STORE' && selectedStoreId) {
    return (
      <StorePage
        storeId={selectedStoreId}
        onBack={() => onNavigate?.('VITRINE')}
        onNavigate={handleNavigate}
      />
    );
  }

  // If on product details page (from URL or internal navigation)
  if ((page === 'PRODUCT_DETAILS' || page === 'PRODUCT') && selectedProductId) {
    return (
      <ProductDetails
        productId={selectedProductId}
        onBack={() => onNavigate?.('VITRINE')}
        onNavigate={handleNavigate}
      />
    );
  }

  switch (page) {
    case 'OVERVIEW':
      return <ShopStats profile={profile} />;

    case 'VITRINE':
      return <ShopMarketplace profile={profile} userId={user?.id} onNavigate={handleNavigate} />;

    case 'INVENTORY':
      // Only BUSINESS accounts can access inventory
      if (!isBusiness) {
        return <ShopMarketplace profile={profile} userId={user?.id} onNavigate={handleNavigate} />;
      }
      return <ShopInventory userId={user?.id || ''} onNavigate={handleNavigate} />;

    case 'CREATE_PRODUCT':
      // Only BUSINESS accounts can create products
      if (!isBusiness) {
        return <ShopMarketplace profile={profile} userId={user?.id} onNavigate={handleNavigate} />;
      }
      return (
        <ShopCreateProduct
          onBack={handleBackToInventory}
          onSave={handleSaveProduct}
          userId={user?.id || ''}
        />
      );

    case 'ORDERS':
      return <ShopOrders profile={profile} userId={user?.id || ''} />;

    case 'FAVORITES':
    case 'SAVES':
      return <ShopSaves userId={user?.id || ''} />;

    case 'BAG':
      return <ShopCart onNavigate={handleNavigate} />;

    case 'OFFERS':
      return <ShopOffers profile={profile} userId={user?.id} onNavigate={handleNavigate} />;

    case 'RECOMMENDED':
      return <RecommendedPage onNavigate={handleNavigate} />;

    case 'FEATURED_STORES':
      return <FeaturedStoresPage onNavigate={handleNavigate} />;

    case 'SETTINGS':
      return (
        <ModuleSettings title="Shop" moduleId="shop" onBack={() => onNavigate?.('OVERVIEW')} />
      );

    default:
      return <ShopStats profile={profile} />;
  }
};
