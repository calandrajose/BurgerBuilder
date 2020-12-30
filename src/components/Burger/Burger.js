import React from 'react';
import classes from './Burger.module.css'
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {

    const ingredients = Object.keys(props.ingredients)
    .map(ingKey=>{
        return [...Array(props.ingredients[ingKey])].map((_, index)=>{
            return <BurgerIngredient key={ingKey + index} type= {ingKey}/>
        })
    })
    .reduce((arr, ing)=>{
        return arr.concat(ing)
    }, [])

    console.log(ingredients);

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type='bread-top'/>
            {ingredients.length === 0 ? <p>Start adding ingredients</p>: ingredients}
            <BurgerIngredient type='bread-bottom'/>
        </div>
    );
};

export default burger;