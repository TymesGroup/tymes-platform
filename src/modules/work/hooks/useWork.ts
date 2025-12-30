import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import {
  workService,
  freelancerService,
  Service,
  ServiceWithFreelancer,
} from '../services/workService';

// Hook para serviços
export function useServices(filters?: { category?: string }) {
  const [services, setServices] = useState<ServiceWithFreelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const data = await workService.getAll(filters);
      setServices(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  }, [filters?.category]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return { services, loading, error, refetch: fetchServices };
}

// Hook para serviço individual
export function useService(serviceId: string | null) {
  const [service, setService] = useState<ServiceWithFreelancer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!serviceId) {
      setLoading(false);
      return;
    }

    const fetch = async () => {
      try {
        const data = await workService.getById(serviceId);
        setService(data);
      } catch (err) {
        console.error('Erro ao carregar serviço:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [serviceId]);

  return { service, loading };
}

// Hook para meus serviços (freelancer)
export function useMyServices() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await workService.getByFreelancer(user.id);
      setServices(data || []);
    } catch (err) {
      console.error('Erro ao carregar serviços:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const createService = async (service: Partial<Service>) => {
    if (!user?.id) throw new Error('Usuário não autenticado');
    const newService = await workService.create({
      ...service,
      created_by: user.id,
      status: 'active',
    });
    setServices(prev => [newService, ...prev]);
    return newService;
  };

  const updateService = async (id: string, updates: Partial<Service>) => {
    const updated = await workService.update(id, updates);
    setServices(prev => prev.map(s => (s.id === id ? updated : s)));
    return updated;
  };

  const deleteService = async (id: string) => {
    await workService.delete(id);
    setServices(prev => prev.filter(s => s.id !== id));
  };

  return { services, loading, refetch: fetchServices, createService, updateService, deleteService };
}

// Hook para freelancers
export function useFreelancers() {
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await freelancerService.getAll();
        setFreelancers(data || []);
      } catch (err) {
        console.error('Erro ao carregar freelancers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { freelancers, loading };
}

// Hook para freelancer individual
export function useFreelancer(freelancerId: string | null) {
  const [freelancer, setFreelancer] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!freelancerId) {
      setLoading(false);
      return;
    }

    const fetch = async () => {
      try {
        const data = await freelancerService.getWithServices(freelancerId);
        setFreelancer(data);
      } catch (err) {
        console.error('Erro ao carregar freelancer:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [freelancerId]);

  return { freelancer, loading };
}
