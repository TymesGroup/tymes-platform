import React from 'react';
import { ProfileType } from '../../types';
import { SocialFeed } from './components/SocialFeed';
import { SocialOverview } from './components/SocialOverview';
import { SocialConnections } from './components/SocialConnections';
import { SocialMessages } from './components/SocialMessages';
import { SocialNotifications } from './components/SocialNotifications';
import { PublicProfile } from './components/PublicProfile';
import { ModuleSettings } from '../../components/shared/ModuleSettings';

interface SocialModuleProps {
  page: string;
  profile?: ProfileType;
  onNavigate?: (page: string) => void;
  userId?: string;
  itemId?: string; // For consistency with other modules
}

export const SocialModule: React.FC<SocialModuleProps> = ({
  page,
  profile = ProfileType.PERSONAL,
  onNavigate,
  userId,
  itemId,
}) => {
  switch (page) {
    case 'OVERVIEW':
      return <SocialOverview />;
    case 'FEED':
      return <SocialFeed profile={profile} />;
    case 'CONNECTIONS':
      return <SocialConnections />;
    case 'MESSAGES':
      return <SocialMessages />;
    case 'NOTIFICATIONS':
      return <SocialNotifications />;
    case 'PROFILE':
      return <PublicProfile userId={userId} onBack={() => onNavigate?.('FEED')} />;
    case 'SETTINGS':
      return (
        <ModuleSettings title="Social" moduleId="social" onBack={() => onNavigate?.('OVERVIEW')} />
      );
    default:
      return <SocialOverview />;
  }
};
