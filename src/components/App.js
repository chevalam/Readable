import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import HomePage from './HomePage'
import Category from './Category'
import PostDetail from './PostDetail'


class App extends Component {
  render() {
    return (
      <BrowserRouter>
      <Switch>
      <Route exact path='/' component={HomePage} />
      <Route exact path='/:category' component={Category} />
      <Route path='/:category/:post_id' component={PostDetail} />
      </Switch>
      </BrowserRouter>
    )
  }
}

export default App
