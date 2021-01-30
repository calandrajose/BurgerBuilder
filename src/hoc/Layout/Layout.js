import React, { useState } from 'react';
import {connect} from 'react-redux'

import Aux from '../Auxiliary/Auxiliary';
import classes from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';


const Layout = props =>{

    const [sideDrawerIsVisible, setSideDrawerIsVisible] = useState(false)

    const sideDrawerCloseHandler = ()=>{
        setSideDrawerIsVisible(false)
    }

    const sideDrawerToggleHandler = ()=>{
        setSideDrawerIsVisible(!sideDrawerIsVisible)
    }

        return (
            <Aux>
                <Toolbar 
                    isAuth = {props.isAuthenticated}
                    clicked={sideDrawerToggleHandler}
                    />
                <SideDrawer 
                    isAuth = {props.isAuthenticated}
                    key='key'
                    closed={sideDrawerCloseHandler} 
                    open={sideDrawerIsVisible}/>
                {/* <div>Toolbar, SideDrawer, Backdrop</div> */}
                <main className={classes.Content}>
                    {props.children}
                </main>
            </Aux>
        );
    }

const mapStateToProps = state =>{
    return{
        isAuthenticated: state.auth.token !== null
    }
}

export default connect(mapStateToProps)(Layout);