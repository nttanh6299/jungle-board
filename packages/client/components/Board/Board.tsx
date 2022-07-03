import React from 'react'
import clsx from 'clsx'
import { dequal } from 'dequal'
import {
  Board,
  ROWS,
  COLS,
  isLand,
  isInRiver,
  isInWTrap,
  isInBTrap,
  isBDen,
  isWDen,
  getPieceKind,
  isOpponent,
  BoardDelta,
} from '@jungle-board/service/lib/gameLogic'

const BOARD_ROWS = Array.from(Array(ROWS).keys())
const BOARD_COLS = Array.from(Array(COLS).keys())

const SQUARE_WIDTH = 70
const SQUARE_HEIGHT = 70

interface IBoardProps {
  board: Board
  selectedSquare: number[]
  onSelectSquare: (row: number, col: number) => void
  possibleMoves: BoardDelta[]
}

const GameBoard: React.FC<IBoardProps> = ({ board, selectedSquare, onSelectSquare, possibleMoves }) => {
  return (
    <div>
      <div
        className="relative"
        style={{
          width: SQUARE_WIDTH * BOARD_COLS.length,
          height: SQUARE_HEIGHT * BOARD_ROWS.length,
        }}
      >
        {BOARD_ROWS.map((row) =>
          BOARD_COLS.map((col) => (
            <div
              key={`${row}${col}`}
              style={{
                width: SQUARE_WIDTH,
                height: SQUARE_HEIGHT,
                top: row * SQUARE_WIDTH,
                left: col * SQUARE_HEIGHT,
              }}
              className={clsx(
                'absolute border-2 border-solid',
                { 'border-red-400': dequal(selectedSquare, [row, col]) },
                {
                  'border-green-400': !!possibleMoves?.find((move) => dequal(move, { row, col })),
                },
                'border-yellow-300',
              )}
            >
              <div
                className={clsx(
                  'grid place-items-center cursor-pointer w-full h-full',
                  { 'bg-land': isLand({ row, col }) },
                  { 'bg-river': isInRiver({ row, col }) },
                  { 'bg-trap': isInWTrap({ row, col }) || isInBTrap({ row, col }) },
                  { 'bg-den': isWDen({ row, col }) || isBDen({ row, col }) },
                )}
                onClick={() => onSelectSquare(row, col)}
              >
                <span
                  className={clsx(
                    { 'text-xl text-white': board && !!getPieceKind(board[row][col]) },
                    { 'text-black bg-white': board && isOpponent(board, { row, col }) },
                    { 'bg-black': board && !isOpponent(board, { row, col }) },
                  )}
                >
                  {board ? getPieceKind(board[row][col]) : ''}
                </span>
              </div>
            </div>
          )),
        )}
      </div>
    </div>
  )
}

export default GameBoard
