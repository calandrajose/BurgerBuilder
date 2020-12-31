import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary';
import classes from './Layout.module.css';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer';

class Layout extends Component {

    state = {
        showSideDrawer: false
    }

    sideDrawerCloseHandler = ()=>{
        this.setState({showSideDrawer:false})
    }

    sideDrawerToggleHandler = ()=>{
        this.setState((prevState)=>{
            return {showSideDrawer: !prevState.showSideDrawer}
        })
    }

    render() {
        return (
            <Aux>
                <Toolbar 
                    clicked={this.sideDrawerToggleHandler}
                    />
                <SideDrawer 
                    closed={this.sideDrawerCloseHandler} 
                    open={this.state.showSideDrawer}/>
                {/* <div>Toolbar, SideDrawer, Backdrop</div> */}
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        );
    }
}

export default Layout;