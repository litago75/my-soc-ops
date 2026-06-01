import { useState } from 'react';
import type { GameMode } from '../types';

interface StartScreenProps {
  onStart: (mode: GameMode) => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  const [selectedMode, setSelectedMode] = useState<GameMode>('classic');

  const modeOptions: Array<{ mode: GameMode; label: string; description: string }> = [
    { mode: 'quick', label: 'Quick', description: '3x3 board, fast rounds' },
    { mode: 'classic', label: 'Classic', description: '5x5 baseline game' },
    { mode: 'chaos', label: 'Chaos', description: '5x5 with random modifiers' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-6 bg-gray-50">
      <div className="text-center max-w-sm">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Bingo Mixer</h1>
        <p className="text-lg text-gray-600 mb-8">Find your people!</p>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
          <h2 className="font-semibold text-gray-800 mb-3">How to play</h2>
          <ul className="text-left text-gray-600 text-sm space-y-2">
            <li>• Find people who match the questions</li>
            <li>• Tap a square when you find a match</li>
            <li>• Complete a full line to win!</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6 text-left">
          <h2 className="font-semibold text-gray-800 mb-3 text-center">Choose game mode</h2>
          <div className="space-y-2">
            {modeOptions.map((option) => (
              <button
                key={option.mode}
                type="button"
                onClick={() => setSelectedMode(option.mode)}
                className={`w-full text-left rounded-lg border p-3 transition-colors ${
                  selectedMode === option.mode
                    ? 'border-accent bg-accent/10'
                    : 'border-gray-200 bg-white active:bg-gray-50'
                }`}
              >
                <p className="font-semibold text-gray-800">{option.label}</p>
                <p className="text-sm text-gray-600">{option.description}</p>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onStart(selectedMode)}
          className="w-full bg-accent text-white font-semibold py-4 px-8 rounded-lg text-lg active:bg-accent-light transition-colors"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
