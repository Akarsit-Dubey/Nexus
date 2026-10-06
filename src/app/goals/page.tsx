import { GoalsView } from '@/components/views/GoalsView';
import { UniverseBackground } from '@/components/universe/UniverseBackground';

export default function GoalsPage() {
  return (
    <div className="relative flex-1 flex flex-col h-full w-full min-h-0 overflow-hidden">
      <UniverseBackground />
      <GoalsView />
    </div>
  );
}
