import React, { Component } from "react";
import Aux from "../../hoc/Auxiliary/Auxiliary";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axiosOrder from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrosHandler from '../../hoc/withErrorHandler/withErrorHandler'

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7,
};

class BurgerBuilder extends Component {
  state = {
    ingredients: {
      salad: 0,
      bacon: 0,
      cheese: 0,
      meat: 0,
    },
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false
  };

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = () => {
    // alert('great!'),
    this.setState({loading: true});
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice, //should be calculated on server side
      customer: {
        name: 'Jose Calandra',
        address: {
          street: 'Test 123',
          zipCode: '123456',
          country: 'Argentina'
        },
        email: 'test@test.com'
      },
      purchaseMethod: 'takeaway'
    };
    axiosOrder.post('/orders.json', order)
      .then(resp => this.setState({loading:false, purchasing:false}))
      .catch(err => this.setState({loading:false, purchasing:false}));

  };

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map(key => ingredients[key])
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    this.setState({ purchasable: sum > 0 });
  }

  addIngredientHandler = (type) => {
    let oldCount = this.state.ingredients[type];
    const updateCount = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients,
    };
    updatedIngredients[type] = updateCount;
    const oldPrice = this.state.totalPrice;
    const updatedPrice = oldPrice + INGREDIENT_PRICES[type];
    this.setState({
      ingredients: updatedIngredients,
      totalPrice: updatedPrice
    });
    this.updatePurchaseState(updatedIngredients);
  };

  removeIngredientHandler = (type) => {
    let updatedCounted = this.state.ingredients[type];
    if (updatedCounted <= 0) {
      return;
    }
    updatedCounted--;
    const updatedIngredients = {
      ...this.state.ingredients,
    };
    updatedIngredients[type] = updatedCounted;
    const oldPrice = this.state.totalPrice;
    const updatedPrice = oldPrice - INGREDIENT_PRICES[type];
    this.setState({
      totalPrice: updatedPrice,
      ingredients: updatedIngredients,
    });
    this.updatePurchaseState(updatedIngredients);
  };

  render() {
    const disabledInfo = {
      ...this.state.ingredients
    };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0; //returns true or false for every key value
    }

    let orderSummary = 
    <OrderSummary 
      price={this.state.totalPrice} 
      continue={this.purchaseContinueHandler} 
      cancel={this.purchaseCancelHandler} 
      ingredients={this.state.ingredients} />

    if(this.state.loading){
      orderSummary = <Spinner/>  
    }
    // if(this.state.purchasing){
    //   modal = (<Modal>
    //   <OrderSummary ingredients={this.state.ingredients}/>
    // </Modal>)
    // }

    return (
      <Aux>
        <Modal 
          show={this.state.purchasing} 
          modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
      </Modal>
        <Burger ingredients={this.state.ingredients} />
        <BuildControls
          price={this.state.totalPrice}
          disabled={disabledInfo}
          ingredientAdded={this.addIngredientHandler}
          ingredientRemoved={this.removeIngredientHandler}
          purchasable={this.state.purchasable}
          purchasing={this.purchaseHandler}
        />
      </Aux>
    );
  }
}

export default withErrosHandler(BurgerBuilder, axiosOrder)
