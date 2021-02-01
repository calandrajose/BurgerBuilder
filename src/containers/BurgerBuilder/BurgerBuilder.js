import React, { useEffect, useState } from "react";
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


const BurgerBuilder = props=> {
  const [purchasing, setPurchasing] = useState(false)
  const {onInitIngredients} = props;

  useEffect(()=>{
    onInitIngredients()
  }, [onInitIngredients])


  const purchaseHandler = () => {
    if(props.isAuthenticated){
      setPurchasing(true)
    }else{
      props.onSetAuthRedirectPath('/checkout')
      props.history.push('/auth')
    }
  };

  const purchaseCancelHandler = () => {
    if(props.isAuthenticated){
      setPurchasing(false)
    }
  }

  const purchaseContinueHandler = () => {
    props.onInitPurchase();
    props.history.push({pathname: '/checkout'// search: '?' + queryString
    });
  };

  const updatePurchaseState = ()=> {
    const sum = Object.keys(props.ings)
      .map(key => props.ings[key])
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    return sum > 0;
  }

    const disabledInfo = {
      ...props.ings
    };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0; //returns true or false for every key value
    }

    let orderSummary = null;
    let burger = props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;



    if (props.ings) {
      burger = (
        <Aux>
          <Burger ingredients={props.ings} />
          <BuildControls
            price={props.price}
            disabled={disabledInfo}
            ingredientAdded={props.onIngredientAdded}
            ingredientRemoved={props.onIngredientRemoved}
            purchasable={updatePurchaseState()}
            purchasing={purchaseHandler}
            isAuth =  {props.isAuthenticated}
          />
        </Aux>
      );
      orderSummary =
        <OrderSummary
          price={props.price}
          continue={purchaseContinueHandler}
          cancel={purchaseCancelHandler}
          ingredients={props.ings} />;
    }

    return (
      <Aux>
        
        <Modal
          show={purchasing}
          modalClosed={purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
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
