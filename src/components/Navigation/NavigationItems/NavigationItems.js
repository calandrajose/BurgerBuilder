import React from 'react';
import classes from './NavigationItems.module.css'
import NavigationItem from './NagationItem/NavigationItem'

const navigationItems = () => (
    <ul className={classes.NavigationItems}>
        <NavigationItem link='/' active>Home</NavigationItem>
        <NavigationItem link='/'>Checkout</NavigationItem>
    </ul>
)


export default navigationItems;