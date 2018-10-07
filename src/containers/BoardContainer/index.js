import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import PubNubReact from 'pubnub-react';

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
      gameField : null,
      playedCells: {}
    };
    this.moves = 0;
    this.playerX = 0;
    this.playerO = 0;
    this.pubnub = new PubNubReact({ publishKey: 'pub-c-7e22a6d7-89cf-4fdb-9af8-4c331b5922c0', subscribeKey: 'sub-c-86637cb6-c9f2-11e8-9ca5-92bdce849b25' });
    this.pubnub.init(this);
  }

  componentWillMount() {
    this.setState({gameField: this.getInitialGameField()})
    this.pubnub.subscribe({ channels: ['channel1'], withPresence: true });

    this.pubnub.getMessage('channel1', (message) => {
      this.reviewPubNubMessage(message)
    });
  }

  componentWillUnmount() {
    this.pubnub.unsubscribe({ channels: ['channel1'] });
  }

  reviewPubNubMessage = (action) => {
    const { cellValue, isReset } = action.message;
    if (isReset) {
      this.resetBoard()
      return
    }
    this.updateBoard(cellValue)
  }

  publishAction = (cell, isReset = false) => {
    let action = {
      channel: 'channel1',
      message: {
        cellValue: cell,
        isReset: isReset
      }
    }
    this.pubnub.publish(action, (response) => {
      console.log("response", response);
    });
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
    if (this.state.isX) {
      this.playerX += cellValue;
    } else {
      this.playerO += cellValue;
    }
    this.moves++;
    let { playedCells } = this.state;
    if (!playedCells[cellValue]) playedCells[cellValue] = this.currentSymbol()
    this.setState({playedCells: playedCells})
    this.checkWinConditions();
    this.updateCurrentSymbol();
  }

  resetBoard = () => {
    this.setState({isX: true, winner: null, playedCells: []})
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
          publishAction={this.publishAction}
          playedCells={this.state.playedCells}
        />
      </BoardSection>
    );
  }
}

BoardContainer.propTypes = propTypes
BoardContainer.defaultProps = defaultProps

export default BoardContainer
