import { useState } from 'react';

// Square Tile
function Square({value, onSquareClick, isHighlighted}) {
  let className = 'square';

  if(isHighlighted) {
    className = 'square highlight'
  }

  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

// decideWinner
// Part 4: Display the winer
function decideWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5],
    [6, 7, 8], [0, 3, 6],
    [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningLine: [a, b, c] };
    }
  }
  return null;
}

// Board
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (decideWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares, i); // record the location
  }

  const result = decideWinner(squares);

  let winner = null;
  let winningLine = [];
  
  if (result) {
    winner = result.winner;
    winningLine = result.winningLine;
  }

  const isDraw = !winner && squares.every(square => square !== null);

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (isDraw) {
    status = "It's a draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  // Part 2: Rewrite Board
  const board = [];
  for (let row = 0; row < 3; row++) {
    const rowSquares = [];
    
    for (let col = 0; col < 3; col++) {
      const index = row * 3 + col;
      rowSquares.push(
        <Square
          key={index}
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
          isHighlighted={winningLine.includes(index)}
        />
      );
    }
    board.push(
      <div key={row} className="board-row">
        {rowSquares}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

// Game
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true); // Remember if its sorted
  const [locations, setLocations] = useState([null]); 
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares, location) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setLocations([...locations.slice(0, currentMove + 1), location]); // Saves the clicked location
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    // Part 5: Boardgame's coordinate 
    let locationText = '';
    if (move > 0 && locations[move] !== null) {
      const row = Math.floor(locations[move] / 3) + 1;
      const col = (locations[move] % 3) + 1;
      locationText = ` (${row}, ${col})`;
    }

    // Part 1: Turn button to text
    if (move === currentMove) {
      return (
        <li key={move}>
          <span>You are at move #{move}{locationText}</span>
        </li>
      );
    }

    let description;
    if  (move > 0) {
      description = `Go to move #${move}${locationText}`;
    } else {
      description = 'Go to game start';
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  // Part 3: Reverse the order of moves array
  let sortedMoves = moves;

  if (!isAscending) {
    sortedMoves = moves.slice().reverse()
  }

  let sortButtonText = 'Sort: Ascending';
          
  if (!isAscending) {
    sortButtonText = 'Sort: Descending';
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => setIsAscending(!isAscending)}>
          {sortButtonText}
        </button>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
}