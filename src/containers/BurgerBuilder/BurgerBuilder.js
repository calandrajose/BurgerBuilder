import React, { Component } from "react";
import {connect} from 'react-redux'

import Aux from "../../hoc/Auxiliary/Auxiliary";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrosHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index'


class BurgerBuilder extends Component {
  state = {
    purchasing: false,
    loading: false,
    error: false
  };

  componentDidMount() {
    this.props.onInitIngredients()
  }

  purchaseHandler = () => {
    if(this.props.isAuthenticated){
      this.setState({ purchasing: true });
    }else{
      this.props.onSetAuthRedirectPath('/checkout')
      this.props.history.push('/auth')
    }
  };

  purchaseCancelHandler = () => {
    if(this.props.isAuthenticated){
      this.setState({ purchasing: false });
    }
  }

  purchaseContinueHandler = () => {
    this.props.onInitPurchase();
    this.props.history.push({pathname: '/checkout'// search: '?' + queryString
    });
  };

  updatePurchaseState() {
    const sum = Object.keys(this.props.ings)
      .map(key => this.props.ings[key])
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    return sum > 0;
  }

  render() {
    const disabledInfo = {
      ...this.props.ings
    };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0; //returns true or false for every key value
    }

    let orderSummary = null;
    let burger = this.props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;



    if (this.props.ings) {
      burger = (
        <Aux>
          <Burger ingredients={this.props.ings} />
          <BuildControls
            price={this.props.price}
            disabled={disabledInfo}
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved}
            purchasable={this.updatePurchaseState()}
            purchasing={this.purchaseHandler}
            isAuth =  {this.props.isAuthenticated}
          />
        </Aux>
      );
      orderSummary =
        <OrderSummary
          price={this.props.price}
          continue={this.purchaseContinueHandler}
          cancel={this.purchaseCancelHandler}
          ingredients={this.props.ings} />;
    }

    return (
      <Aux>
        
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
      ings: state.burgerBuilder.ingredients,
      price: state.burgerBuilder.totalPrice,
      error: state.burgerBuilder.error, 
      isAuthenticated: state.auth.token !== null
  };
}

const mapDispatchToProps = dispatch =>{
  return{
    onIngredientAdded:(ingName)=>dispatch(actions.addIngredient(ingName)),
    onIngredientRemoved:(ingName)=>dispatch(actions.removeIngredient(ingName)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
    onInitPurchase: ()=> dispatch(actions.purchaseInit()),
    onSetAuthRedirectPath: (path)=> dispatch(actions.setAuthRedirectPath(path))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrosHandler(BurgerBuilder, axios));
