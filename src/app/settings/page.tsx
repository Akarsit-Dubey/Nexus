import { SettingsView } from '@/components/views/SettingsView';
import { UniverseBackground } from '@/components/universe/UniverseBackground';

export default function SettingsPage() {
  return (
    <div className="relative flex-1 flex flex-col h-full w-full min-h-0 overflow-hidden">
      <UniverseBackground />
      <SettingsView />
    </div>
  );
}
