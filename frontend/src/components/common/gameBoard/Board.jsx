import Square from './Square'
import WinningLine from './WinningLine'

const Board = ({ squares, onClick, index, winningLineClass }) => {
  return (
    <div className="relative z-10 grid grid-cols-3 gap-[.625rem] w-52 mx-auto">
      {squares.map((value, index) => (
        <Square
          key={index}
          value={value}
          onClick={() => onClick(index)}
          index={index}
        />
      ))}
      <WinningLine winningLineClass={winningLineClass} />
    </div>
  )
}

export default Board
