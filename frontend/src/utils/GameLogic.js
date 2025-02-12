// Determinar si hay un ganador
export const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
    [0, 4, 8], [2, 4, 6] // Diagonales
  ]

  for (let line of lines) {
    const [a, b, c] = line
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line }; // Devuelve el ganador y la línea ganadora
    }
  }
  return null // Si no hay ganador
}

// Determinar el estilo de la línea ganadora
export const getWinningLineClass = (line) => {
  const lineClassMap = {
    '0,1,2': 'horizontal-top',
    '3,4,5': 'horizontal-middle',
    '6,7,8': 'horizontal-bottom',
    '0,3,6': 'vertical-left',
    '1,4,7': 'vertical-middle',
    '2,5,8': 'vertical-right',
    '0,4,8': 'diagonal-main',
    '2,4,6': 'diagonal-secondary'
  }
  return lineClassMap[line.join(',')]
}

// Obtener el estado de la ronda (ganador o empate)
export const getRoundStatus = (winner, player1, player2, isXNext) => {
  if (winner === 'Draw') {
    return "It's a draw!"
  } else if (winner) {
    return winner === 'X' ? `Winner: ${player1}` : `Winner: ${player2}`
  } else {
    return `${isXNext ? player1 : player2}'s turn`
  }
}
