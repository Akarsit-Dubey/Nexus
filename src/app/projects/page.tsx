import { ProjectsView } from '@/components/views/ProjectsView';
import { UniverseBackground } from '@/components/universe/UniverseBackground';

export default function ProjectsPage() {
  return (
    <div className="relative flex-1 flex flex-col h-full w-full min-h-0 overflow-hidden">
      <UniverseBackground />
      <ProjectsView />
    </div>
  );
}
