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
      // the winner can be X, O, or no body
      winner: null,
      // is current player is X? Boolean value
      isX: true,
      // array of sum of powers of 2 in a straight line
      winningNumbers: [7, 56, 73, 84, 146, 273, 292, 448],
      // array of 9 numbers, where each element denotes 2**index, this will add up to find the winner
      gameField : null,
      // if the cell contains either X or O, this object will be updated
      playedCells: {}
    };
    // total clicks/moves yet
    this.moves = 0;
    // sum value of player X
    this.playerX = 0;
    // sum value of player O
    this.playerO = 0;
    this.pubnub = new PubNubReact({ publishKey: 'pub-c-7e22a6d7-89cf-4fdb-9af8-4c331b5922c0', subscribeKey: 'sub-c-86637cb6-c9f2-11e8-9ca5-92bdce849b25' });
    this.pubnub.init(this);
  }

  componentWillMount() {
    this.setState({gameField: this.getInitialGameField()})
    this.pubnub.subscribe({ channels: ['channel1'], withPresence: true });
    // Call when ever a new message is coming in channel1
    this.pubnub.getMessage('channel1', (message) => {
      this.reviewPubNubMessage(message)
    });
  }

  componentWillUnmount() {
    // unsubscribe all the active pubnub
    this.pubnub.unsubscribe({ channels: ['channel1'] });
  }

  /**
   * Update the Board based on the action
   * @param  {object} action contain the cell value and boolean isReset
   * @return {[type]}        call reset if isReset = true; else call updateBoard with the cellValue
   */

  reviewPubNubMessage = (action) => {
    const { cellValue, isReset } = action.message;
    if (isReset) {
      this.resetBoard()
      return
    }
    this.updateBoard(cellValue)
  }

  /**
   * Publish a pubnub action on every user interaction
   * @param  {number}  cell            the cell value where the user clicked
   * @param  {Boolean} [isReset=false] will be true if the user wanted to reset the game
   */
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

  /**
   * get values in each cell of the 3*3 game field
   * the values will be in the powers of 2, ie., 2**cell_index
   * @return {array} array of cell values
   */
  getInitialGameField () {
    let x, j,
      results = [];
    for (x = j = 0; j <= 8; x = ++j) {
      results.push(Math.pow(2, x));
    }
    return results;
  }

  /**
   * Get the current symbol to be rendered based on state value
   * @return {string} either X or O
   */
  currentSymbol = () => {
    if (this.state.isX) {
      return 'x';
    } else {
      return 'o';
    }
  }

  /**
   * Get the current player from state value
   * @return {number} the sum value of the current player (score of the player)
   */
  currentPlayer = () => {
    if (this.state.isX) {
      return this.playerX;
    } else {
      return this.playerO;
    }
  }

  /**
   * check whether the total value of the current player is present in the winningNumbers
   * if yes: current player wins
   * if no more cell left: no one wins
   */
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

  /**
   * Change the player
   * if X conpleted one step, then O will play next
   * @return {state} state will update by changing isX value
   */
  updateCurrentSymbol = () => {
    this.setState({isX: !this.state.isX})
  }

  /**
   * update the board with the current user input
   * check win conditions after every user click
   * update the user after every action
   * @param  {number} cellValue value of the cell clicked by the user
   */
  updateBoard = (cellValue) => {
    // add the value of the cell to the current players total score
    if (this.state.isX) {
      this.playerX += cellValue;
    } else {
      this.playerO += cellValue;
    }
    // update move after each user action
    this.moves++;
    let { playedCells } = this.state;
    if (!playedCells[cellValue]) playedCells[cellValue] = this.currentSymbol()
    this.setState({playedCells: playedCells})
    this.checkWinConditions();
    this.updateCurrentSymbol();
  }

  /**
   * Reset the board to start new game
   */
  resetBoard = () => {
    this.setState({isX: true, winner: null, playedCells: {}})
    this.playerX = 0;
    this.playerO = 0;
    this.moves = 0;
  }

  render () {
    return(
      <BoardSection>
        <Heading>XO - XO</Heading>
        <SubHeading>Hey! come and play realtime XO game</SubHeading>
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
