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
} from 'jungle-board-service'
import { AnimalPath } from 'constants/url'

const BOARD_ROWS = Array.from(Array(ROWS).keys())
const BOARD_COLS = Array.from(Array(COLS).keys())

interface IBoardProps {
  isPlaying: boolean
  board: Board
  selectedSquare: number[]
  onSelectSquare: (row: number, col: number) => void
  possibleMoves: BoardDelta[]
}

const GameBoard: React.FC<IBoardProps> = ({ board, selectedSquare, onSelectSquare, possibleMoves, isPlaying }) => {
  return (
    <div
      className={clsx(
        `[--square-width:45px] sm:[--square-width:50px]`,
        `[--square-height:45px] sm:[--square-height:50px]`,
      )}
    >
      <div
        className="relative border-2 border-solid border-green-600"
        style={{
          width: `calc(var(--square-width) * ${BOARD_COLS.length} + 4px)`,
          height: `calc(var(--square-width) * ${BOARD_ROWS.length} + 4px)`,
        }}
      >
        {BOARD_ROWS.map((row) =>
          BOARD_COLS.map((col) => {
            const piece = getPieceKind(board?.[row]?.[col])
            const cell = { row, col }

            return (
              <div
                key={`${row}|${col}|${board?.[row]?.[col]}`}
                style={{
                  width: 'var(--square-width)',
                  height: 'var(--square-height)',
                  top: `calc(var(--square-width) * ${row})`,
                  left: `calc(var(--square-height) * ${col})`,
                }}
                className={clsx(
                  'absolute border border-solid border-green-600 select-none',
                  { '!border-blue-600': dequal(selectedSquare, [row, col]) },
                  {
                    '!border-lime-300': !!possibleMoves?.find((move) => dequal(move, cell)),
                  },
                )}
              >
                <div
                  className={clsx(
                    'grid place-items-center w-full h-full p-1',
                    { 'md:cursor-pointer': isPlaying },
                    { 'bg-green-500': isLand(cell) },
                    { 'bg-cyan-400': isInRiver(cell) },
                    { 'bg-yellow-700': isInWTrap(cell) || isInBTrap(cell) },
                    { 'bg-player': isBDen(cell) },
                    { 'bg-opponent': isWDen(cell) },
                  )}
                  onClick={() => onSelectSquare(row, col)}
                >
                  <div
                    className={clsx(
                      'overflow-hidden w-full h-full',
                      { 'drop-shadow-[3px_3px_5px_blue]': board && !isOpponent(board, cell) },
                      { 'drop-shadow-[3px_3px_5px_red]': board && isOpponent(board, cell) },
                    )}
                  >
                    {board && piece ? (
                      <img src={piece ? AnimalPath[piece] : ''} alt={piece} width="100%" height="100%" loading="lazy" />
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
