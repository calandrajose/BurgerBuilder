import React, { Component, lazy, Suspense } from 'react';
import { Route, Redirect, withRouter, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import Layout from './hoc/Layout/Layout';
import asyncComponent from './hoc/asyncComponent/asyncComponent';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
// import Checkout from './containers/Checkout/Checkout';
// import Orders from './containers/Orders/Orders';
// import Auth from './containers/Auth/Auth';

import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';

const asyncCheckout = asyncComponent (()=>{
  return import('./containers/Checkout/Checkout')
})

const asyncAuth = asyncComponent (()=>{
  return import('./containers/Auth/Auth')
})

const asyncOrder = asyncComponent (()=>{
  return import('./containers/Orders/Orders')
})

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
  }
  
  render() {
  
      let routes = (
        <div>
          <Switch>
            <Route path='/auth' exact component={asyncAuth} />
            <Route path='/' exact component={BurgerBuilder} />
            <Redirect to='/'/>
            <Redirect to='/'/>
          </Switch>
        </div>
      )

      if(this.props.isAuthenticated){
        routes = (
          <div>
            <Switch>
              <Route path='/checkout' component={asyncCheckout} />
              <Route path='/orders' component={asyncOrder} />
              <Route path='/logout' component={Logout} />
              <Route path='/' exact component={BurgerBuilder} />
              <Route path='/auth' exact component={asyncAuth} />
              {<Redirect to='/'/>}
            </Switch>
          </div>
        )
      }

    return (
      <div>
        <Layout>
          {routes}
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = state=>{
  return{
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));