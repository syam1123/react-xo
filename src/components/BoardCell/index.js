import React, { Component } from 'react'
import styled, { css } from 'styled-components'

class BoardCell extends Component{
  constructor(props){
  	super(props);
  	this.state = {
      symbol: null
    };
  }

  updateCell = () => {
    const { currentSymbol, updateBoard, value } = this.props;
    if(this.state.symbol)
      return
    this.setState({symbol: currentSymbol})
    updateBoard(value)
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
