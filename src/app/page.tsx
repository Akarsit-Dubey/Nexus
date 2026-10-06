import { OverviewDashboard } from '@/components/views/OverviewDashboard';
import { UniverseBackground } from '@/components/universe/UniverseBackground';

export default function HomePage() {
  return (
    <div className="relative flex-1 flex flex-col h-full w-full min-h-0 overflow-hidden">
      <UniverseBackground />
      <OverviewDashboard />
    </div>
  );
}
