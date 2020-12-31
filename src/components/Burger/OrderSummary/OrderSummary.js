import React from 'react';
import Aux from '../../../hoc/Auxiliary'
import Button from '../../UI/Button/Button'

const orderSummary = (props) => {
    const ingredientSummary = Object.keys(props.ingredients)
    .map(ingKey=> <li key={ingKey}><span style={{textTransform:'capitalize'}}>{ingKey}</span>: {props.ingredients[ingKey]} </li>);

    return(
    <Aux>
        <h3>Your order</h3>
        <p>A delicious burgu</p>
        <ul>{ingredientSummary}</ul>
        <p>Total: <strong>USD {props.price.toFixed(2)}</strong></p>
        <p>Continue with Checkout?</p>
        <Button type={'Success'} clicked={props.continue}>CONTINUE</Button>
        <Button type={'Danger'} clicked={props.cancel}>CANCEL</Button>
    </Aux>
    )};

export default orderSummary;