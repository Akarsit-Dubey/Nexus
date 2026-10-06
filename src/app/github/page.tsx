import { GitHubView } from '@/components/views/GitHubView';
import { UniverseBackground } from '@/components/universe/UniverseBackground';

export default function GitHubPage() {
  return (
    <div className="relative flex-1 flex flex-col h-full w-full min-h-0 overflow-hidden">
      <UniverseBackground />
      <GitHubView />
    </div>
  );
}
