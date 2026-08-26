import CharacterSheet from './components/CharacterSheet';
import AppStateGate from './components/AppStateGate';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <AppStateGate>
        <CharacterSheet />
      </AppStateGate>
    </div>
  );
}
