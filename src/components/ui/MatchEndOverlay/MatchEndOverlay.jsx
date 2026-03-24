import Button from '../Buttons/Button';

const MatchEndOverlay = ({ winner, currentUser, isHost, onPlayAgain, onBackToMenu, mode = 'online' }) => {
  const isWinner = winner?.sessionId === currentUser?.sessionId;

  const renderContent = () => {
    if (mode === 'offline') {
      return (
        <>
          <div className="text-6xl">💀</div>
          <h1 className="text-3xl font-bold text-white tracking-wide text-center">Game Over</h1>
          <p className="text-gray-400 text-center">Better luck next time.</p>
        </>
      );
    }
    if (winner) {
      return (
        <>
          <div className="text-6xl">{isWinner ? '🏆' : '💀'}</div>
          <h1 className="text-3xl font-bold text-white tracking-wide text-center">
            {isWinner ? 'You Win!' : `${winner.username} Wins!`}
          </h1>
          <p className="text-gray-400 text-center">{isWinner ? 'Last one standing.' : 'Better luck next time.'}</p>
        </>
      );
    }
    return (
      <>
        <div className="text-6xl">🤝</div>
        <h1 className="text-3xl font-bold text-white tracking-wide text-center">Draw!</h1>
        <p className="text-gray-400 text-center">Everyone was eliminated.</p>
      </>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6 bg-gray-900/90 border border-cyan-500/30 rounded-2xl p-10 shadow-2xl max-w-md w-full mx-4">
        {renderContent()}

        <div className="flex flex-col gap-3 w-full mt-2">
          {isHost && (
            <Button onClick={onPlayAgain} className="w-full">
              Play Again
            </Button>
          )}
          {!isHost && <p className="text-sm text-gray-500 text-center">Waiting for host to start a new game...</p>}
          <Button onClick={onBackToMenu} className="w-full" variant="secondary">
            Back to Menu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchEndOverlay;
