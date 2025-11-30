import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getMyProjects } from '@/firebase/projects';
import type { ProjectData } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '../ui/spinner';
import { ProjectCard } from './ProjectCard';

export const ProjectList = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect (() => {
    const loadProjects = async () => {
      if (!user) return;

      try {
        const data = await getMyProjects(user.uid);
        setProjects(data);
        console.log('프로젝트 목록', data);
      } catch (error) {
        console.error('프로젝트 로딩 실패', error);
      } finally {
        setLoading(false)
      }
    };

    loadProjects();
  }, [user])
  
  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-slate-600"><Spinner/>프로젝트를 불러오는 중...</p>
      </div>      
    )
  }

  if (projects.length === 0){
    return (
      <div className="text-center py-12">
        <p className="text-6xl mb-4">🎄</p>
        <p className="text-xl text-slate-600 mb-4">
          아직 프로젝트가 없습니다
        </p>
        <p className="text-slate-500">
          새 프로젝트를 만들어보세요!
        </p>
      </div> 
    )
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};


