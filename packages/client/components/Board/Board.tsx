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
import { ThemeConfig } from 'apis/item'

const BOARD_ROWS = Array.from(Array(ROWS).keys())
const BOARD_COLS = Array.from(Array(COLS).keys())

interface IBoardProps {
  isPlaying: boolean
  board: Board
  selectedSquare: number[]
  onSelectSquare: (row: number, col: number) => void
  possibleMoves: BoardDelta[]
  config?: ThemeConfig
}

const GameBoard: React.FC<IBoardProps> = ({
  board,
  selectedSquare,
  onSelectSquare,
  possibleMoves,
  isPlaying,
  config,
}) => {
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
          borderColor: config?.borderLand,
          width: `calc(var(--square-width) * ${BOARD_COLS.length} + 4px)`,
          height: `calc(var(--square-width) * ${BOARD_ROWS.length} + 4px)`,
        }}
      >
        {BOARD_ROWS.map((row) =>
          BOARD_COLS.map((col) => {
            const piece = getPieceKind(board?.[row]?.[col])
            const cell = { row, col }
            const isCellLand = isLand(cell)
            const isCellRiver = isInRiver(cell)
            const isCellTrap = isInWTrap(cell) || isInBTrap(cell)
            const isPlayerDen = isBDen(cell)
            const isOpponentDen = isWDen(cell)
            const isCellSelected = dequal(selectedSquare, [row, col])
            const isPossibleMove = !!possibleMoves?.find((move) => dequal(move, cell))

            return (
              <div
                key={`${row}|${col}|${board?.[row]?.[col]}`}
                style={{
                  width: 'var(--square-width)',
                  height: 'var(--square-height)',
                  top: `calc(var(--square-width) * ${row})`,
                  left: `calc(var(--square-height) * ${col})`,
                  borderColor: isCellSelected
                    ? config?.borderSelected || 'white'
                    : isPossibleMove
                    ? config?.borderPossibleMove || 'white'
                    : config?.borderLand,
                }}
                className="absolute border border-solid border-green-600 select-none"
              >
                <div
                  style={{
                    backgroundColor: clsx({
                      [config?.land]: isCellLand,
                      [config?.river]: isCellRiver,
                      [config?.trap]: isCellTrap,
                      [config?.playerDen]: isPlayerDen,
                      [config?.opponentDen]: isOpponentDen,
                    }),
                  }}
                  className={clsx(
                    'grid place-items-center w-full h-full',
                    { 'md:cursor-pointer': isPlaying },
                    // default value if config is not set
                    { 'bg-green-500': isCellLand },
                    { 'bg-cyan-400': isCellRiver },
                    { 'bg-yellow-700': isCellTrap },
                    { 'bg-player': isPlayerDen },
                    { 'bg-opponent': isOpponentDen },
                  )}
                  onClick={() => onSelectSquare(row, col)}
                >
                  <div
                    className={clsx(
                      'overflow-hidden w-full h-full p-1',
                      { 'drop-shadow-[2px_2px_4px_blue]': board && !isOpponent(board, cell) },
                      { 'drop-shadow-[2px_2px_4px_red]': board && isOpponent(board, cell) },
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
