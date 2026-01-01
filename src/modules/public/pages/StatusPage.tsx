/**
 * StatusPage - Página de Status dos Serviços
 */

import React from 'react';
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Server,
  Database,
  Globe,
  Shield,
  Zap,
} from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  icon: React.ElementType;
  uptime: string;
}

const services: ServiceStatus[] = [
  { name: 'Plataforma Web', status: 'operational', icon: Globe, uptime: '99.99%' },
  { name: 'API', status: 'operational', icon: Server, uptime: '99.98%' },
  { name: 'Banco de Dados', status: 'operational', icon: Database, uptime: '99.99%' },
  { name: 'Autenticação', status: 'operational', icon: Shield, uptime: '99.99%' },
  { name: 'Pagamentos', status: 'operational', icon: Zap, uptime: '99.97%' },
  { name: 'CDN & Mídia', status: 'operational', icon: Globe, uptime: '99.99%' },
];

const incidents = [
  {
    date: '28 Dez 2025',
    title: 'Manutenção programada concluída',
    description: 'Atualização de infraestrutura realizada com sucesso.',
    status: 'resolved',
  },
  {
    date: '15 Dez 2025',
    title: 'Lentidão temporária no processamento de pagamentos',
    description: 'Identificado e resolvido em 15 minutos.',
    status: 'resolved',
  },
];

const getStatusColor = (status: ServiceStatus['status']) => {
  switch (status) {
    case 'operational':
      return 'text-green-500';
    case 'degraded':
      return 'text-yellow-500';
    case 'outage':
      return 'text-red-500';
  }
};

const getStatusBg = (status: ServiceStatus['status']) => {
  switch (status) {
    case 'operational':
      return 'bg-green-100 dark:bg-green-900/30';
    case 'degraded':
      return 'bg-yellow-100 dark:bg-yellow-900/30';
    case 'outage':
      return 'bg-red-100 dark:bg-red-900/30';
  }
};

const getStatusText = (status: ServiceStatus['status']) => {
  switch (status) {
    case 'operational':
      return 'Operacional';
    case 'degraded':
      return 'Degradado';
    case 'outage':
      return 'Indisponível';
  }
};

export const StatusPage: React.FC = () => {
  const allOperational = services.every(s => s.status === 'operational');

  return (
    <PublicLayout title="Status dos Serviços">
      <div className="space-y-12">
        {/* Overall Status */}
        <section
          className={`p-8 rounded-2xl ${allOperational ? 'bg-green-50 dark:bg-green-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'}`}
        >
          <div className="flex items-center gap-4">
            {allOperational ? (
              <CheckCircle className="w-12 h-12 text-green-500" />
            ) : (
              <AlertCircle className="w-12 h-12 text-yellow-500" />
            )}
            <div>
              <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                {allOperational
                  ? 'Todos os sistemas operacionais'
                  : 'Alguns sistemas com problemas'}
              </h2>
              <p className="text-[#424245] dark:text-[#86868b]">
                Última atualização: {new Date().toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section>
          <h2 className="text-xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-6">
            Status dos Serviços
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service, i) => (
              <div
                key={i}
                className="p-4 bg-[#f5f5f7] dark:bg-[#1d1d1f] rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg ${getStatusBg(service.status)} flex items-center justify-center`}
                  >
                    <service.icon className={`w-5 h-5 ${getStatusColor(service.status)}`} />
                  </div>
                  <div>
                    <p className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">{service.name}</p>
                    <p className="text-xs text-[#86868b]">Uptime: {service.uptime}</p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${getStatusColor(service.status)}`}>
                  {getStatusText(service.status)}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Uptime Chart Placeholder */}
        <section className="bg-[#f5f5f7] dark:bg-[#1d1d1f] rounded-2xl p-8">
          <h2 className="text-xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-6">
            Histórico de Uptime (últimos 90 dias)
          </h2>
          <div className="flex gap-1">
            {Array.from({ length: 90 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-8 bg-green-500 rounded-sm opacity-90 hover:opacity-100 transition-opacity"
                title={`${90 - i} dias atrás: 100% uptime`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-[#86868b]">
            <span>90 dias atrás</span>
            <span>Hoje</span>
          </div>
        </section>

        {/* Recent Incidents */}
        <section>
          <h2 className="text-xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-6">
            Incidentes Recentes
          </h2>
          <div className="space-y-4">
            {incidents.map((incident, i) => (
              <div key={i} className="p-6 bg-[#f5f5f7] dark:bg-[#1d1d1f] rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                        {incident.title}
                      </h3>
                      <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full">
                        Resolvido
                      </span>
                    </div>
                    <p className="text-sm text-[#424245] dark:text-[#86868b] mb-2">
                      {incident.description}
                    </p>
                    <p className="text-xs text-[#86868b] flex items-center gap-1">
                      <Clock size={12} />
                      {incident.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Subscribe */}
        <section className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12">
          <h2 className="text-2xl font-bold text-white mb-4">Receba alertas de status</h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Seja notificado sobre manutenções programadas e incidentes em tempo real.
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="seu@email.com"
              className="flex-1 px-4 py-3 rounded-full bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:border-white"
            />
            <button className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-full hover:bg-gray-100 transition-colors">
              Inscrever
            </button>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default StatusPage;
