import { useState } from 'react';
import type { SocialMode } from '../types';

interface StartScreenProps {
  onStart: (socialMode: SocialMode) => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  const [socialMode, setSocialMode] = useState<SocialMode>('classic');

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
            <li>• Get 5 in a row to win!</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-8 text-left">
          <h2 className="font-semibold text-gray-800 mb-3">Social pressure mode</h2>
          <label className="flex items-start gap-2 text-sm text-gray-700 mb-2">
            <input
              type="radio"
              name="social-mode"
              value="classic"
              checked={socialMode === 'classic'}
              onChange={() => setSocialMode('classic')}
            />
            <span>Classic (no pressure)</span>
          </label>
          <label className="flex items-start gap-2 text-sm text-gray-700 mb-2">
            <input
              type="radio"
              name="social-mode"
              value="countdown"
              checked={socialMode === 'countdown'}
              onChange={() => setSocialMode('countdown')}
            />
            <span>Countdown (2-minute timer)</span>
          </label>
          <label className="flex items-start gap-2 text-sm text-gray-700">
            <input
              type="radio"
              name="social-mode"
              value="team"
              checked={socialMode === 'team'}
              onChange={() => setSocialMode('team')}
            />
            <span>Team mode (Spark vs Pop score)</span>
          </label>
        </div>

        <button
          onClick={() => onStart(socialMode)}
          className="w-full bg-accent text-white font-semibold py-4 px-8 rounded-lg text-lg active:bg-accent-light transition-colors"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
