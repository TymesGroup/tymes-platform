// Age group types
export type AgeGroup = 'baby' | 'child' | 'teen' | 'adult' | 'senior';

export interface AgeGroupInfo {
  key: AgeGroup;
  label: string;
  description: string;
  minAge: number;
  maxAge: number;
}

// Age group definitions
export const AGE_GROUPS: Record<AgeGroup, AgeGroupInfo> = {
  baby: {
    key: 'baby',
    label: 'Bebê',
    description: 'Conteúdo para bebês de 0 a 2 anos',
    minAge: 0,
    maxAge: 2,
  },
  child: {
    key: 'child',
    label: 'Criança',
    description: 'Conteúdo para crianças de 3 a 12 anos',
    minAge: 3,
    maxAge: 12,
  },
  teen: {
    key: 'teen',
    label: 'Jovem',
    description: 'Conteúdo para jovens de 13 a 17 anos',
    minAge: 13,
    maxAge: 17,
  },
  adult: {
    key: 'adult',
    label: 'Adulto',
    description: 'Conteúdo para adultos de 18 a 59 anos',
    minAge: 18,
    maxAge: 59,
  },
  senior: {
    key: 'senior',
    label: 'Idoso',
    description: 'Conteúdo para idosos de 60 anos ou mais',
    minAge: 60,
    maxAge: 150,
  },
};

// Calculate age from birth date
export function calculateAge(birthDate: Date | string): number {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

// Determine age group from birth date
export function getAgeGroup(birthDate: Date | string | null): AgeGroup | null {
  if (!birthDate) return null;

  const age = calculateAge(birthDate);

  if (age <= 2) return 'baby';
  if (age <= 12) return 'child';
  if (age <= 17) return 'teen';
  if (age <= 59) return 'adult';
  return 'senior';
}

// Return complete age group information
export function getAgeGroupInfo(birthDate: Date | string | null): AgeGroupInfo | null {
  const group = getAgeGroup(birthDate);
  return group ? AGE_GROUPS[group] : null;
}

// Check if content is appropriate for the age group
export function isContentAppropriate(
  contentAgeGroup: AgeGroup | AgeGroup[],
  userAgeGroup: AgeGroup | null
): boolean {
  if (!userAgeGroup) return true; // Se não tem faixa etária, permite tudo

  const allowedGroups = Array.isArray(contentAgeGroup) ? contentAgeGroup : [contentAgeGroup];
  return allowedGroups.includes(userAgeGroup);
}

// Format birth date for display
export function formatBirthDate(birthDate: Date | string): string {
  const date = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  return date.toLocaleDateString('pt-BR');
}

// Validate if birth date is valid
export function isValidBirthDate(birthDate: string): boolean {
  const date = new Date(birthDate);
  const today = new Date();

  // Check if it's a valid date
  if (isNaN(date.getTime())) return false;

  // Não pode ser no futuro
  if (date > today) return false;

  // Não pode ter mais de 150 anos
  const maxAge = new Date();
  maxAge.setFullYear(maxAge.getFullYear() - 150);
  if (date < maxAge) return false;

  return true;
}
