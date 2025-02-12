import { calculateWinner } from "./GameLogic";

// IA Fácil - Movimiento Aleatorio
export const calculateAiMoveEasy = (squares) => {
  const emptySquares = squares.map((square, index) => square === null ? index : null).filter(val => val !== null);
  const randomIndex = Math.floor(Math.random() * emptySquares.length);
  return emptySquares[randomIndex]; // Retorna una posición aleatoria
};

// IA Intermedia - Bloquear y Ganar
export const calculateAiMoveMedium = (squares, isXNext) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const aiMark = isXNext ? 'X' : 'O';
  const playerMark = isXNext ? 'O' : 'X';

  // Ver si puede ganar
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] === aiMark && squares[b] === aiMark && !squares[c]) return c;
    if (squares[a] === aiMark && squares[c] === aiMark && !squares[b]) return b;
    if (squares[b] === aiMark && squares[c] === aiMark && !squares[a]) return a;
  }

  // Bloquear al jugador si está por ganar
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] === playerMark && squares[b] === playerMark && !squares[c]) return c;
    if (squares[a] === playerMark && squares[c] === playerMark && !squares[b]) return b;
    if (squares[b] === playerMark && squares[c] === playerMark && !squares[a]) return a;
  }

  // Si no puede bloquear o ganar, movimiento aleatorio
  return calculateAiMoveEasy(squares);
};

// IA Difícil - Minimax
const minimax = (squares, depth, isMaximizing, aiMark, playerMark) => {
  const winner = calculateWinner(squares);
  if (winner) {
    if (winner.winner === aiMark) return { score: 10 - depth };
    if (winner.winner === playerMark) return { score: depth - 10 };
    return { score: 0 };
  }

  if (squares.every(square => square !== null)) return { score: 0 }; // Empate

  if (isMaximizing) {
    let bestScore = -Infinity;
    let bestMove = null;
    squares.forEach((square, index) => {
      if (!square) {
        squares[index] = aiMark;
        let result = minimax(squares, depth + 1, false, aiMark, playerMark);
        squares[index] = null;
        if (result.score > bestScore) {
          bestScore = result.score;
          bestMove = index;
        }
      }
    });
    return { score: bestScore, move: bestMove };
  } else {
    let bestScore = Infinity;
    let bestMove = null;
    squares.forEach((square, index) => {
      if (!square) {
        squares[index] = playerMark;
        let result = minimax(squares, depth + 1, true, aiMark, playerMark);
        squares[index] = null;
        if (result.score < bestScore) {
          bestScore = result.score;
          bestMove = index;
        }
      }
    });
    return { score: bestScore, move: bestMove };
  }
};

// Ejecutar el algoritmo minimax
export const calculateAiMoveHard = (squares, isXNext) => {
  const aiMark = isXNext ? 'X' : 'O';
  const playerMark = isXNext ? 'O' : 'X';
  const result = minimax(squares, 0, true, aiMark, playerMark);
  return result.move; // Retornar el mejor movimiento
};
