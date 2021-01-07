import React from 'react';
import classes from './Order.module.css'

const order = (props) => {

    const ingredients = []; 
    for(let ingredient in props.ingredients ){
        ingredients.push({name:ingredient, amount: props.ingredients[ingredient]})
    }

    const output = ingredients.map((ing)=> <span className={classes.Ingredient}>{ing.name}({ing.amount})</span>)


    return (
        <div className={classes.Order}>
            <p>Ingredients: {output} </p>
            <p>Price: <strong>{parseFloat(props.price).toFixed(2)}</strong></p>
        </div>
    );
};

export default order;