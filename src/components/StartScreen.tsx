import { useState } from 'react';
import type { RoundModifierSelection } from '../types';

interface StartScreenProps {
  onStart: (selection: RoundModifierSelection) => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  const [selection, setSelection] = useState<RoundModifierSelection>('none');

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

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-5 text-left">
          <label htmlFor="round-modifier" className="block text-sm font-medium text-gray-700 mb-2">
            Round modifier (optional)
          </label>
          <select
            id="round-modifier"
            value={selection}
            onChange={(event) => setSelection(event.target.value as RoundModifierSelection)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-700"
          >
            <option value="none">No modifier</option>
            <option value="random">Random modifier</option>
            <option value="double-score-diagonal">Double-score diagonal</option>
            <option value="wildcard-square">Wildcard square</option>
            <option value="speed-round-bonus-window">Speed round bonus window</option>
          </select>
        </div>

        <button
          onClick={() => onStart(selection)}
          className="w-full bg-accent text-white font-semibold py-4 px-8 rounded-lg text-lg active:bg-accent-light transition-colors"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
