interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-full overflow-hidden p-6">
      <div className="pointer-events-none absolute -top-16 -left-14 h-48 w-48 rounded-full bg-candy-pink/25 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-14 h-56 w-56 rounded-full bg-candy-mint/25 blur-2xl" />
      <div className="text-center max-w-sm">
        <p className="mb-2 text-sm font-extrabold tracking-[--letter-spacing-candy] text-candy-violet uppercase">Candy Pop Edition</p>
        <h1 className="mb-2 font-display text-5xl font-extrabold text-candy-pink shadow-title-pop">Bingo Mixer</h1>
        <p className="mb-8 text-lg font-bold text-candy-ink">Find your people, collect sweet wins!</p>

        <div className="mb-8 rounded-3xl border-4 border-white/80 bg-candy-cream/85 p-6 text-left shadow-candy-card backdrop-blur-sm">
          <h2 className="mb-3 font-display text-xl font-extrabold text-candy-violet">How to play</h2>
          <ul className="space-y-2 text-sm font-semibold text-candy-ink">
            <li>• Find people who match the questions</li>
            <li>• Tap a square when you find a match</li>
            <li>• Get 5 in a row to win!</li>
          </ul>
        </div>

        <button
          onClick={onStart}
          className="w-full rounded-2xl border-b-4 border-candy-pink-dark bg-accent px-8 py-4 font-display text-2xl font-extrabold text-white shadow-candy-button transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 active:bg-accent-light"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
