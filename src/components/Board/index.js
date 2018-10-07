import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

import { BoardCell } from 'components'

const propTypes = {}
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
`

const Board = (props) => {
  const { gameField, updateBoard, currentSymbol, publishAction, winner } = props
  if (winner) {
    return (
      <WinnerBox>
        <WinnerName><b>{winner}</b> won the game</WinnerName>
        <Button onClick={() =>publishAction(null, true)}>Play again</Button>
      </WinnerBox>
    )
  }
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
