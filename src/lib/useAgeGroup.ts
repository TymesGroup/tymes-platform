import { useMemo } from 'react';
import { useAuth } from './AuthContext';
import { AgeGroup, AgeGroupInfo, AGE_GROUPS, getAgeGroup, calculateAge } from './ageGroup';

interface UseAgeGroupReturn {
  ageGroup: AgeGroup | null;
  ageGroupInfo: AgeGroupInfo | null;
  age: number | null;
  isBaby: boolean;
  isChild: boolean;
  isTeen: boolean;
  isAdult: boolean;
  isSenior: boolean;
  isMinor: boolean; // bebê, criança ou jovem
  isOfAge: boolean; // adulto ou idoso
}

export function useAgeGroup(): UseAgeGroupReturn {
  const { profile } = useAuth();

  return useMemo(() => {
    const birthDate = profile?.birth_date;

    if (!birthDate) {
      return {
        ageGroup: null,
        ageGroupInfo: null,
        age: null,
        isBaby: false,
        isChild: false,
        isTeen: false,
        isAdult: false,
        isSenior: false,
        isMinor: false,
        isOfAge: false,
      };
    }

    const age = calculateAge(birthDate);
    const ageGroup = getAgeGroup(birthDate);
    const ageGroupInfo = ageGroup ? AGE_GROUPS[ageGroup] : null;

    return {
      ageGroup,
      ageGroupInfo,
      age,
      isBaby: ageGroup === 'baby',
      isChild: ageGroup === 'child',
      isTeen: ageGroup === 'teen',
      isAdult: ageGroup === 'adult',
      isSenior: ageGroup === 'senior',
      isMinor: ageGroup === 'baby' || ageGroup === 'child' || ageGroup === 'teen',
      isOfAge: ageGroup === 'adult' || ageGroup === 'senior',
    };
  }, [profile?.birth_date]);
}

// Hook para filtrar conteúdo baseado na faixa etária
export function useAgeAppropriateContent<T extends { ageGroups?: AgeGroup[] }>(items: T[]): T[] {
  const { ageGroup } = useAgeGroup();

  return useMemo(() => {
    if (!ageGroup) return items;

    return items.filter(item => {
      // Se o item não tem restrição de idade, permite
      if (!item.ageGroups || item.ageGroups.length === 0) return true;
      // Se tem restrição, verifica se a faixa etária do usuário está incluída
      return item.ageGroups.includes(ageGroup);
    });
  }, [items, ageGroup]);
}
