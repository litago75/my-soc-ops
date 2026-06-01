interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="relative flex min-h-full flex-col items-center justify-center overflow-hidden px-5 py-8">
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,rgba(47,48,66,0.4)_1px,transparent_0)] [background-size:16px_16px]" />
      <div className="pointer-events-none absolute -top-18 -left-14 h-52 w-52 rotate-12 rounded-[2.4rem] border-4 border-white/70 bg-sticker-yellow/70 shadow-sticker-lift" />
      <div className="pointer-events-none absolute -bottom-16 -right-12 h-48 w-48 -rotate-6 rounded-[2rem] border-4 border-white/70 bg-sticker-teal/70 shadow-sticker-soft" />
      <div className="text-center max-w-sm">
        <p className="mb-3 inline-flex -rotate-2 rounded-full border-2 border-sticker-ink/30 bg-white/90 px-4 py-1 text-[11px] font-extrabold tracking-[--letter-spacing-sticker] text-sticker-red uppercase shadow-[0_4px_0_rgb(47_48_66_/_14%)]">Sticker Party Edition</p>
        <h1 className="mb-3 font-display text-5xl font-normal text-sticker-red [text-shadow:0_3px_0_#fff,0_7px_0_rgb(222_58_82_/_35%)]">Bingo Mixer</h1>
        <p className="mb-8 text-lg font-bold text-sticker-ink">Peel, stick, and match new people!</p>

        <div className="mb-8 rotate-[-1.4deg] rounded-[2rem] border-4 border-white/90 bg-sticker-paper/95 p-6 text-left shadow-sticker-lift [box-shadow:var(--shadow-sticker-press),var(--shadow-sticker-lift)]">
          <h2 className="mb-3 font-display text-2xl font-normal text-sticker-blue">How to play</h2>
          <ul className="space-y-2 text-sm font-bold text-sticker-ink">
            <li>• Find people who match the questions</li>
            <li>• Tap a square when you find a match</li>
            <li>• Collect 5 stickers in a row to win</li>
          </ul>
        </div>

        <button
          onClick={onStart}
          className="w-full rounded-[1.35rem] border-2 border-sticker-red-dark bg-accent px-8 py-4 font-display text-2xl font-normal text-white [box-shadow:var(--shadow-sticker-press),0_10px_0_rgb(222_58_82_/_40%),var(--shadow-sticker-lift)] transition-all hover:-translate-y-0.5 active:translate-y-1 active:bg-accent-light"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
