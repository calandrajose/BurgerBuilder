import React from 'react';
import Logo  from '../../Logo/Logo'
import classes from './BurgerButton.module.css'

const burgerButton = (props) => (
    <button className={classes.BurgerButton} onClick={props.clicked}>
        <Logo/>
    </button>
)

export default burgerButton;