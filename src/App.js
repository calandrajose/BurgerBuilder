import React, { Component } from 'react'
import Layout from './hoc/Layout/Layout'
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder'
import Checkout from './containers/Checkout/Checkout'
import Orders from './containers/Orders/Orders'
import { Route } from 'react-router-dom'
import Auth from './containers/Auth/Auth'
import Logout from './containers/Auth/Logout/Logout'

console.log(process.env.REACT_APP_FIREBASE_API_KEY)

class App extends Component {
  render() {
    return (
      <div>
        <Layout>
          <Route path='/checkout' component={Checkout}/>
          <Route path='/orders' component={Orders}/>
          <Route path='/logout' component={Logout}/>
          <Route path='/auth' exact component={Auth}/>
          <Route path='/' exact component={BurgerBuilder}/>
        </Layout>
      </div>
    )
  }
}

export default App;