import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

import { BoardCell } from 'components'

const propTypes = {
  gameField: PropTypes.array.isRequired,
  updateBoard: PropTypes.func.isRequired,
  currentSymbol: PropTypes.string.isRequired,
  publishAction: PropTypes.func.isRequired,
  winner: PropTypes.string.isRequired
}
const defaultProps = {}

const BoardBox = styled.div`
  width: 500px;
  margin: 2em auto;
  height: 500px;
  display: grid;
  grid-template: 1fr 1fr 1fr / 1fr 1fr 1fr;
  grid-gap: 1em;
  background: #fbe487;
  padding: 1em;
  border-radius: .3em;
`

const WinnerBox = styled.div`
  width: 500px;
  margin: 2em auto;
  height: 500px;
  background: #fbe487;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: .3em;
`

const WinnerName = styled.p`
  font-size: 2em;
  font-family: avenir;
  color: #2f5bb7;
`

const Button = styled.button`
  border: none;
  padding: 0.7rem 2.8rem;
  background: #e30668;
  color: white;
  font-size: 1.5em;
  border-radius: 3em;
  cursor: pointer;
  outline: none;
`

const Board = (props) => {
  const { gameField, updateBoard, currentSymbol, publishAction, winner } = props

  // show winner screen if the winner is present
  // Can make this as a new component later
  if (winner) {
    return (
      <WinnerBox>
        <WinnerName><b>{winner}</b> won the game</WinnerName>
        <Button onClick={() =>publishAction(null, true)}>Play again</Button>
      </WinnerBox>
    )
  }

  // show the game screen if winner is not declared yet
  return (
    <BoardBox>
      {gameField.map((value) => {
        return (
          <BoardCell
            key={value}
            value={value}
            {...props}
          />
        )
      })}
    </BoardBox>
  )
}

export default Board
