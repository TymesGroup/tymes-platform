import React, { useState, useEffect } from 'react';
import { Award, FileText } from 'lucide-react';
import { ProfileType } from '../../types';
import { ModuleSettings } from '../../components/shared/ModuleSettings';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuth } from '../../lib/AuthContext';

// Components
import { ClassStats } from './components/ClassStats';
import { ClassMarketplace } from './components/ClassMarketplace';
import { ClassLibrary } from './components/ClassLibrary';
import { ClassTeaching } from './components/ClassTeaching';
import { ClassCreate } from './components/ClassCreate';
import { CourseDetails } from './components/CourseDetails';
import { InstructorPage } from './components/InstructorPage';
import { RecommendedCoursesPage } from './components/RecommendedCoursesPage';
import { FeaturedInstructorsPage } from './components/FeaturedInstructorsPage';

interface ClassModuleProps {
  page: string;
  profile: ProfileType;
  onNavigate?: (page: string) => void;
  itemId?: string; // ID from URL for course/instructor details
}

export const ClassModule: React.FC<ClassModuleProps> = ({ page, profile, onNavigate, itemId }) => {
  const { user } = useAuth();
  const isBusiness = profile === ProfileType.BUSINESS;
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(itemId || null);
  const [selectedInstructorId, setSelectedInstructorId] = useState<string | null>(null);

  // Update selectedCourseId when itemId changes from URL
  useEffect(() => {
    if (itemId && (page === 'COURSE_DETAILS' || page === 'COURSE')) {
      setSelectedCourseId(itemId);
    } else if (itemId && page === 'INSTRUCTOR') {
      setSelectedInstructorId(itemId);
    }
  }, [itemId, page]);

  const handleBackToTeaching = () => {
    onNavigate?.('TEACHING');
  };

  const handleSaveCourse = (data: { id: string; title: string }) => {
    console.log('Saving course:', data);
    onNavigate?.('TEACHING');
  };

  const handleNavigate = (targetPage: string) => {
    if (targetPage.startsWith('COURSE_DETAILS:') || targetPage.startsWith('COURSE:')) {
      const courseId = targetPage.split(':')[1];
      setSelectedCourseId(courseId);
      setSelectedInstructorId(null);
      // Pass the full page with ID to generate correct URL
      onNavigate?.(targetPage);
    } else if (targetPage.startsWith('INSTRUCTOR:')) {
      const instructorId = targetPage.split(':')[1];
      setSelectedInstructorId(instructorId);
      setSelectedCourseId(null);
      onNavigate?.(targetPage);
    } else {
      setSelectedCourseId(null);
      setSelectedInstructorId(null);
      onNavigate?.(targetPage);
    }
  };

  // If on instructor page
  if (page === 'INSTRUCTOR' && selectedInstructorId) {
    return (
      <InstructorPage
        instructorId={selectedInstructorId}
        onBack={() => onNavigate?.('VITRINE')}
        onNavigate={handleNavigate}
      />
    );
  }

  // If on course details page (from URL or internal navigation)
  if ((page === 'COURSE_DETAILS' || page === 'COURSE') && selectedCourseId) {
    return (
      <CourseDetails
        courseId={selectedCourseId}
        onBack={() => onNavigate?.('VITRINE')}
        onNavigate={handleNavigate}
      />
    );
  }

  switch (page) {
    case 'OVERVIEW':
      return <ClassStats profile={profile} />;

    case 'VITRINE':
      return <ClassMarketplace profile={profile} userId={user?.id} onNavigate={handleNavigate} />;

    case 'LIBRARY':
      // Personal user sees their courses here.
      // Business user might also buy courses? Assuming yes for now.
      return <ClassLibrary />;

    case 'TEACHING':
      // Only BUSINESS types should access this
      if (!isBusiness) {
        return <ClassMarketplace profile={profile} userId={user?.id} onNavigate={handleNavigate} />;
      }
      return <ClassTeaching onNavigate={handleNavigate} />;

    case 'CONTENT':
      // Only BUSINESS types - Manage course content
      if (!isBusiness) {
        return <ClassMarketplace profile={profile} userId={user?.id} onNavigate={handleNavigate} />;
      }
      return (
        <div className="animate-in fade-in">
          <SectionHeader
            title="Gerenciar Conteúdo"
            subtitle="Organize e gerencie o conteúdo dos seus cursos"
          />
          <EmptyState
            title="Nenhum conteúdo criado"
            description="Adicione módulos, aulas e materiais aos seus cursos"
            icon={FileText}
          />
        </div>
      );

    case 'CERTIFICATES':
      return (
        <div className="animate-in fade-in">
          <SectionHeader
            title="Certificados"
            subtitle={
              isBusiness
                ? 'Gerencie os certificados emitidos para seus alunos'
                : 'Seus certificados de conclusão de cursos'
            }
          />
          <EmptyState
            title={isBusiness ? 'Nenhum certificado emitido' : 'Nenhum certificado obtido'}
            description={
              isBusiness
                ? 'Certificados serão gerados automaticamente quando alunos concluírem seus cursos'
                : 'Complete cursos para obter certificados'
            }
            icon={Award}
          />
        </div>
      );

    case 'CREATE_COURSE':
      // Only BUSINESS types
      if (!isBusiness) {
        return <ClassMarketplace profile={profile} userId={user?.id} onNavigate={handleNavigate} />;
      }
      return <ClassCreate onBack={handleBackToTeaching} onSave={handleSaveCourse} />;

    case 'RECOMMENDED_COURSES':
      return <RecommendedCoursesPage onNavigate={handleNavigate} />;

    case 'FEATURED_INSTRUCTORS':
      return <FeaturedInstructorsPage onNavigate={handleNavigate} />;

    case 'SETTINGS':
      return (
        <ModuleSettings title="Class" moduleId="class" onBack={() => onNavigate?.('OVERVIEW')} />
      );

    default:
      return <ClassStats profile={profile} />;
  }
};
