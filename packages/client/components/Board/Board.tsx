import React from 'react'
import NextImage from 'next/image'
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
import { AnimalPath } from 'constants/url'

const BOARD_ROWS = Array.from(Array(ROWS).keys())
const BOARD_COLS = Array.from(Array(COLS).keys())

const SQUARE_WIDTH = 60
const SQUARE_HEIGHT = 60

// plus 4 because of border-2
const BOARD_WIDTH = SQUARE_WIDTH * BOARD_COLS.length + 4
const BOARD_HEIGHT = SQUARE_HEIGHT * BOARD_ROWS.length + 4

interface IBoardProps {
  isPlaying: boolean
  board: Board
  selectedSquare: number[]
  onSelectSquare: (row: number, col: number) => void
  possibleMoves: BoardDelta[]
}

const GameBoard: React.FC<IBoardProps> = ({ board, selectedSquare, onSelectSquare, possibleMoves, isPlaying }) => {
  return (
    <div>
      <div
        className="relative border-2 border-solid border-green-600"
        style={{
          width: BOARD_WIDTH,
          height: BOARD_HEIGHT,
        }}
      >
        {BOARD_ROWS.map((row) =>
          BOARD_COLS.map((col) => {
            const piece = getPieceKind(board?.[row]?.[col])
            const cell = { row, col }

            return (
              <div
                key={`${row}${col}`}
                style={{
                  width: SQUARE_WIDTH,
                  height: SQUARE_HEIGHT,
                  top: row * SQUARE_WIDTH,
                  left: col * SQUARE_HEIGHT,
                }}
                className={clsx(
                  'absolute border-2 border-solid border-green-600',
                  { '!border-blue-600': dequal(selectedSquare, [row, col]) },
                  {
                    '!border-lime-300': !!possibleMoves?.find((move) => dequal(move, cell)),
                  },
                )}
              >
                <div
                  className={clsx(
                    'grid place-items-center w-full h-full',
                    { 'cursor-pointer': isPlaying },
                    { 'bg-green-500': isLand(cell) },
                    { 'bg-cyan-400': isInRiver(cell) },
                    { 'bg-yellow-700': isInWTrap(cell) || isInBTrap(cell) },
                    { 'bg-yellow-800': isWDen(cell) || isBDen(cell) },
                  )}
                  onClick={() => onSelectSquare(row, col)}
                >
                  <div
                    className={clsx(
                      'overflow-hidden h-full',
                      { 'text-xl drop-shadow-[3px_3px_5px_blue]': board && !!piece },
                      { '!drop-shadow-[3px_3px_5px_red]': board && isOpponent(board, cell) },
                    )}
                  >
                    {board && piece ? (
                      <NextImage src={piece ? AnimalPath[piece] : ''} alt={piece} width="100%" height="100%" priority />
                    ) : null}
                  </div>
                </div>
              </div>
            )
          }),
        )}
      </div>
    </div>
  )
}

export default GameBoard
