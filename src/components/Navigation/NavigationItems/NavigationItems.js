import React from 'react';
import classes from './NavigationItems.module.css'
import NavigationItem from './NagationItem/NavigationItem'

const navigationItems = () => (
    <ul className={classes.NavigationItems}>
        <NavigationItem link='/' >Home</NavigationItem>
        <NavigationItem link='/orders'>My Orders</NavigationItem>
    </ul>
)


export default navigationItems;