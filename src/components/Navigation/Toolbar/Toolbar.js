import React from 'react';
import classes from './Toolbar.module.css'
import Logo from '../../Logo/Logo'
import BurgerButton from '../../UI/BurgerButton/BurgerButton'
import NavigationItems from '../NavigationItems/NavigationItems'

const toolbar = (props) => (
    <header className={classes.Toolbar}>
        {/* <div>MENU</div> */}
        {/* <div className={[classes.Logo,classes.DesktopOnly].join(' ')}>
        </div> */}
        <div className={[classes.DesktopOnly, classes.Logo].join(' ')}>
            <Logo/>
        </div>
        <BurgerButton clicked={props.clicked}/>
        <nav className={classes.DesktopOnly}>
            <ul><NavigationItems/></ul>
        </nav>
    </header>
)

export default toolbar;