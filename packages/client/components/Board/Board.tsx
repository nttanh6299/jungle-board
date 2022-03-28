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
import styles from './board.module.scss'

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
        className={styles.board}
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
                styles['board_item'],
                { [styles.selected]: dequal(selectedSquare, [row, col]) },
                {
                  [styles.canMove]: !!possibleMoves?.find((move) => dequal(move, { row, col })),
                },
              )}
            >
              <div
                className={clsx(
                  styles['board_square'],
                  { [styles.land]: isLand({ row, col }) },
                  { [styles.river]: isInRiver({ row, col }) },
                  { [styles.trap]: isInWTrap({ row, col }) || isInBTrap({ row, col }) },
                  { [styles.den]: isWDen({ row, col }) || isBDen({ row, col }) },
                )}
                onClick={() => onSelectSquare(row, col)}
              >
                <span
                  className={clsx(
                    { [styles.animal]: board && !!getPieceKind(board[row][col]) },
                    { [styles.opponent]: board && isOpponent(board, { row, col }) },
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
