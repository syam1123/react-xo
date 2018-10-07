import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { BoardContainer } from 'containers'

const propTypes = {}
const defaultProps = {}

class App extends Component {
  render () {
    return(
      <BoardContainer />
    );
  }
}

App.propTypes = propTypes
App.defaultProps = defaultProps

export default App
