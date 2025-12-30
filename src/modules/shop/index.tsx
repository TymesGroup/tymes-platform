import React, { useState } from 'react';
import { ProfileType } from '../../types';
import { ModuleSettings } from '../../components/shared/ModuleSettings';
import { useAuth } from '../../lib/AuthContext';

// Components
import { ShopStats } from './components/ShopStats';
import { ShopMarketplace } from './components/ShopMarketplace';
import { ShopInventory } from './components/ShopInventory';
import { ShopOrders } from './components/ShopOrders';
import { ShopCreateProduct } from './components/ShopCreateProduct';
import { ShopFavorites } from './components/ShopFavorites';
import { ShopOffers } from './components/ShopOffers';
import { ShopCart } from './components/ShopCart';
import { ProductDetails } from './components/ProductDetails';

interface ShopModuleProps {
  page: string;
  profile: ProfileType;
  onNavigate?: (page: string) => void;
}

export const ShopModule: React.FC<ShopModuleProps> = ({ page, profile, onNavigate }) => {
  const { user } = useAuth();
  const isBusiness = profile === ProfileType.BUSINESS;
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const handleBackToInventory = () => {
    onNavigate?.('INVENTORY');
  };

  const handleSaveProduct = (data: any) => {
    console.log('Saving product:', data);
    onNavigate?.('INVENTORY');
  };

  const handleNavigate = (targetPage: string) => {
    // Check if navigating to product details
    if (targetPage.startsWith('PRODUCT_DETAILS:')) {
      const productId = targetPage.split(':')[1];
      setSelectedProductId(productId);
      onNavigate?.('PRODUCT_DETAILS');
    } else {
      setSelectedProductId(null);
      onNavigate?.(targetPage);
    }
  };

  // If on product details page
  if (page === 'PRODUCT_DETAILS' && selectedProductId) {
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
      return <ShopFavorites userId={user?.id || ''} />;

    case 'CART':
      return <ShopCart onNavigate={handleNavigate} />;

    case 'OFFERS':
      return <ShopOffers profile={profile} userId={user?.id} />;

    case 'SETTINGS':
      return (
        <ModuleSettings title="Shop" moduleId="shop" onBack={() => onNavigate?.('OVERVIEW')} />
      );

    default:
      return <ShopStats profile={profile} />;
  }
};
