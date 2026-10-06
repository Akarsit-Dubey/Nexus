import { UniverseCanvas } from '@/components/universe/UniverseCanvas';

export default function UniversePage() {
  return (
    <div className="relative flex-1 flex flex-col h-full w-full overflow-hidden">
      <UniverseCanvas />
    </div>
  );
}
