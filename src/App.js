import { useState } from "react";

function Square({ value, onSquareClick, highlight }) {
  return ( 
    <button 
      className={"square" + (highlight ? " highlight" : "")}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const winInfo = calculateWinner(squares);
  const winner = winInfo?.winner;
  const winLine = winInfo?.line || [];

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares, i);
  }

  let status = winner ? "Winner: " + winner : !squares.includes(null) ? "Draw!" : "Next player: " + (xIsNext ? "X" : "O");

  const boardSize = 3;
  let boardRows = [];
  for (let i = 0; i < boardSize; i++) {
    let rowSquares = [];
    for (let j = 0; j < boardSize; j++) {
      const index = i * boardSize + j;
      rowSquares.push(
        <Square 
          key={index}
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
          highlight={winLine.includes(index)}
        />
      );
    }
    boardRows.push(
      <div key={i} className="board-row">
        {rowSquares}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{
    squares: Array(9).fill(null),
    lastMoveIndex: null
  }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const current = history[currentMove];

  function handlePlay(nextSquares, index) {
    const nextHistory = [...history.slice(0, currentMove + 1), 
      {squares: nextSquares, lastMoveIndex: index }
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  const moves = history.map((step, move) => {
    let description;
    if (move > 0) {
      const row = Math.floor(step.lastMoveIndex / 3) + 1;
      const col = (step.lastMoveIndex % 3) + 1;
      description = `Go to move #${move} (row: ${row}, col: ${col})`;
    } else {
      description = 'Go to game start';
    }

    return (
      <li key={move}> 
        {move === currentMove ? (
          <span>You are at move #{move}</span>
      ) : (
        <button onClick={() => setCurrentMove(move)}>{description}</button>
      )}
      </li>
    );
  });

  const sortedMoves = isAscending ? moves : [...moves].reverse();

  return (
   <div className="game">
    <div className="game-board">
      <Board xIsNext={xIsNext} squares={current.squares} onPlay={handlePlay} />
    </div>
    <div className="game-info">
      <button onClick={() => setIsAscending(!isAscending)}>
        Sort by: {isAscending ? "Ascending" : "Descending"}
      </button>
      <ol>{sortedMoves}</ol>
    </div>
   </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}