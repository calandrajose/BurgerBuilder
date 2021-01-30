import React, { useEffect, Suspense} from 'react';
import { Route, Redirect, withRouter, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';

const Checkout = React.lazy(()=>{
  return import('./containers/Checkout/Checkout')
})

const Auth = React.lazy(()=>{
  return import('./containers/Auth/Auth')
})

const Orders = React.lazy(()=>{
  return import('./containers/Orders/Orders')
})

const App = props => {

  useEffect(()=>{
    props.onTryAutoSignup();
  },[]) 
  
      let routes = (
        <div>
          <Switch>
            <Route path='/auth' render={()=><Auth/>} />
            <Route path='/' exact component={BurgerBuilder} />
            <Redirect to='/'/>
          </Switch>
        </div>
      )

      if(props.isAuthenticated){
        routes = (
          <div>
            <Switch>
              <Route path='/checkout' render={()=><Checkout/>} />
              <Route path='/orders' render={()=><Orders/>} />
              <Route path='/logout' component={Logout} />
              <Route path='/auth' render={()=><Auth/>} />
              <Route path='/' exact component={BurgerBuilder} />
              <Redirect to='/'/>
            </Switch>
          </div>
        )
      }

    return (
      <div>
        <Layout>
          <Suspense fallback={<p>Loading...</p>}>{routes}</Suspense>
        </Layout>
      </div>
    );
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