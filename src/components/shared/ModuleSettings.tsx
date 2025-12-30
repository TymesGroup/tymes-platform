import React from 'react';
import { ProfileType } from '../../types';
import { ModuleSettingsView } from '../../modules/settings/components/ModuleSettingsView';
import { useAuth } from '../../lib/AuthContext';

interface ModuleSettingsProps {
  title: string;
  moduleId?: string;
  onBack?: () => void;
}

export const ModuleSettings: React.FC<ModuleSettingsProps> = ({ title, moduleId, onBack }) => {
  const { profile } = useAuth();

  // Convert title to moduleId if not provided
  const resolvedModuleId = moduleId || title.toLowerCase();

  return (
    <ModuleSettingsView
      moduleId={resolvedModuleId}
      profile={(profile?.type as ProfileType) || ProfileType.PERSONAL}
      onBack={onBack}
    />
  );
};
