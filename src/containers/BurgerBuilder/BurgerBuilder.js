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
import * as actionTypes from '../../store/actions'

// const INGREDIENT_PRICES = {
//   salad: 0.5,
//   cheese: 0.4,
//   meat: 1.3,
//   bacon: 0.7,
// };

class BurgerBuilder extends Component {
  state = {
    // ingredients: null,
    // totalPrice: 4,
    // purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  };

  componentDidMount() {
    axios.get('/ingredients.json')
      .then(resp => {
        this.setState({ ingredients: resp.data });
      })
      .catch(error => { this.setState({error: true})});
  }

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = () => {
    // const queryParams = [];
    // for (let i in this.state.ingredients) {
    //   queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
    // }
    // queryParams.push('price='+this.state.totalPrice)

    // const queryString = queryParams.join('&');

    this.props.history.push({pathname: '/checkout'// search: '?' + queryString
    }
    );

  };

  updatePurchaseState() {
    const sum = Object.keys(this.props.ings)
      .map(key => this.props.ings[key])
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    return sum > 0;
  }

  addIngredientHandler = (type) => {
  //   let oldCount = this.state.ingredients[type];
  //   const updateCount = oldCount + 1;
  //   const updatedIngredients = {
  //     ...this.state.ingredients,
  //   };
  //   updatedIngredients[type] = updateCount;
  //   const oldPrice = this.state.totalPrice;
  //   const updatedPrice = oldPrice + INGREDIENT_PRICES[type];
  //   this.setState({
  //     ingredients: updatedIngredients,
  //     totalPrice: updatedPrice
  //   });
  //   this.updatePurchaseState(updatedIngredients);
  };

  removeIngredientHandler = (type) => {
  //   let updatedCounted = this.state.ingredients[type];
  //   if (updatedCounted <= 0) {
  //     return;
  //   }
  //   updatedCounted--;
  //   const updatedIngredients = {
  //     ...this.state.ingredients,
  //   };
  //   updatedIngredients[type] = updatedCounted;
  //   const oldPrice = this.state.totalPrice;
  //   const updatedPrice = oldPrice - INGREDIENT_PRICES[type];
  //   this.setState({
  //     totalPrice: updatedPrice,
  //     ingredients: updatedIngredients,
  //   });
  //   this.updatePurchaseState(updatedIngredients);
  };

  render() {
    const disabledInfo = {
      // ...this.state.ingredients
      ...this.props.ings
    };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0; //returns true or false for every key value
    }

    let orderSummary = null;
    let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;



    if (this.props.ings) {
      burger = (
        <Aux>
          <Burger ingredients={this.props.ings} />
          <BuildControls
            // price={this.state.totalPrice}
            price={this.props.price}
            disabled={disabledInfo}
            // ingredientAdded={this.addIngredientHandler}
            // ingredientRemoved={this.removeIngredientHandler}
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRremoved}
            purchasable={this.updatePurchaseState()}
            purchasing={this.purchaseHandler}
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

    if (this.state.loading) {
      orderSummary = <Spinner />;
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
      ings: state.ingredients,
      price: state.totalPrice
  };
}

const mapDispatchToProps = dispatch =>{
  return{
    onIngredientAdded:(ingName)=>dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
    onIngredientRremoved:(ingName)=>dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
     
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrosHandler(BurgerBuilder, axios));
