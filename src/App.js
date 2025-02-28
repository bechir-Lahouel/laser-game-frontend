import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import './App.css';

// Importation des logos
import cityLogo from './assets/city.png';   // Logo pour l'équipe BLUE (redimensionné si besoin)
import manuLogo from './assets/manu.png';     // Logo pour l'équipe RED (redimensionné si besoin)

function App() {
  // Durée initiale de la partie (en secondes)
  const INITIAL_TIME = 30;

  // Nouvel état pour gérer le démarrage
  const [hasStarted, setHasStarted] = useState(false);

  // États principaux
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [blueScore, setBlueScore] = useState(0);
  const [redScore, setRedScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  // Leaderboard (nombre de victoires totales)
  const [blueVictories, setBlueVictories] = useState(0);
  const [redVictories, setRedVictories] = useState(0);

  // Démarrer le jeu
  const handleStart = () => {
    setHasStarted(true);
    handleRestart();
  };

  // Redémarrer la partie
  const handleRestart = () => {
    setTimeLeft(INITIAL_TIME);
    setBlueScore(0);
    setRedScore(0);
    setIsGameOver(false);
    setWinner(null);
  };

  // Formater le temps en mm:ss
  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  // Calcul pour la barre de progression du timer
  const timerProgress = (timeLeft / INITIAL_TIME) * 100;

  // Effet pour décrémenter le chrono
  useEffect(() => {
    if (!hasStarted || isGameOver) return;
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
  }, [hasStarted, isGameOver]);

  // Effet pour vérifier la fin de partie et déterminer le vainqueur
  useEffect(() => {
    if (hasStarted && timeLeft === 0 && !isGameOver) {
      setIsGameOver(true);
      if (blueScore > redScore) {
        setWinner('BLUE');
        setBlueVictories((v) => v + 1);
      } else if (redScore > blueScore) {
        setWinner('RED');
        setRedVictories((v) => v + 1);
      } else {
        setWinner('EGALITE');
      }
    }
  }, [timeLeft, hasStarted, isGameOver, blueScore, redScore]);

  // Effet pour simuler l'augmentation des scores (toutes les 2 secondes)
  useEffect(() => {
    if (!hasStarted || isGameOver) return;
    const interval = setInterval(() => {
      setBlueScore((prev) => prev + Math.floor(Math.random() * 2));
      setRedScore((prev) => prev + Math.floor(Math.random() * 2));
    }, 2000);
    return () => clearInterval(interval);
  }, [hasStarted, isGameOver]);

  // Écran de démarrage
  if (!hasStarted) {
    return (
      <div className="start-screen">
        <h1 className="start-title">Laser Game</h1>
        <button className="start-button" onClick={handleStart}>START</button>
      </div>
    );
  }

  // Écran final
  if (isGameOver) {
    const screenClass =
      winner === 'BLUE'
        ? 'end-screen-blue'
        : winner === 'RED'
        ? 'end-screen-red'
        : 'end-screen-egalite';
    return (
      <div className={`end-screen ${screenClass}`}>
        {/* Effet confettis (optionnel) si ce n'est pas une égalité */}
        {winner !== 'EGALITE' && <Confetti />}
        {/* Affichage du logo de l'équipe gagnante */}
        {winner === 'BLUE' && (
          <img src={cityLogo} alt="Logo Team Blue" className="team-logo" />
        )}
        {winner === 'RED' && (
          <img src={manuLogo} alt="Logo Team Red" className="team-logo" />
        )}
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
        {/* Bouton Restart, placé en bas, centré */}
        <button onClick={handleRestart} className="restart-button center-bottom">
          RESTART
        </button>
      </div>
    );
  }

  // Écran principal de jeu
  return (
    <div className="container">
      <div className="scoreboard">
        {/* Zone bleue */}
        <div className="team-area blue-side">
          <img src={cityLogo} alt="Logo Team Blue" className="team-logo" />
          <div className="team-label">TEAM BLUE</div>
          <div className="team-score">{formatTime(blueScore)}</div>
        </div>
        {/* Timer au centre */}
        <div className="timer-wrapper">
          <div
            className="timer-bar"
            style={{ width: `${timerProgress}%` }}
          ></div>
          <div className="timer-text">{formatTime(timeLeft)}</div>
        </div>
        {/* Zone rouge */}
        <div className="team-area red-side">
          <img src={manuLogo} alt="Logo Team Red" className="team-logo" />
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
