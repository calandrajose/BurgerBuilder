import React from 'react';
import logoImg from '../../assets/images/burger-logo.png'
import classes from './Logo.module.css'

const logo = () =>(

    <div className={classes.Logo}>
        <img src={logoImg} alt='logo'></img>
    </div>
)

export default logo;