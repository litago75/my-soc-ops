import { useBingoGame } from './hooks/useBingoGame';
import { StartScreen } from './components/StartScreen';
import { GameScreen } from './components/GameScreen';
import { BingoModal } from './components/BingoModal';

function App() {
  const {
    gameState,
    board,
    winningSquareIds,
    showBingoModal,
    score,
    activeModifierLabel,
    wildcardArmed,
    canUseWildcard,
    startGame,
    handleSquareClick,
    activateWildcard,
    resetGame,
    dismissModal,
  } = useBingoGame();

  if (gameState === 'start') {
    return <StartScreen onStart={startGame} />;
  }

  return (
    <>
      <GameScreen
        board={board}
        winningSquareIds={winningSquareIds}
        hasBingo={gameState === 'bingo'}
        score={score}
        activeModifierLabel={activeModifierLabel}
        wildcardArmed={wildcardArmed}
        canUseWildcard={canUseWildcard}
        onSquareClick={handleSquareClick}
        onUseWildcard={activateWildcard}
        onReset={resetGame}
      />
      {showBingoModal && (
        <BingoModal onDismiss={dismissModal} />
      )}
    </>
  );
}

export default App;
