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
    streak,
    isCombo,
    completedLineCount,
    startGame,
    handleSquareClick,
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
        hasBingo={gameState === 'bingo' || gameState === 'double-bingo'}
        streak={streak}
        isCombo={isCombo}
        onSquareClick={handleSquareClick}
        onReset={resetGame}
      />
      {showBingoModal && (
        <BingoModal
          isDoubleBingo={completedLineCount >= 2}
          onDismiss={dismissModal}
        />
      )}
    </>
  );
}

export default App;
