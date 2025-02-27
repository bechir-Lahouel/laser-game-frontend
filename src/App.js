import React, { useEffect, useState } from 'react';
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

  // Leaderboard (nombre de victoires totales)
  const [blueVictories, setBlueVictories] = useState(0);
  const [redVictories, setRedVictories] = useState(0);

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
        setBlueVictories((v) => v + 1); // Incrémente le compteur de victoires
      } else if (redScore > blueScore) {
        setWinner('RED');
        setRedVictories((v) => v + 1); // Incrémente le compteur de victoires
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

  // Calcul pour la barre de progression du timer
  const timerProgress = (timeLeft / INITIAL_TIME) * 100;

  // Écran final si la partie est terminée
  if (isGameOver) {
    // Choix d'une couleur de fond pour l'écran final selon le vainqueur
    const screenClass =
      winner === 'BLUE'
        ? 'end-screen-blue'
        : winner === 'RED'
        ? 'end-screen-red'
        : 'end-screen-egalite';

    return (
      <div className={`end-screen ${screenClass}`}>
        {/* Effet confettis (optionnel) si pas égalité */}
        {winner !== 'EGALITE' && <Confetti />}

        <h1 className="end-title">
          {winner === 'EGALITE'
            ? 'ÉGALITÉ !'
            : `TEAM ${winner} WINS !`}
        </h1>

        {/* Leaderboard */}
        <div className="leaderboard">
          <h2>Leaderboard</h2>
          <p>TEAM BLUE : {blueVictories} victoire(s)</p>
          <p>TEAM RED : {redVictories} victoire(s)</p>
        </div>

        <button onClick={handleRestart} className="restart-button">
          RESTART
        </button>
      </div>
    );
  }

  // Écran principal
  return (
    <div className="container">
      <div className="scoreboard">
        {/* Zone bleue */}
        <div className="team-area blue-side">
          <div className="team-label">TEAM BLUE</div>
          <div className="team-score">{formatTime(blueScore)}</div>
        </div>

        {/* Timer au centre : barre de progression + texte */}
        <div className="timer-wrapper">
          <div
            className="timer-bar"
            style={{ width: `${timerProgress}%` }}
          ></div>
          <div className="timer-text">{formatTime(timeLeft)}</div>
        </div>

        {/* Zone rouge */}
        <div className="team-area red-side">
          <div className="team-label">TEAM RED</div>
          <div className="team-score">{formatTime(redScore)}</div>
        </div>
      </div>

      {/* Bouton Restart centré en bas */}
      <button className="restart-button center-bottom" onClick={handleRestart}>
        RESTART
      </button>
    </div>
  );
}

export default App;
