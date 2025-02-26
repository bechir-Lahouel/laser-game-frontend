import React, { useEffect, useState } from 'react';
// Installez react-confetti si vous voulez l'effet final
import Confetti from 'react-confetti';
import './App.css';

function App() {
  // Durée initiale de la partie (en secondes)
  const INITIAL_TIME = 30;

  // États principaux
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [blueScore, setBlueScore] = useState(0);
  const [redScore, setRedScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  // Décrémente le chrono chaque seconde tant que la partie n'est pas terminée
  useEffect(() => {
    if (isGameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameOver]);

  // Vérifie quand le chrono tombe à 0 et détermine le vainqueur
  useEffect(() => {
    if (timeLeft === 0 && !isGameOver) {
      setIsGameOver(true);
      if (blueScore > redScore) {
        setWinner('BLUE');
      } else if (redScore > blueScore) {
        setWinner('RED');
      } else {
        setWinner('EGALITE');
      }
    }
  }, [timeLeft, isGameOver, blueScore, redScore]);

  // Simulation d'augmentation de score (toutes les 2 secondes)
  // Dans un vrai cas, vous écouteriez l’ESP32 (via WebSocket, MQTT, etc.)
  useEffect(() => {
    if (!isGameOver) {
      const interval = setInterval(() => {
        setBlueScore((prev) => prev + Math.floor(Math.random() * 2));
        setRedScore((prev) => prev + Math.floor(Math.random() * 2));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isGameOver]);

  // Redémarrer la partie
  const handleRestart = () => {
    setTimeLeft(INITIAL_TIME);
    setBlueScore(0);
    setRedScore(0);
    setIsGameOver(false);
    setWinner(null);
  };

  // Formate le temps en mm:ss
  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  // Écran final si la partie est terminée
  if (isGameOver) {
    // Choix d'une couleur de fond pour l'écran final selon le vainqueur
    const screenClass =
      winner === 'BLUE' ? 'end-screen-blue' :
      winner === 'RED'  ? 'end-screen-red' :
                          'end-screen-egalite';

    return (
      <div className={`end-screen ${screenClass}`}>
        {/* Effet confettis (optionnel) */}
        {winner !== 'EGALITE' && <Confetti />}
        
        <h1>
          {winner === 'EGALITE'
            ? 'ÉGALITÉ !'
            : `TEAM ${winner} WINS !`
          }
        </h1>
        <button onClick={handleRestart} className="restart-button">
          RESTART
        </button>
      </div>
    );
  }

  // Écran principal
  return (
    <div className="container">
      {/* Bouton Restart en haut à droite */}
      <button className="restart-button" onClick={handleRestart}>
        RESTART
      </button>

      <div className="scoreboard">
        {/* Zone bleue */}
        <div className="team-area blue-side">
          <div className="team-label">TEAM BLUE</div>
          <div className="team-score">
            {formatTime(blueScore)}
          </div>
        </div>

        {/* Chrono au centre */}
        <div className="timer-area">
          {formatTime(timeLeft)}
        </div>

        {/* Zone rouge */}
        <div className="team-area red-side">
          <div className="team-label">TEAM RED</div>
          <div className="team-score">
            {formatTime(redScore)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
