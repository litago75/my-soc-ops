interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-6">
      <div className="text-center max-w-sm">
        <h1 className="sticker-title text-5xl font-black text-[#8a2e29] mb-2 tracking-wide">Bingo Mixer</h1>
        <p className="text-lg text-[#6f4638] mb-8">Find your people!</p>
        
        <div className="sticker-card p-6 mb-8">
          <h2 className="font-semibold text-[#6d3a2d] mb-3 text-lg">How to play</h2>
          <ul className="text-left text-[#7d5545] text-sm space-y-2">
            <li>• Find people who match the questions</li>
            <li>• Tap a square when you find a match</li>
            <li>• Get 5 in a row to win!</li>
          </ul>
        </div>

        <button
          onClick={onStart}
          className="sticker-button w-full bg-accent text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
