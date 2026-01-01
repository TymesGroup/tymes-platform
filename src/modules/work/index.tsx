import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from 'recharts';
import { MoreHorizontal, Clock, Briefcase, Users } from 'lucide-react';
import { STATS_DATA, TASKS } from '../../data/mock';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { EmptyState } from '../../components/ui/EmptyState';
import { ModuleSettings } from '../../components/shared/ModuleSettings';
import { WorkMarketplace } from './components/WorkMarketplace';
import { WorkCreateService } from './components/WorkCreateService';
import { ServiceDetails } from './components/ServiceDetails';
import { FreelancerPage } from './components/FreelancerPage';
import { RecommendedServicesPage } from './components/RecommendedServicesPage';
import { FeaturedFreelancersPage } from './components/FeaturedFreelancersPage';
import { FlashServicesPage } from './components/FlashServicesPage';
import { ProfileType } from '../../types';
import { useAuth } from '../../lib/AuthContext';

interface WorkModuleProps {
  page: string;
  profile?: ProfileType;
  onNavigate?: (page: string) => void;
  itemId?: string; // ID from URL for service/freelancer details
}

const WorkOverview: React.FC = () => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <SectionHeader title="Visão Geral Work" subtitle="Resumo da produtividade." />
    <div className="h-64 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
      <h3 className="font-bold mb-4">Tarefas Concluídas (Semana)</h3>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={STATS_DATA}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.3} />
          <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#18181b',
              borderColor: '#27272a',
              borderRadius: '8px',
            }}
            itemStyle={{ color: '#e4e4e7' }}
          />
          <Line
            type="monotone"
            dataKey="usuarios"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 4, fill: '#10b981' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const WorkTasks: React.FC = () => (
  <div className="animate-in fade-in duration-500">
    <SectionHeader
      title="Tarefas"
      subtitle="Quadro Kanban"
      action={
        <button className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90">
          Nova Tarefa
        </button>
      }
    />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {['Todo', 'In Progress', 'Done'].map(col => (
        <div
          key={col}
          className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800"
        >
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${col === 'Todo' ? 'bg-zinc-400' : col === 'In Progress' ? 'bg-indigo-500' : 'bg-emerald-500'}`}
            ></div>
            {col}
          </h3>
          <div className="space-y-3">
            {TASKS.filter(t => t.status.replace('-', ' ') === col.toLowerCase()).map(task => (
              <div
                key={task.id}
                className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-800 cursor-grab hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      task.priority === 'high'
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                        : task.priority === 'medium'
                          ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                          : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}
                  >
                    {task.priority}
                  </span>
                  <button className="text-zinc-400 hover:text-zinc-600">
                    <MoreHorizontal size={14} />
                  </button>
                </div>
                <h4 className="text-sm font-medium">{task.title}</h4>
                <div className="mt-3 flex items-center justify-between text-zinc-400">
                  <Clock size={14} />
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                    TS
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const WorkModule: React.FC<WorkModuleProps> = ({ page, profile, onNavigate, itemId }) => {
  const { user } = useAuth();
  const isBusiness = profile === ProfileType.BUSINESS;
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(itemId || null);
  const [selectedFreelancerId, setSelectedFreelancerId] = useState<string | null>(null);

  // Update selectedServiceId when itemId changes from URL
  useEffect(() => {
    if (itemId && (page === 'SERVICE_DETAILS' || page === 'SERVICE')) {
      setSelectedServiceId(itemId);
    } else if (itemId && page === 'FREELANCER') {
      setSelectedFreelancerId(itemId);
    }
  }, [itemId, page]);

  const handleBackToInicial = () => {
    onNavigate?.('VITRINE');
  };

  const handleBackToMyServices = () => {
    onNavigate?.('MY_SERVICES');
  };

  const handleSaveService = (data: { id: string; name: string }) => {
    console.log('Saved service:', data);
    onNavigate?.('MY_SERVICES');
  };

  const handleNavigate = (targetPage: string) => {
    if (targetPage.startsWith('SERVICE_DETAILS:') || targetPage.startsWith('SERVICE:')) {
      const serviceId = targetPage.split(':')[1];
      setSelectedServiceId(serviceId);
      setSelectedFreelancerId(null);
      // Pass the full page with ID to generate correct URL
      onNavigate?.(targetPage);
    } else if (targetPage.startsWith('FREELANCER:')) {
      const freelancerId = targetPage.split(':')[1];
      setSelectedFreelancerId(freelancerId);
      setSelectedServiceId(null);
      onNavigate?.(targetPage);
    } else {
      setSelectedServiceId(null);
      setSelectedFreelancerId(null);
      onNavigate?.(targetPage);
    }
  };

  // If on freelancer page
  if (page === 'FREELANCER' && selectedFreelancerId) {
    return (
      <FreelancerPage
        freelancerId={selectedFreelancerId}
        onBack={() => onNavigate?.('VITRINE')}
        onNavigate={handleNavigate}
      />
    );
  }

  // If on service details page (from URL or internal navigation)
  if ((page === 'SERVICE_DETAILS' || page === 'SERVICE') && selectedServiceId) {
    return (
      <ServiceDetails
        serviceId={selectedServiceId}
        onBack={() => onNavigate?.('VITRINE')}
        onNavigate={handleNavigate}
      />
    );
  }

  switch (page) {
    case 'OVERVIEW':
      return <WorkOverview />;
    case 'VITRINE':
      return (
        <WorkMarketplace
          profile={profile || ProfileType.PERSONAL}
          userId={user?.id}
          onNavigate={handleNavigate}
        />
      );
    case 'MY_SERVICES':
      // Only BUSINESS accounts can access my services
      if (!isBusiness) {
        return (
          <WorkMarketplace
            profile={profile || ProfileType.PERSONAL}
            userId={user?.id}
            onNavigate={handleNavigate}
          />
        );
      }
      return (
        <div className="animate-in fade-in">
          <SectionHeader
            title="Meus Serviços"
            subtitle="Gerencie os serviços que você oferece"
            action={
              <button
                onClick={() => onNavigate?.('CREATE_SERVICE')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                + Novo Serviço
              </button>
            }
          />
          <EmptyState
            title="Nenhum serviço cadastrado"
            description="Comece a oferecer seus serviços digitais"
            icon={Briefcase}
          />
        </div>
      );
    case 'CREATE_SERVICE':
      if (!isBusiness) {
        return (
          <WorkMarketplace
            profile={profile || ProfileType.PERSONAL}
            userId={user?.id}
            onNavigate={handleNavigate}
          />
        );
      }
      return (
        <WorkCreateService
          userId={user?.id || ''}
          onBack={handleBackToMyServices}
          onSave={handleSaveService}
        />
      );
    case 'PROJECTS':
      return (
        <div className="animate-in fade-in">
          <SectionHeader
            title="Projetos"
            subtitle={
              isBusiness ? 'Projetos com seus clientes' : 'Projetos que você está participando'
            }
          />
          <EmptyState title="Nenhum projeto ativo" icon={Briefcase} />
        </div>
      );
    case 'TASKS':
      return <WorkTasks />;
    case 'TEAM':
      if (!isBusiness) {
        return (
          <div className="animate-in fade-in">
            <SectionHeader title="Equipe" />
            <EmptyState title="Disponível para contas Business" icon={Users} />
          </div>
        );
      }
      return (
        <div className="animate-in fade-in">
          <SectionHeader title="Equipe" subtitle="Gerencie sua equipe de trabalho" />
          <EmptyState title="Convide membros para seu time" icon={Users} />
        </div>
      );
    case 'RECOMMENDED_SERVICES':
      return <RecommendedServicesPage onNavigate={handleNavigate} />;

    case 'FEATURED_FREELANCERS':
      return <FeaturedFreelancersPage onNavigate={handleNavigate} />;

    case 'FLASH_SERVICES':
      return <FlashServicesPage onNavigate={handleNavigate} />;

    case 'SETTINGS':
      return (
        <ModuleSettings title="Work" moduleId="work" onBack={() => onNavigate?.('OVERVIEW')} />
      );
    default:
      return <WorkOverview />;
  }
};
