import React from 'react';
import classes from './NavigationItems.module.css'
import NavigationItem from './NagationItem/NavigationItem'

const navigationItems = (props) => (
    <ul className={classes.NavigationItems}>
        <NavigationItem link='/' >Home</NavigationItem>
        {props.isAuthenticated ? <NavigationItem link='/orders'>My Orders</NavigationItem> : null}
        {props.isAuthenticated 
            ? <NavigationItem link='/logout'>Logout</NavigationItem> 
            : <NavigationItem link='/auth'>Login</NavigationItem>}
    </ul>
)


export default navigationItems;