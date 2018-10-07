import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'

const propTypes = {
  playedCells: PropTypes.object.isRequired,
  value: PropTypes.number.isRequired,
  currentSymbol: PropTypes.string.isRequired
}


const BoardCellField = styled.div`
  background: #2f5bb7;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 7em;
  font-family: avenir;
  color: white;
  line-height: .5;
`

class BoardCell extends Component{
  constructor(props){
  	super(props);
    const { playedCells, value, currentSymbol } = props;
  	this.state = {
      // if the field is already clicked by any of the user, then fill it
      symbol: playedCells[value] ? playedCells[value]: null
    };
  }

  componentWillReceiveProps(nextProps, prevProps) {
    if (JSON.stringify(nextProps.playedCells) !== JSON.stringify(prevProps.playedCells)) {
      const { playedCells, value, currentSymbol } = nextProps;
      // if the field is already clicked by any of the user, then fill it
      this.setState({symbol:playedCells[value] ? playedCells[value]: null})
    }
  }
  updateCell = () => {
    const { currentSymbol, updateBoard, value, publishAction } = this.props;
    // if symbol is already present in the cell, then return
    if(this.state.symbol)
      return
    this.setState({symbol: currentSymbol})
    // call publishAction with the clicked cell value
    publishAction(value);
  }

  render () {
    const { symbol } = this.state
    return(
      <BoardCellField
        onClick={this.updateCell}
      >
        {symbol}
      </BoardCellField>
    );
  }
}

BoardCell.propTypes = propTypes

export default BoardCell
