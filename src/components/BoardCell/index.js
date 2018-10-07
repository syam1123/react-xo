import React, { Component } from 'react'
import styled, { css } from 'styled-components'

class BoardCell extends Component{
  constructor(props){
  	super(props);
    const { playedCells, value, currentSymbol } = props;
  	this.state = {
      symbol: playedCells[value] ? playedCells[value]: null
    };
  }

  componentWillReceiveProps(nextProps, prevProps) {
    if (JSON.stringify(nextProps.playedCells) !== JSON.stringify(prevProps.playedCells)) {
      const { playedCells, value, currentSymbol } = nextProps;
      this.setState({symbol:playedCells[value] ? playedCells[value]: null})
    }
  }
  updateCell = () => {
    const { currentSymbol, updateBoard, value, publishAction } = this.props;
    if(this.state.symbol)
      return
    this.setState({symbol: currentSymbol})
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

export default BoardCell
