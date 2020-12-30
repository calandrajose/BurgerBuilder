import React from 'react';
import classes from './Burguer.module.css'
import BurguerIngredient from './BurguerIngredient/BurguerIngredient';

const burguer = (props) => {

    const ingredients = Object.keys(props.ingredients)
    .map(ingKey=>{
        return [...Array(props.ingredients[ingKey])].map((_, index)=>{
            return <BurguerIngredient key={ingKey + index} type= {ingKey}/>
        })
    })
    .reduce((arr, ing)=>{
        return arr.concat(ing)
    }, [])

    console.log(ingredients);

    return (
        <div className={classes.Burguer}>
            <BurguerIngredient type='bread-top'/>
            {ingredients.length === 0 ? <p>Start adding ingredients</p>: ingredients}
            <BurguerIngredient type='bread-bottom'/>
        </div>
    );
};

export default burguer;