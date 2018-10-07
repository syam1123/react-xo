import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { Heading, SubHeading, Board } from 'components'

const propTypes = {}
const defaultProps = {}

const BoardSection = styled.div`
  text-align: center;
`

class BoardContainer extends Component {
  constructor(props){
  	super(props);
  	this.state = {
      winner: null,
      isX: true,
      winningNumbers: [7, 56, 448, 73, 146, 292, 273, 84],
      gameField : null
    };
    this.moves = 0;
    this.playerX = 0;
    this.playerO = 0;
  }

  componentWillMount() {
    this.setState({gameField: this.getInitialGameField()})
  }

  getInitialGameField () {
    let x, j,
      results = [];
    for (x = j = 0; j <= 8; x = ++j) {
      results.push(Math.pow(2, x));
    }
    return results;
  }

  currentSymbol = () => {
    if (this.state.isX) {
      return 'x';
    } else {
      return 'o';
    }
  }

  currentPlayer = () => {
    if (this.state.isX) {
      return this.playerX;
    } else {
      return this.playerO;
    }
  }

  checkWinConditions () {
    let j, len, number, ref;
    const { winningNumbers } = this.state
    for (j = 0, len = winningNumbers.length; j < len; j++) {
      number = winningNumbers[j];
      console.log("number", number, this.currentPlayer());
      if ((number & this.currentPlayer()) === number) {
        this.setState({winner: `Player ${this.currentSymbol().toUpperCase()}`})
      }
    }
    if (this.moves > 8) {
      this.setState({winner: 'No body'})
    }
  }

  updateCurrentSymbol = () => {
    this.setState({isX: !this.state.isX})
  }

  updateBoard = (cellValue) => {
    console.log("cellValue",cellValue);
    if (this.state.isX) {
      this.playerX += cellValue;
    } else {
      this.playerO += cellValue;
    }
    this.moves++;
    this.checkWinConditions();
    this.updateCurrentSymbol();
  }

  resetBoard = () => {
    this.setState({isX: true, winner: null})
    this.playerX = 0;
    this.playerO = 0;
    this.moves = 0;
  }

  render () {
    return(
      <BoardSection>
        <Heading>XO - XO</Heading>
        <SubHeading>Hey! come and place realtime XO game</SubHeading>
        <Board
          currentSymbol={this.currentSymbol()}
          updateBoard={this.updateBoard}
          resetBoard={this.resetBoard}
          gameField={this.state.gameField}
          winner={this.state.winner}
          resetBoard={this.resetBoard}
        />
      </BoardSection>
    );
  }
}

BoardContainer.propTypes = propTypes
BoardContainer.defaultProps = defaultProps

export default BoardContainer
