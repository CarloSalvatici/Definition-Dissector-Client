import './sass/main.scss'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import DefinitionDissectorMain from './pages/DefinitionDissectorMain'


ReactDOM.render(
  <div className="container">
    <DefinitionDissectorMain/>
  </div>,
  document.querySelector('#root')
)